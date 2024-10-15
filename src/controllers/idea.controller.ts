import prismaClient from "@core/config/database.config";
import { FastifyReply, FastifyRequest } from "fastify";
import { BasePaginateRequest, BaseRequest, BaseShowRequest } from "requests/base.request";
import { StoreRequest } from "requests/idea/store.request";

export default class IdeaController {

    public async index(request: FastifyRequest<BasePaginateRequest>, reply: FastifyReply) {

        const { page = 1 } = request.params;
        const perPage = 3;

        const ideas = await prismaClient.idea.findMany({
            skip: (Number(page) - 1) * perPage,
            take: perPage
        });

        return reply.send({
            success: true,
            data: ideas
        });
    }

    public async indexByCampaign(request: FastifyRequest<BaseShowRequest>, reply: FastifyReply) {

        const { id } = request.params;

        const ideas = await prismaClient.idea.findMany({
            where: {
                campaignId: Number(id)
            },
        });

        return reply.send({
            success: true,
            data: ideas
        });
    }

    public async store(request: FastifyRequest<BaseRequest<StoreRequest>>, reply: FastifyReply) {

        const { campaignId, departmentId, typeOfIdeaId, idea } = request.body;

        const campaign = await prismaClient.campaign.findFirst({
            where: {
                id: Number(campaignId)
            }
        });

        if (!campaign) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }

        if (campaign.endDate < new Date()) {
            return reply.status(400).send({
                error: 'Campaign ended'
            });
        }

        if (campaign.startDate > new Date()) {
            return reply.status(400).send({
                error: 'Campaign not started'
            });
        }

        const department = await prismaClient.department.findFirst({
            where: {
                id: Number(departmentId)
            }
        });

        if (!department) {
            return reply.status(400).send({
                error: 'Department not found'
            });
        }

        const typeOfIdea = await prismaClient.typeOfIdea.findFirst({
            where: {
                id: Number(typeOfIdeaId)
            }
        });

        if (!typeOfIdea) {
            return reply.status(400).send({
                error: 'Type of idea not found'
            });
        }

        const ideaCreated = await prismaClient.idea.create({
            data: {
                userId: Number(request.user.id),
                campaignId: Number(campaignId),
                departmentId: Number(departmentId),
                typeOfIdeaId: Number(typeOfIdeaId),
                idea
            }
        });

        return reply.send({
            success: true,
            data: ideaCreated
        });

    }

    public async show(request: FastifyRequest<BaseShowRequest>, reply: FastifyReply) {

        const { id } = request.params;

        const idea = await prismaClient.idea.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!idea) {
            return reply.status(400).send({
                error: 'Idea not found'
            });
        }

        return reply.send({
            success: true,
            data: idea
        });
    }

    public async moreSubmitted(request: FastifyRequest, reply: FastifyReply) {

        let rankedUsers = await prismaClient.idea.groupBy({
            by: ['userId'],
            _sum: {
                userId: true,
            },

            orderBy: {
                _sum: {
                    userId: 'desc',
                },
            },
            take: 5,
        });

        const ranked = await Promise.all(
            rankedUsers.map(async (user) => {

                const userData = await prismaClient.user.findFirst({
                    where: {
                        id: Number(user.userId)
                    }
                });

                console.log({ name: userData?.name, count: user._sum.userId })

                return { name: userData?.name, count: user._sum.userId }
            })
        );

        return reply.send({
            success: true,
            data: ranked
        });
    }

    public async moreImplemented(request: FastifyRequest, reply: FastifyReply) {
        let rankedUsers = await prismaClient.idea.groupBy({
            by: ['userId'],
            _sum: {
                userId: true,
            },
            where: {
                implemented: true
            },
            orderBy: {
                _sum: {
                    userId: 'desc',
                },
            },
            take: 5,
        });

        const ranked = await Promise.all(
            rankedUsers.map(async (user) => {

                const userData = await prismaClient.user.findFirst({
                    where: {
                        id: Number(user.userId)
                    }
                });

                console.log({ name: userData?.name, count: user._sum.userId })

                return { name: userData?.name, count: user._sum.userId }
            })
        );

        return reply.send({
            success: true,
            data: ranked
        });
    }

}