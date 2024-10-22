import prismaClient from "@core/config/database.config";
import uploadService from "@core/services/upload.service";
import { TypeOfIdea } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import _ from "lodash";
import moment from "moment";
import { BasePaginateRequest, BaseRequest, BaseShowRequest } from "requests/base.request";
import { StoreRequest } from "requests/idea/store.request";

export default class IdeaController {

    public async index(request: FastifyRequest<BasePaginateRequest>, reply: FastifyReply) {

        const { page = 1, campaignId, ideia } = request.query;

        const perPage = 3;

        const user = await prismaClient.user.findFirst({
            where: {
                id: Number(request.user.id)
            }
        });

        let ideas, total;

        if (user?.role !== "ADMIN") {
            ideas = await prismaClient.idea.findMany({
                skip: (Number(page) - 1) * perPage,
                take: perPage,
                where: {
                    campaignId: Number(campaignId) || undefined,
                    idea: ideia || undefined,
                    userId: Number(request.user.id)
                },
                include: {
                    campaign: {
                        select: {
                            thumbnail: true,
                            name: true
                        }
                    },
                    typeOfIdea: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            total = await prismaClient.idea.count({
                where: {
                    campaignId: Number(campaignId) || undefined,
                    idea: ideia || undefined
                }
            });
        } else {
            ideas = await prismaClient.idea.findMany({
                skip: (Number(page) - 1) * perPage,
                take: perPage,
                where: {
                    campaignId: Number(campaignId) || undefined,
                    idea: ideia || undefined,
                    evaluations: {
                        none: {
                            evaluatorId: Number(request.user.id),
                        },
                    },
                },
                include: {
                    campaign: {
                        select: {
                            thumbnail: true,
                            name: true,
                        },
                    },
                    typeOfIdea: {
                        select: {
                            name: true,
                        },
                    },
                    evaluations: true,
                },
            });

            total = await prismaClient.idea.count({
                where: {
                    campaignId: Number(campaignId) || undefined,
                    idea: ideia || undefined,
                    evaluations: {
                        none: {
                            evaluatorId: Number(request.user.id),
                        },
                    },
                }
            });

        }

        await Promise.all(
            ideas.map(async idea => {
                idea.campaign.thumbnail = await uploadService.link('campaigns', idea.campaign.thumbnail!);
                return idea
            })
        )

        return reply.send({
            success: true,
            data: {
                data: ideas,
                page: Number(page),
                perPage,
                total
            }
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

        const { campaignId, departmentId, typeOfIdeaId, title, idea } = request.body;

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
                title,
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

                return { name: userData?.name, count: user._sum.userId }
            })
        );

        return reply.send({
            success: true,
            data: ranked
        });
    }

    public async byUser(request: FastifyRequest, reply: FastifyReply) {

        const ideas = await prismaClient.idea.findMany({
            where: {
                userId: Number(request.user.id)
            },
            include: {
                campaign: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const types = await prismaClient.typeOfIdea.findMany();

        const now = moment();
        const startNow = now.startOf('month').toDate();
        const endNow = now.endOf('month').toDate();

        const last = moment().subtract(1, 'month');
        const startLast = last.startOf('month').toDate();
        const endLast = last.endOf('month').toDate();

        const currentMonthCount = await prismaClient.idea.count({
            where: {
                userId: Number(request.user.id),
                createdAt: {
                    gte: startNow,
                    lte: endNow,
                },
            },
        });

        const previousTypeMonthCount = await prismaClient.idea.count({
            where: {
                userId: Number(request.user.id),
                createdAt: {
                    gte: startLast,
                    lte: endLast,
                },
            },
        });

        let percentageTotal: number;

        if (previousTypeMonthCount === 0 && currentMonthCount === 0) {
            percentageTotal = 0;
        } else if (previousTypeMonthCount === 0 && currentMonthCount > 0) {
            percentageTotal = 100;
        } else {
            percentageTotal = ((currentMonthCount - previousTypeMonthCount) / previousTypeMonthCount) * 100;
        }

        const result = await Promise.all(
            types.map(async type => {

                const currentTypeMonthCount = await prismaClient.idea.count({
                    where: {
                        userId: Number(request.user.id),
                        typeOfIdeaId: type.id,
                        createdAt: {
                            gte: startNow,
                            lte: endNow,
                        },
                    },
                });

                const previousTypeMonthCount = await prismaClient.idea.count({
                    where: {
                        userId: Number(request.user.id),
                        typeOfIdeaId: type.id,
                        createdAt: {
                            gte: startLast,
                            lte: endLast,
                        },
                    },
                });

                let percentage: number;

                if (previousTypeMonthCount === 0 && currentTypeMonthCount === 0) {
                    percentage = 0;
                } else if (previousTypeMonthCount === 0 && currentTypeMonthCount > 0) {
                    percentage = 100;
                } else {
                    percentage = ((currentTypeMonthCount - previousTypeMonthCount) / previousTypeMonthCount) * 100;
                }

                return { ...type, percentage, count: currentTypeMonthCount }
            })
        );

        return reply.send({
            success: true,
            data: { total: ideas.length, percentageTotal, typeOfIdeas: result }
        })

    }

}