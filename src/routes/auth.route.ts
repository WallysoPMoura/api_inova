import AuthController from "controllers/auth.controller";
import { FastifyInstance } from "fastify";
import { ChangePasswordRequest } from "requests/auth/change-password.request";
import { ForgotPasswordRequest } from "requests/auth/forgot-password.request";
import { LoginRequest } from "requests/auth/login.request";
import { RegisterRequest } from "requests/auth/register.request";
import { VerifyTokenRequest } from "requests/auth/verify-token.request";
import { BaseRequest } from "requests/base.request";

const controller = new AuthController();

export async function handleAuthRoutes(instance: FastifyInstance): Promise<void> {
    
    instance.post<BaseRequest<RegisterRequest>>('/auth/register', controller.register);
    instance.post<BaseRequest<LoginRequest>>('/auth/login', controller.login);
    instance.post<BaseRequest<ForgotPasswordRequest>>('/auth/forgot-password', controller.forgotPassword);
    instance.post<BaseRequest<ChangePasswordRequest>>('/auth/change-password', controller.changePassword);
    instance.post<BaseRequest<VerifyTokenRequest>>('/auth/verify-token', controller.verifyToken);
    
}