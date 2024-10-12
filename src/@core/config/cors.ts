import { FastifyCorsOptions } from '@fastify/cors';

const corsConfig: FastifyCorsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default corsConfig;