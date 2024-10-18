import prismaClient from "@core/config/database.config";
import { FastifyReply, FastifyRequest } from "fastify";
import { ChangePasswordRequest } from "requests/auth/change-password.request";
import { ForgotPasswordRequest } from "requests/auth/forgot-password.request";
import { LoginRequest } from "requests/auth/login.request";
import { RegisterRequest } from "requests/auth/register.request";
import { BaseRequest } from "requests/base.request";

import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import _ from "lodash";
import { Resend } from "resend";
import getMail from "emails";
import { VerifyTokenRequest } from "requests/auth/verify-token.request";


export default class AuthController {

    public async register(request: FastifyRequest<BaseRequest<RegisterRequest>>, reply: FastifyReply) {

        const { name, email, password, passwordConfirmation } = request.body;

        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email
            },
        });

        if (userAlreadyExists) {
            return reply.status(400).send({ error: 'User already exists' });
        }

        if (password !== passwordConfirmation) {
            return reply.status(400).send({ error: 'Passwords do not match' });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await prismaClient.user.create({
            data: {
                name,
                email,
                password: passwordHash
            },
        });

        return reply.send({
            success: true,
            data: 'User registered successfully',
        });

    }

    public async login(request: FastifyRequest<BaseRequest<LoginRequest>>, reply: FastifyReply) {

        const { email, password } = request.body;

        const user = await prismaClient.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return reply.status(401).send({ error: 'Incorrect user or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return reply.status(401).send({ error: 'Incorrect user or password' });
        }


        const token = jwt.sign({
            role: user.role
        }, String(process.env.JWT_SECRET), {
            expiresIn: '1d',
            subject: String(user.id),
        });

        reply.send({
            success: true,
            data: {
                ..._.omit(user, ['password', 'role']),
                token
            }
        })
    }

    public async forgotPassword(request: FastifyRequest<BaseRequest<ForgotPasswordRequest>>, reply: FastifyReply) {

        const { email } = request.body;

        const user = await prismaClient.user.findFirst({
            where: {
                email
            }
        })

        if (user) {
            //generate random 4 numbers
            const code = Math.floor(Math.random() * 100000);

            await prismaClient.passwordReset.create({
                data: {
                    userId: user.id,
                    token: String(code),
                    expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000), // uma hora de expiração
                }
            });

            const resend = new Resend(process.env.RESEND_API_KEY);
            const template = getMail('forgot-password', { name: user?.name, code: code })
    
            await resend.emails.send({
                from: "Inova-Se <inova-se@inoflame.tech>",
                to: [email],
                subject: "Recuperação de senha",
                html: template,
            });
        }

       

        reply.send({
            success: true,
            data: 'If the user exists, an email will be sent to reset the password',
        })
    }

    public async changePassword(request: FastifyRequest<BaseRequest<ChangePasswordRequest>>, reply: FastifyReply) {

        const { password, password_confirmation, token } = request.body;

        const passwordReset = await prismaClient.passwordReset.findFirst({
            where: {
                token
            }
        })

        if (!passwordReset) {
            return reply.status(400).send({ error: 'Invalid token' });
        }

        if (password != password_confirmation) {
            return reply.status(400).send({ error: 'Passwords do not match' });
        }

        await prismaClient.user.update({
            where: {
                id: passwordReset.userId
            },
            data: {
                password: await bcrypt.hash(password, 12)
            }
        });

        await prismaClient.passwordReset.delete({
            where: {
                id: passwordReset.id
            }
        });

        reply.send({
            success: true,
            data: 'Password changed successfully',
        })

    }

    public async verifyToken(request: FastifyRequest<BaseRequest<VerifyTokenRequest>>, reply: FastifyReply) {

        const { token } = request.body;

        const passwordReset = await prismaClient.passwordReset.findFirst({
            where: {
                token
            }
        });

        if (!passwordReset || passwordReset.expiresAt < new Date() || passwordReset.token != token) {
            return reply.status(400).send({ error: 'Invalid token' });
        }

        reply.send({
            success: true,
            data: Boolean(passwordReset && passwordReset.token == token),
        })

    }

}