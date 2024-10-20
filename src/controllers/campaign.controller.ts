import prismaClient from "@core/config/database.config";
import uploadService from "@core/services/upload.service";
import { randomUUID } from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";
import moment from "moment";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BaseShowRequest, BaseUpdateRequest, FastifyFormDataRequest } from "requests/base.request";
import { UpdateRequest } from "requests/campaign/update.request";

export default class CampaignController {

    public async index(request: FastifyRequest, reply: FastifyReply) {
        let campaigns = await prismaClient.campaign.findMany();

        campaigns = await Promise.all(
            campaigns.map(async campaign => {
                const link = await uploadService.link('campaigns', campaign.thumbnail!);
                return { ...campaign, thumbnail: link };
            })
        );

        return reply.send({
            success: true,
            data: campaigns
        });
    }

    public async random(request: FastifyRequest, reply: FastifyReply) {
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

        if(totalCampaigns === 0) {
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
            take: 1, // Pega apenas uma campanha
        });

        if (!campaigns) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }

        const campaign = campaigns[0];

        campaign.thumbnail = await uploadService.link('campaigns', campaign.thumbnail!);

        return reply.send({
            success: true,
            data: campaign
        })
    }

    public async store(request: FastifyRequest, reply: FastifyReply) {

        const formDataRequest = request as FastifyFormDataRequest;

        const formData = await formDataRequest.formData()

        const fields = {
            name: formData.get('name') as string,
            slug: formData.get('slug') as string,
            description: formData.get('description') as string,
            startdate: formData.get('startdate') as string,
            enddate: formData.get('enddate') as string,
            thumbnail: formData.get('thumbnail') as File,
        }

        const missingFields = Object.entries(fields).filter(([key, value]) => !value).map(([key]) => key);

        if (missingFields.length > 0) {
            return reply.status(400).send({
                error: 'Missing data',
                missingFields,
            });
        }

        const arrayBuffer = await fields.thumbnail.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const exists = await prismaClient.campaign.findFirst({
            where: {
                slug: fields.slug,
                name: fields.name
            }
        });

        if (exists) {
            return reply.status(400).send({
                error: 'Campaign already exists'
            });
        }

        const uuid = `${randomUUID()}.${fields.thumbnail.name.split('.').pop()}`;

        await uploadService.store('campaigns', uuid, fields.thumbnail.type, buffer);

        const campaign = await prismaClient.campaign.create({
            data: {
                name: fields.name,
                slug: fields.slug,
                description: fields.description,
                startDate: moment(fields.startdate).toDate(),
                endDate: moment(fields.enddate).toDate(),
                thumbnail: uuid
            }
        });

        return reply.send({
            success: true,
            data: campaign
        });
    }

    public async update(request: FastifyRequest<BaseUpdateRequest<UpdateRequest>>, reply: FastifyReply) {


        const { name, slug, description, startdate, enddate } = request.body;
        const { id } = request.params;

        const exists = await prismaClient.campaign.findFirst({
            where: {
                id: Number(id),
            }
        });

        if (!exists) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }

        const campaign = await prismaClient.campaign.update({
            where: {
                id: Number(id)
            },
            data: {
                name,
                slug,
                description,
                startDate: moment(startdate).toDate(),
                endDate: moment(enddate).toDate()
            }
        });

        return reply.send({
            success: true,
            data: campaign
        });
    }

    public async show(request: FastifyRequest<BaseShowRequest>, reply: FastifyReply) {

        const { id } = request.params;

        const campaign = await prismaClient.campaign.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!campaign) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }
        
        campaign.thumbnail = await uploadService.link('campaigns', campaign.thumbnail!);

        return reply.send({
            success: true,
            data: campaign
        });
    }

    public async delete(request: FastifyRequest<BaseDeleteRequest>, reply: FastifyReply) {

        const { id } = request.params;

        const exists = await prismaClient.campaign.findFirst({
            where: {
                id: Number(id)
            }
        });

        if (!exists) {
            return reply.status(400).send({
                error: 'Campaign not found'
            });
        }

        await prismaClient.campaign.delete({
            where: {
                id: Number(id)
            }
        });

        return reply.send({
            success: true,
            data: 'Campaign deleted'
        });
    }

}