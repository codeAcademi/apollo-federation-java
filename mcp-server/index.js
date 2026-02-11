import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n╔══════════════════════════════════════════╗');
console.log('║  🤖  Apollo MCP Server                  ║');
console.log('╚══════════════════════════════════════════╝\n');

const GATEWAY_URL = 'http://localhost:4000/graphql';
const HTTP_PORT = 5001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// Initialize Anthropic client
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

// Create Express server for HTTP API
const app = express();
app.use(cors());
app.use(express.json());

// Create MCP server instance
const server = new Server(
  {
    name: 'apollo-graphql-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to execute GraphQL queries
async function executeGraphQL(query, variables = {}) {
  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    
    if (result.errors) {
      return {
        error: true,
        message: result.errors.map(e => e.message).join(', '),
        details: result.errors,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
    };
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.log('📋 MCP: Listing available tools');
  
  return {
    tools: [
      {
        name: 'get_products',
        description: 'Get all products from the catalog or filter by category',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Optional: Filter products by category (e.g., Electronics, Furniture)',
            },
          },
        },
      },
      {
        name: 'search_products',
        description: 'Search for products by name or SKU',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for product name or SKU',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_customers',
        description: 'Get all customers or filter by loyalty tier',
        inputSchema: {
          type: 'object',
          properties: {
            tier: {
              type: 'string',
              description: 'Optional: Filter by loyalty tier (BRONZE, SILVER, GOLD, PLATINUM)',
            },
          },
        },
      },
      {
        name: 'get_customer_orders',
        description: 'Get order history for a specific customer',
        inputSchema: {
          type: 'object',
          properties: {
            customerId: {
              type: 'string',
              description: 'Customer ID',
            },
          },
          required: ['customerId'],
        },
      },
      {
        name: 'get_orders',
        description: 'Get all orders or filter by status',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Optional: Filter by order status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)',
            },
          },
        },
      },
      {
        name: 'create_order',
        description: 'Create a new order for a customer',
        inputSchema: {
          type: 'object',
          properties: {
            customerId: {
              type: 'string',
              description: 'Customer ID',
            },
            items: {
              type: 'array',
              description: 'Array of order items',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'number' },
                  price: { type: 'number' },
                },
              },
            },
          },
          required: ['customerId', 'items'],
        },
      },
      {
        name: 'update_order_status',
        description: 'Update the status of an existing order',
        inputSchema: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'Order ID',
            },
            status: {
              type: 'string',
              description: 'New status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)',
            },
          },
          required: ['orderId', 'status'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.log(`🔧 MCP: Tool called - ${name}`);
  console.log(`   Args: ${JSON.stringify(args)}`);

  try {
    switch (name) {
      case 'get_products': {
        const query = args.category
          ? `query { productsByCategory(category: "${args.category}") { id name category price stock sku } }`
          : `query { products { id name category price stock sku } }`;
        
        const result = await executeGraphQL(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_products': {
        const query = `query { searchProducts(query: "${args.query}") { id name category price stock sku } }`;
        const result = await executeGraphQL(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_customers': {
        const query = args.tier
          ? `query { customersByTier(tier: "${args.tier}") { id name email tier loyaltyPoints } }`
          : `query { customers { id name email tier loyaltyPoints } }`;
        
        const result = await executeGraphQL(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_customer_orders': {
        const query = `
          query {
            customer(id: "${args.customerId}") {
              id
              name
              email
              orders {
                id
                totalAmount
                status
                createdAt
                items {
                  productId
                  quantity
                  price
                }
              }
            }
          }
        `;
        const result = await executeGraphQL(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_orders': {
        const query = args.status
          ? `query { ordersByStatus(status: "${args.status}") { id customerId totalAmount status createdAt items { productId quantity price } } }`
          : `query { orders { id customerId totalAmount status createdAt items { productId quantity price } } }`;
        
        const result = await executeGraphQL(query);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_order': {
        const mutation = `
          mutation {
            createOrder(
              customerId: "${args.customerId}"
              items: ${JSON.stringify(args.items).replace(/"([^"]+)":/g, '$1:')}
            ) {
              id
              customerId
              totalAmount
              status
              createdAt
            }
          }
        `;
        const result = await executeGraphQL(mutation);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'update_order_status': {
        const mutation = `
          mutation {
            updateOrderStatus(orderId: "${args.orderId}", status: "${args.status}") {
              id
              status
              updatedAt
            }
          }
        `;
        const result = await executeGraphQL(mutation);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

// AI-powered intent detection using Claude
async function detectIntentWithAI(userMessage) {
  if (!anthropic) {
    console.warn('⚠️  Anthropic API key not configured, using fallback keyword detection');
    return detectIntentFallback(userMessage);
  }

  try {
    const systemPrompt = `You are an intent detection system for an e-commerce API. Analyze user messages and determine the appropriate API call.

Available tools:
1. get_products - Get all products or filter by category (Electronics, Furniture)
2. search_products - Search products by name or SKU
3. get_customers - Get all customers or filter by tier (BRONZE, SILVER, GOLD, PLATINUM)
4. get_customer_orders - Get order history for a specific customer (requires customerId OR customerName)
5. get_orders - Get all orders or filter by status
6. create_order - Create a new order for a customer
7. update_order_status - Update order status

Available fields for each entity:
- Products: id, name, category, price, stock, sku
- Customers: id, name, email, tier, loyaltyPoints, address (street, city, state, zipCode, country)
- Orders: id, customerId, totalAmount, status, createdAt, items (productId, quantity, price)

IMPORTANT: 
- If user mentions a customer by name (e.g., "Alice", "John"), use "customerName" parameter instead of customerId
- If user mentions "customer 1" or "customer ID 1", use "customerId" parameter
- Extract names naturally from phrases like "orders of Alice", "Alice's orders", "for customer Alice"

Respond ONLY with a JSON object containing:
- "tool": the tool name
- "arguments": object with required parameters (use "customerName" for names, "customerId" for IDs)
- "fields": array of field names the user wants to see (if not specified, return ["all"])

Examples:
{"tool": "get_products", "arguments": {}, "fields": ["all"]}
{"tool": "get_products", "arguments": {}, "fields": ["name"]}
{"tool": "get_customer_orders", "arguments": {"customerId": "1"}, "fields": ["all"]}
{"tool": "get_customer_orders", "arguments": {"customerName": "Alice"}, "fields": ["all"]}
{"tool": "get_customers", "arguments": {"tier": "GOLD"}, "fields": ["name", "email"]}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `User message: "${userMessage}"\n\nDetect intent and extract parameters. Return ONLY valid JSON, no markdown formatting.`
      }],
      system: systemPrompt
    });

    const content = response.content[0].text.trim();
    console.log('🤖 Claude Response:', content);
    
    // Remove markdown code blocks if present
    const cleanJson = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const intent = JSON.parse(cleanJson);
    return { 
      toolName: intent.tool, 
      toolArgs: intent.arguments,
      fields: intent.fields || ['all']
    };
  } catch (error) {
    console.error('❌ AI Intent Detection Error:', error.message);
    return detectIntentFallback(userMessage);
  }
}

// Fallback keyword-based detection
function detectIntentFallback(message) {
  const lowerMessage = message.toLowerCase();
  let toolName = null;
  let toolArgs = {};
  let fields = ['all'];

  if (lowerMessage.includes('product') && (lowerMessage.includes('search') || lowerMessage.includes('find'))) {
    toolName = 'search_products';
    const match = message.match(/search.*?for\s+(.+)|find.*?product.*?(\w+)|search\s+(\w+)/i);
    toolArgs.query = match ? (match[1] || match[2] || match[3]) : message.replace(/search|find|product/gi, '').trim();
  } else if (lowerMessage.includes('product') || lowerMessage.includes('catalog')) {
    toolName = 'get_products';
    const categories = ['electronics', 'furniture'];
    const foundCategory = categories.find(cat => lowerMessage.includes(cat));
    if (foundCategory) {
      toolArgs.category = foundCategory.charAt(0).toUpperCase() + foundCategory.slice(1);
    }
  } else if (lowerMessage.includes('customer') && lowerMessage.includes('order')) {
    toolName = 'get_customer_orders';
    const idMatch = message.match(/customer\s+(\d+)|id\s+(\d+)/i);
    toolArgs.customerId = idMatch ? (idMatch[1] || idMatch[2]) : '1';
  } else if (lowerMessage.includes('customer')) {
    toolName = 'get_customers';
    const tiers = ['bronze', 'silver', 'gold', 'platinum'];
    const foundTier = tiers.find(tier => lowerMessage.includes(tier));
    if (foundTier) {
      toolArgs.tier = foundTier.toUpperCase();
    }
  } else if (lowerMessage.includes('order') && (lowerMessage.includes('create') || lowerMessage.includes('new'))) {
    toolName = 'create_order';
    const customerMatch = message.match(/customer\s+(\d+)/i);
    const productMatch = message.match(/product\s+(\d+)/i);
    const quantityMatch = message.match(/(\d+)\s+(?:unit|item|piece)/i);
    toolArgs.customerId = customerMatch ? customerMatch[1] : '1';
    toolArgs.items = productMatch ? [{
      productId: productMatch[1],
      quantity: quantityMatch ? parseInt(quantityMatch[1]) : 1,
      price: 0
    }] : [];
  } else if (lowerMessage.includes('order')) {
    toolName = 'get_orders';
  } else {
    toolName = 'get_products';
  }

  return { toolName, toolArgs, fields };
}

// HTTP API for Web UI
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`\n🤖 AI Chat Request: "${message}"`);

    // Use AI-powered intent detection
    const { toolName, toolArgs, fields } = await detectIntentWithAI(message);

    console.log(`🎯 Detected Tool: ${toolName}`);
    console.log(`📦 Arguments:`, toolArgs);
    console.log(`📋 Fields:`, fields);

    // Store original arguments for response (before any modifications)
    const originalArgs = JSON.parse(JSON.stringify(toolArgs));

    // Execute the tool using the MCP server's tool handler
    let result;
    let executedQuery = '';
    
    // Build field list for GraphQL query
    const buildFields = (defaultFields, requestedFields) => {
      if (requestedFields.includes('all')) {
        return defaultFields.join('\n              ');
      }
      return requestedFields.filter(f => defaultFields.includes(f)).join('\n              ');
    };
    
    switch (toolName) {
      case 'get_products':
        const productFields = ['id', 'name', 'category', 'price', 'stock', 'sku'];
        const selectedProductFields = buildFields(productFields, fields);
        if (toolArgs.category) {
          executedQuery = `query GetProductsByCategory($category: String!) {
  productsByCategory(category: $category) {
    ${selectedProductFields.replace(/\n\s+/g, '\n    ')}
  }
}`;
          result = await executeGraphQL(executedQuery, { category: toolArgs.category });
        } else {
          executedQuery = `query GetProducts {
  products {
    ${selectedProductFields.replace(/\n\s+/g, '\n    ')}
  }
}`;
          result = await executeGraphQL(executedQuery);
        }
        break;

      case 'search_products':
        const searchProductFields = ['id', 'name', 'category', 'price', 'stock', 'sku'];
        const selectedSearchFields = buildFields(searchProductFields, fields);
        executedQuery = `query SearchProducts($query: String!) {
  searchProducts(query: $query) {
    ${selectedSearchFields.replace(/\n\s+/g, '\n    ')}
  }
}`;
        result = await executeGraphQL(executedQuery, { query: toolArgs.query });
        break;

      case 'get_customers':
        const customerFields = ['id', 'name', 'email', 'tier', 'loyaltyPoints'];
        const selectedCustomerFields = buildFields(customerFields, fields);
        const includeAddress = fields.includes('all') || fields.includes('address');
        if (toolArgs.tier) {
          executedQuery = `query GetCustomersByTier($tier: String!) {
  customersByTier(tier: $tier) {
    ${selectedCustomerFields.replace(/\n\s+/g, '\n    ')}${includeAddress ? `
    address {
      street
      city
      state
      zipCode
      country
    }` : ''}
  }
}`;
          result = await executeGraphQL(executedQuery, { tier: toolArgs.tier });
        } else {
          executedQuery = `query GetCustomers {
  customers {
    ${selectedCustomerFields.replace(/\n\s+/g, '\n    ')}${includeAddress ? `
    address {
      street
      city
      state
      zipCode
      country
    }` : ''}
  }
}`;
          result = await executeGraphQL(executedQuery);
        }
        break;

      case 'get_customer_orders':
        // If customerName is provided, look up the customer first
        if (toolArgs.customerName && !toolArgs.customerId) {
          const lookupQuery = `query SearchCustomer($name: String!) {
  searchCustomers(query: $name) {
    id
    name
  }
}`;
          const lookupResult = await executeGraphQL(lookupQuery, { name: toolArgs.customerName });
          if (lookupResult.success && lookupResult.data.searchCustomers && lookupResult.data.searchCustomers.length > 0) {
            const customer = lookupResult.data.searchCustomers[0];
            toolArgs.customerId = customer.id;
            // Show the complete query flow
            executedQuery = `query GetCustomerOrders($name: String!) {
  # Search for customer by name "${toolArgs.customerName}"
  searchCustomers(query: $name) {
    id
    name
    orders {
      id
      totalAmount
      status
      createdAt
      items {
        productId
        quantity
        price
      }
    }
  }
}`;
          } else {
            result = {
              error: true,
              message: `Customer "${toolArgs.customerName}" not found`
            };
            break;
          }
        } else {
          // Direct ID query
          executedQuery = `query GetCustomerOrders($id: ID!) {
  customer(id: $id) {
    id
    name
    email
    orders {
      id
      totalAmount
      status
      createdAt
      items {
        productId
        quantity
        price
      }
    }
  }
}`;
        }
        
        result = await executeGraphQL(`
          query GetCustomerOrders($id: ID!) {
            customer(id: $id) {
              id
              name
              email
              orders {
                id
                totalAmount
                status
                createdAt
                items {
                  productId
                  quantity
                  price
                }
              }
            }
          }
        `, { id: toolArgs.customerId });
        break;

      case 'get_orders':
        executedQuery = `query GetOrders {
  orders {
    id
    customerId
    totalAmount
    status
    createdAt
    items {
      productId
      quantity
      price
    }
  }
}`;
        result = await executeGraphQL(executedQuery);
        break;

      case 'create_order':
        if (toolArgs.items && toolArgs.items.length > 0) {
          executedQuery = `mutation CreateOrder($customerId: ID!, $items: [OrderItemInput!]!, $status: String) {
  createOrder(customerId: $customerId, items: $items, status: $status) {
    id
    customerId
    totalAmount
    status
    createdAt
  }
}`;
          result = await executeGraphQL(executedQuery, {
            customerId: toolArgs.customerId,
            items: toolArgs.items,
            status: 'PENDING'
          });
        } else {
          result = {
            error: true,
            message: 'Please specify items for the order'
          };
        }
        break;

      default:
        result = {
          error: true,
          message: 'Unknown tool'
        };
    }

    // Format response for the UI
    const response = {
      message,
      intent: toolName,
      arguments: originalArgs,
      query: executedQuery || 'N/A',
      result: result.success ? result.data : null,
      error: result.error ? result.message : null,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Response prepared`);
    res.json(response);

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`\n🌐 HTTP API Server running on http://localhost:${HTTP_PORT}`);
  console.log(`   - POST /api/chat - Process AI chat messages`);
  console.log(`   - GET  /api/health - Health check`);
  console.log('\n✅ Server ready to accept requests!');
  console.log('🔗 Gateway URL:', GATEWAY_URL);
  console.log('\n💡 Available MCP tools:');
  console.log('   - get_products');
  console.log('   - search_products');
  console.log('   - get_customers');
  console.log('   - get_customer_orders');
  console.log('   - get_orders');
  console.log('   - create_order');
  console.log('   - update_order_status\n');
});

// Start the MCP server (only if running in stdio mode for Claude Desktop)
// This is commented out for HTTP-only mode
// Uncomment this if you want to use with Claude Desktop via stdio
/*
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('✅ MCP Server: Connected and ready for stdio communication');
}

main().catch((error) => {
  console.error('❌ MCP Server Error:', error);
  process.exit(1);
});
*/
