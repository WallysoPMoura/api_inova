import server from "server";

server.listen({
    host: process.env.HOST as string,
    port: Number(process.env.PORT) ?? 3333
})