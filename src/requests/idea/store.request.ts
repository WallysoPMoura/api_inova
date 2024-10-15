import { FastifySchema } from "fastify"

export type StoreRequest = {
    campaignId: number
    departmentId: number
    typeOfIdeaId: number
    idea: string
}

export const StoreSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            campaignId: { type: 'number' },
            departmentId: { type: 'number' },
            typeOfIdeaId: { type: 'number' },
            idea: { type: 'string' },
        },
        required: ['campaignId', 'departmentId', 'typeOfIdeaId', 'idea'],
        additionalProperties: false
    }
}