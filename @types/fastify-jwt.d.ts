import { User } from "@core/types/user.type";

/* eslint-disable @typescript-eslint/naming-convention */
declare module '@fastify/jwt' {
    interface FastifyJWT {
      user: User;
    }
  }