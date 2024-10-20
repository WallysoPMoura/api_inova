import { FastifyRequest, FastifySchema, RouteGenericInterface, RouteShorthandMethod } from "fastify"

export interface FastifyFormDataRequest extends FastifyRequest, RouteGenericInterface {
    formData: () => Promise<FormData>;
}

export type BaseRequest<T> = {
    Body: T,
    
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
    Querystring: {
        page?: number;
        [key: string]: any;
    }
}


export type BaseSearchRequest<T> = {
    Params: {
        search: string,
        param: T
    }
}


export const BasePaginateSchema: FastifySchema = {
    querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          
        },
        additionalProperties: true,
      }
}