import { FastifySchema } from "fastify"

export type BaseRequest<T> = {
    Body: T
}

export type BaseUpdateRequest<T> = {
    Body: T
    Params: {
        id: string
    }
}

export type BaseShowRequest = {
    Params: {
        id: string
    }
}

export type BasePaginateRequest = {
    Params: {
        page: number,
    }
}

export const BasePaginateSchema: FastifySchema = {
    querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' },
        },
        required: ['page'],
        additionalProperties: false,
      }
}