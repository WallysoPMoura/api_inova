import AuthMiddleware from "@middleware/auth.middleware";
import DepartamentController from "controllers/departament.controller";
import { FastifyInstance } from "fastify";
import { BaseDeleteRequest } from "requests/base-delete.request";
import { BaseRequest, BaseUpdateRequest } from "requests/base.request";
import { StoreRequest, StoreSchema } from "requests/department/store.request";
import { UpdateRequest, UpdateSchema } from "requests/department/update.request";

const controller = new DepartamentController();

export async function handleDepartamentRoutes(instance: FastifyInstance): Promise<void> {
    
    instance.get('/department', { preValidation: [AuthMiddleware] }, controller.index);
    instance.post<BaseRequest<StoreRequest>>('/department', { preValidation: [AuthMiddleware], schema: StoreSchema }, controller.store);
    instance.put<BaseUpdateRequest<UpdateRequest>>('/department/:id', { preValidation: [AuthMiddleware], schema: UpdateSchema }, controller.update);
    instance.delete<BaseDeleteRequest>('/department/:id', { preValidation: [AuthMiddleware] }, controller.delete);
    
}