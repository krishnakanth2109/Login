require('dotenv').config();

const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const { initializeApp, cert } = require('firebase-admin/app');
const schema = require('./src/graphql/schema');
const resolvers = require('./src/graphql/resolvers');
const authenticate = require('./src/middleware/auth');
const mercurius = require('mercurius'); // ✅ add this

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
initializeApp({
  credential: cert(serviceAccount),
});

// Register CORS
fastify.register(cors, {
  origin: 'http://localhost:3000', // frontend origin
});

// Authentication hook (runs before every request)
fastify.addHook('onRequest', async (request, reply) => {
  await authenticate(request, reply);
  request.context = { user: request.user };
});

// Register GraphQL
fastify.register(mercurius, {
  schema,
  resolvers,
  graphiql: true, // enables GraphiQL UI at /graphiql
  context: (request) => ({ user: request.user }),
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 4000 });
    fastify.log.info(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}/graphiql`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
