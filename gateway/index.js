import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

console.log('\n╔══════════════════════════════════════════╗');
console.log('║  🚀  Apollo Federation Gateway          ║');
console.log('╚══════════════════════════════════════════╝\n');

// Initialize Apollo Gateway with subgraph configurations
const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { 
        name: 'products', 
        url: 'http://localhost:8081/graphql' 
      },
      { 
        name: 'orders', 
        url: 'http://localhost:8082/graphql' 
      },
      { 
        name: 'customers', 
        url: 'http://localhost:8083/graphql' 
      },
    ],
    // Polling interval to check for schema changes (in milliseconds)
    pollIntervalInMs: 10000,
  }),
  debug: true,
});

// Handle gateway errors
gateway.onSchemaLoadOrUpdate((schemaContext) => {
  console.log('✅ Gateway: Schema loaded successfully');
  console.log(`   - Subgraphs: ${schemaContext.apiSchema ? 'Composed' : 'Failed to compose'}`);
});

// Create Apollo Server with the gateway
const server = new ApolloServer({
  gateway,
  // Enable introspection and playground in production (for demo purposes)
  introspection: true,
  plugins: [
    {
      async serverWillStart() {
        console.log('🚀 Gateway: Server starting...');
      },
      async requestDidStart() {
        return {
          async didResolveOperation(requestContext) {
            console.log(`📥 Gateway: Query received - ${requestContext.request.operationName || 'Anonymous'}`);
          },
          async willSendResponse(requestContext) {
            console.log(`📤 Gateway: Response sent - ${requestContext.request.operationName || 'Anonymous'}`);
          },
        };
      },
    },
  ],
});

// Start the server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    // You can add context here (auth tokens, user info, etc.)
    headers: req.headers,
  }),
});

console.log(`\n✨ Apollo Federation Gateway ready at ${url}`);
console.log(`\n📊 GraphQL Playground: ${url}`);
console.log('\n📡 Connected Subgraphs:');
console.log('   - Products Service:  http://localhost:8081/graphql');
console.log('   - Orders Service:    http://localhost:8082/graphql');
console.log('   - Customers Service: http://localhost:8083/graphql');
console.log('\n💡 Example queries available at the playground!\n');
