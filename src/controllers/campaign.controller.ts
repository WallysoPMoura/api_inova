import prismaClient from "@core/config/database.config";
import { FastifyReply, FastifyRequest } from "fastify";
import moment from "moment";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BaseRequest, BaseShowRequest, BaseUpdateRequest } from "requests/base.request";
import { StoreRequest } from "requests/campaign/store.request";
import { UpdateRequest } from "requests/campaign/update.request";

export default class CampaignController {

    public async index(request: FastifyRequest, reply: FastifyReply) {
        const campaigns = await prismaClient.campaign.findMany();
        
        return reply.send({
            success: true,
            data: campaigns
        });
    }

    public async store(request: FastifyRequest<BaseRequest<StoreRequest>>, reply: FastifyReply) {

        const { name, slug, description, startdate, enddate } = request.body;

        const exists = await prismaClient.campaign.findFirst({
            where: {
                slug,
                name
            }
        });

        if (exists) {
            return reply.status(400).send({
                error: 'Campaign already exists'
            });
        }
   
        const campaign = await prismaClient.campaign.create({
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