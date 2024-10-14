export type BaseRequest<T> = {
    Body: T
}

export type BaseUpdateRequest<T> = {
    Body: T
    Params: {
        id: string
    }
}