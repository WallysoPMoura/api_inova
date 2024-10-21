import prismaClient from "@core/config/database.config";
import { promises } from "dns";
import { FastifyReply, FastifyRequest } from "fastify";
import { BaseRequest } from "requests/base.request";
import { StoreRequest } from "requests/evaluation/store.request";

export default class EvaluationController {

    public async index(request: FastifyRequest, reply: FastifyReply) {

        const user = await prismaClient.user.findFirst({
            where: {
                id: Number(request.user.id)
            }
        });

        if (user?.role !== "ADMIN") {
            reply.send({
                success: false,
                error: "Unauthorized"
            });
        }

        const ideas = await prismaClient.idea.findMany();

        return reply.send({ success: true, data: ideas });
    }

    public async ranked(request: FastifyRequest, reply: FastifyReply) {

        const totalCampaigns = await prismaClient.campaign.count({
            where: {
                endDate: {
                    gte: new Date(),
                },
                startDate: {
                    lte: new Date(),
                },
            },
        });

        if (totalCampaigns === 0) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }

        const randomIndex = Math.floor(Math.random() * totalCampaigns);

        let campaigns = await prismaClient.campaign.findMany({
            where: {
                endDate: {
                    gte: new Date(),
                },
                startDate: {
                    lte: new Date(),
                },
            },
            skip: randomIndex,
            take: 1,
        });

        if (!campaigns) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }

        const ranked = await prismaClient.evaluation.groupBy({
            by: ['id', 'ideaId'],
            _sum: {
                inovation: true,
                implementation: true,
            },
        });

        const rankedSorted = ranked.sort((a, b) => {
            const sumA = (a._sum.inovation || 0) + (a._sum.implementation || 0);
            const sumB = (b._sum.inovation || 0) + (b._sum.implementation || 0);
            return sumB - sumA;
        });

        const rank = await Promise.all(
            rankedSorted.map(async (rank) => {
                const idea = await prismaClient.idea.findFirst({
                    where: {
                        id: Number(rank.ideaId),
                    }
                });
    
                if(!idea) {
                    return reply.status(400).send({
                        error: 'Idea not found'
                    });
                }
    
                return { count: Number(rank._sum.inovation) + Number(rank._sum.implementation), name: idea.title }
            })
        );

        reply.send({ success: true, data: rank })
    }


    public async store(request: FastifyRequest<BaseRequest<StoreRequest>>, reply: FastifyReply) {

        const { ideaId, inovation, implementation, observation } = request.body;

        const user = await prismaClient.user.findFirst({
            where: {
                id: Number(request.user.id)
            }
        });

        if (user?.role == "USER") {
            reply.send({
                success: false,
                error: "Unauthorized"
            });
        }

        const idea = await prismaClient.idea.findFirst({
            where: {
                id: Number(ideaId)
            }
        });

        if (!idea) {
            return reply.status(400).send({
                error: 'Idea not found'
            });
        }

        const evaluated = await prismaClient.evaluation.findFirst({
            where: {
                ideaId: Number(ideaId),
                evaluatorId: Number(request.user.id)
            }
        });

        if (evaluated) {
            return reply.status(400).send({
                error: 'Already evaluated'
            });
        }

        const evaluation = await prismaClient.evaluation.create({
            data: {
                ideaId: Number(ideaId),
                inovation,
                implementation,
                observation,
                evaluatorId: Number(request.user.id)
            }
        });

        return reply.send({ success: true, data: evaluation });

    }

}
