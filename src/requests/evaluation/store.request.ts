import { FastifySchema } from "fastify"

export type StoreRequest = {
    ideaId: number
    inovation: number
    implementation: number
    observation: string
}

export const StoreSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            ideaId: { type: 'number' },
            inovation: { type: 'number' },
            implementation: { type: 'number' },
            observation: { type: 'string' },
        },
        required: ['ideaId', 'inovation', 'implementation', 'observation'],
        additionalProperties: false
    }
}