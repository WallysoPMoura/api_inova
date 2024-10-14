import prismaClient from "@core/config/database.config";
import { FastifyReply, FastifyRequest } from "fastify";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BaseRequest, BaseUpdateRequest } from "requests/base.request";
import { StoreRequest } from "requests/typeofidea/store.request";
import { UpdateRequest } from "requests/typeofidea/update.request";

export default class TypeOfIdeaController {

    public async index(request: FastifyRequest, reply: FastifyReply) {
        const types = await prismaClient.typeOfIdea.findMany();
        
        reply.send({
            success: true,
            data: types
        })
    }

    public async store(request: FastifyRequest<BaseRequest<StoreRequest>>, reply: FastifyReply) {

        const { name } = request.body;

        const exists = await prismaClient.typeOfIdea.findFirst({
            where: {
                name
            }
        });

        if (exists) {
            return reply.status(400).send({
                error: 'Type of idea already exists'
            })
        }

        const type = await prismaClient.typeOfIdea.create({
            data: {
                name
            }
        })
        
        reply.send({
            success: true,
            data: type
        })

    }

    public async update(request: FastifyRequest<BaseUpdateRequest<UpdateRequest>>, reply: FastifyReply) {

        const { name } = request.body;
        const { id } = request.params;

        const type = await prismaClient.typeOfIdea.update({
            where: {
                id: Number(id),
            },
            data: {
                name
            }
        })

        reply.send({
            success: true,
            data: type
        });
    }

    public async delete(request: FastifyRequest<BaseDeleteRequest>, reply: FastifyReply) {

        const { id } = request.params;

        const exists = await prismaClient.typeOfIdea.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!exists) {
            return reply.status(400).send({
                error: 'Type of idea not found'
            })
        }

        await prismaClient.typeOfIdea.delete({
            where: {
                id: Number(id)
            }
        })

        reply.send({
            success: true,
            data: 'Type of idea deleted'
        });
    }

}
