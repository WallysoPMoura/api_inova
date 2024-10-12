import { FastifyInstance } from "fastify";
import { handleAuthRoutes } from "./auth.route";

export async function routes(instance: FastifyInstance): Promise<void> {
    
    handleAuthRoutes(instance);

}