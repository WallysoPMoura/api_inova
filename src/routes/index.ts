import { FastifyInstance } from "fastify";
import { handleAuthRoutes } from "./auth.route";
import { handleDepartamentRoutes } from "./department.route";
import { handleTypeOfIdeaRoutes } from "./typeofidea.route";
import { handleCampaignRoutes } from "./campaign.route";
import { handleIdeaRoutes } from "./idea.route";
import { handleEvaluationRoutes } from "./evaluation.route";

export async function routes(instance: FastifyInstance): Promise<void> {
    
    handleAuthRoutes(instance);
    handleDepartamentRoutes(instance);
    handleTypeOfIdeaRoutes(instance);
    handleCampaignRoutes(instance);
    handleIdeaRoutes(instance);
    handleEvaluationRoutes(instance);

}