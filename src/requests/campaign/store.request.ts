import { FastifySchema } from "fastify"

export type StoreRequest = {
    name: string,
    slug: string,
    description: string,
    startdate: string,
    enddate: string
}

export const StoreSchema: FastifySchema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            startdate: { type: 'string' },
            enddate: { type: 'string' }
        },
        required: ['name', 'slug', 'description', 'startdate', 'enddate'],
        additionalProperties: false
    }
}