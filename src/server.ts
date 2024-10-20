import fastify from "fastify";
import cors from "@fastify/cors";
import corsConfig from "@core/config/cors";
import jwt from "@fastify/jwt";
import { routes } from "routes";

import formbody from '@fastify/formbody'

const server = fastify({
    logger: true,
    trustProxy: true
});

server.register(require('@fastify/multipart'), { attachFieldsToBody: true })
server.register(formbody)

server.register(jwt, { secret: String(process.env.JWT_SECRET) });
server.register(cors, corsConfig);


server.register(routes, { prefix: "/api" });

export default server;