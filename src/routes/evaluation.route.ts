import AuthMiddleware from "@middleware/auth.middleware";
import EvaluationController from "controllers/evaluation.controller";
import { FastifyInstance } from "fastify";
import { BaseRequest } from "requests/base.request";
import { StoreRequest, StoreSchema } from "requests/evaluation/store.request";

const controller = new EvaluationController();

export async function handleEvaluationRoutes(instance: FastifyInstance): Promise<void> {
    
    instance.get('/evaluation', { preValidation: [AuthMiddleware] }, controller.index);
    instance.get('/evaluation/rank', { preValidation: [AuthMiddleware] }, controller.ranked);
    instance.post<BaseRequest<StoreRequest>>('/evaluation', { preValidation: [AuthMiddleware], schema: StoreSchema }, controller.store);
    
}