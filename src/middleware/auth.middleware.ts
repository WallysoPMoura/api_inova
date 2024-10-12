import { FastifyRequest, FastifyReply } from 'fastify'
import { verify } from 'jsonwebtoken'
import { TokenPayload } from '@core/types/token.type'
import { AppException } from '@core/exception/app.exception'

export default async function AuthMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    reply.status(401).send(new AppException(
      'Necessário informar o token, faça seu login novamente caso o problema permanecer.',
      401,
      'JWT_TOKEN_NOT_FOUND',
    ))
    return
  }

  const [_, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, String(process.env.JWT_SECRET)) as TokenPayload

    const { sub } = decoded

    if (!sub) {
      reply.status(401).send(new AppException('Token JWT não recebido corretamente.', 401, 'INVALID_JWT_TOKEN'))
      return
    }

    request.user = {
      id: sub,
    };

  } catch (error) {
    reply.status(401).send(new AppException('O seu token JWT está inválido.', 401, 'INVALID_JWT_TOKEN'))
    return
  }
}