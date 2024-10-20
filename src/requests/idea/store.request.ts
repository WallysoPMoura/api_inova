import { FastifySchema } from "fastify"

export type StoreRequest = {
    campaignId: number
    departmentId: number
    typeOfIdeaId: number
    title: string
    idea: string
}

export const StoreSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            campaignId: { type: 'number' },
            departmentId: { type: 'number' },
            typeOfIdeaId: { type: 'number' },
            title: { type: 'string' },
            idea: { type: 'string' },
        },
        required: ['campaignId', 'departmentId', 'typeOfIdeaId', 'idea', 'title'],
        additionalProperties: false
    }
}