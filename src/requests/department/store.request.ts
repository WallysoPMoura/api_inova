import { FastifySchema } from "fastify"

export type StoreRequest = {
    name: string
}

export const StoreSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false
    }
}