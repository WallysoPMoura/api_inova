import AuthMiddleware from "@middleware/auth.middleware";
import IdeaController from "controllers/idea.controller";
import { FastifyInstance } from "fastify";
import { BasePaginateRequest, BasePaginateSchema, BaseRequest, BaseSearchRequest, BaseShowRequest } from "requests/base.request";

import { StoreRequest, StoreSchema } from "requests/idea/store.request";

const controller = new IdeaController();

export async function handleIdeaRoutes(instance: FastifyInstance): Promise<void> {

    instance.get<BasePaginateRequest>('/idea', { preValidation: [AuthMiddleware], schema: BasePaginateSchema }, controller.index);
    instance.get<BaseShowRequest>('/idea/campaign/:id', { preValidation: [AuthMiddleware] }, controller.indexByCampaign);
    instance.get('/idea/more-submitted', { preValidation: [AuthMiddleware] }, controller.moreSubmitted);
    instance.get('/idea/more-implemented', { preValidation: [AuthMiddleware] }, controller.moreImplemented);
    instance.get<BaseShowRequest>('/idea/:id', { preValidation: [AuthMiddleware] }, controller.show);
    instance.post<BaseRequest<StoreRequest>>('/idea', { preValidation: [AuthMiddleware], schema: StoreSchema }, controller.store);
    
    
}