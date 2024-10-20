import prismaClient from "@core/config/database.config";
import { FastifyReply, FastifyRequest } from "fastify";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BaseRequest, BaseUpdateRequest } from "requests/base.request";
import { StoreRequest } from "requests/department/store.request";
import { UpdateRequest } from "requests/department/update.request";

export default class DepartmentController {
    
    public async index(request: FastifyRequest, reply: FastifyReply) {
        const types = await prismaClient.department.findMany();

        reply.send({
            success: true,
            data: types
        });
    }

    public async store(request: FastifyRequest<BaseRequest<StoreRequest>>, reply: FastifyReply) {

        const { name } = request.body;

        const exists = await prismaClient.department.findFirst({
            where: {
                name
            }
        });

        if (exists) {
            return reply.status(400).send({
                error: 'Department already exists'
            })
        }

        const type = await prismaClient.department.create({
            data: {
                name
            }
        });

        reply.send({
            success: true,
            data: type
        });
    }

    public async update(request: FastifyRequest<BaseUpdateRequest<UpdateRequest>>, reply: FastifyReply) {

        const { name } = request.body;
        const { id } = request.params;

        const type = await prismaClient.department.update({
            where: {
                id: Number(id)
            },
            data: {
                name
            }
        });

        if (!type) {
            return reply.status(400).send({
                error: 'Department not found'
            })
        }

        reply.send({
            success: true,
            data: type
        });

    }

    public async delete(request: FastifyRequest<BaseDeleteRequest>, reply: FastifyReply) {

        const { id } = request.params;

        const exists = await prismaClient.department.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!exists) {
            return reply.status(400).send({
                error: 'Department not found'
            })
        }

        await prismaClient.department.delete({
            where: {
                id: Number(id)
            }
        });

        reply.send({
            success: true,
            data: 'Department deleted'
        });

    }


}