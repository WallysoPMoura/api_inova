import AuthMiddleware from "@middleware/auth.middleware";
import CampaignController from "controllers/campaign.controller";
import { FastifyInstance } from "fastify";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BasePaginateRequest, BaseRequest, BaseShowRequest, BaseUpdateRequest } from "requests/base.request";
import { StoreRequest, StoreSchema } from "requests/campaign/store.request";
import { UpdateRequest, UpdateSchema } from "requests/campaign/update.request";

const controller = new CampaignController();

export async function handleCampaignRoutes(instance: FastifyInstance): Promise<void> {
    
    instance.get('/campaign', { preValidation: [AuthMiddleware] }, controller.index);
    instance.get<BaseShowRequest>('/campaign/:id', { preValidation: [AuthMiddleware] }, controller.show);
    instance.post<BaseRequest<StoreRequest>>('/campaign', { preValidation: [AuthMiddleware], schema: StoreSchema }, controller.store);
    instance.put<BaseUpdateRequest<UpdateRequest>>('/campaign/:id', { preValidation: [AuthMiddleware], schema: UpdateSchema }, controller.update);
    instance.delete<BaseDeleteRequest>('/campaign/:id', { preValidation: [AuthMiddleware] }, controller.delete);
    
}