import AuthMiddleware from "@middleware/auth.middleware";
import TypeOfIdeaController from "controllers/typeofidea.controller";
import { FastifyInstance } from "fastify";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BaseRequest, BaseUpdateRequest } from "requests/base.request";
import { StoreRequest, StoreSchema } from "requests/typeofidea/store.request";
import { UpdateRequest, UpdateSchema } from "requests/typeofidea/update.request";

const controller = new TypeOfIdeaController();

export async function handleTypeOfIdeaRoutes(instance: FastifyInstance): Promise<void> {
    
    instance.get('/typeofidea', { preValidation: [AuthMiddleware] }, controller.index);
    instance.post<BaseRequest<StoreRequest>>('/typeofidea', { preValidation: [AuthMiddleware], schema: StoreSchema }, controller.store);
    instance.put<BaseUpdateRequest<UpdateRequest>>('/typeofidea/:id', { preValidation: [AuthMiddleware], schema: UpdateSchema }, controller.update);
    instance.delete<BaseDeleteRequest>('/typeofidea/:id', { preValidation: [AuthMiddleware] }, controller.delete);
    
}