import { FastifySchema } from "fastify";

export type UpdateRequest = {
    name: string;
}

export const UpdateSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false
    }
}