import { FastifyInstance } from "fastify";
import { handleAuthRoutes } from "./auth.route";
import { handleDepartamentRoutes } from "./departament.route";
import { handleTypeOfIdeaRoutes } from "./typeofidea.route";

export async function routes(instance: FastifyInstance): Promise<void> {
    
    handleAuthRoutes(instance);
    handleDepartamentRoutes(instance);
    handleTypeOfIdeaRoutes(instance);

}