const GATEWAY_URL = 'http://localhost:4000/graphql';
const MCP_API_URL = 'http://localhost:5000/api/chat';

// Query examples
const examples = {
    products: `query {
  products {
    id
    name
    category
    price
    stock
    sku
  }
}`,
    customers: `query {
  customers {
    id
    name
    email
    tier
    loyaltyPoints
    address {
      city
      state
    }
  }
}`,
    orders: `query {
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
}`,
    customerOrders: `query {
  customer(id: "1") {
    name
    email
    tier
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
}`,
    crossService: `query {
  orders {
    id
    customer {
      name
      email
      tier
    }
    items {
      product {
        name
        category
        price
      }
      quantity
    }
    totalAmount
    status
  }
}`
};

// Load example query
function loadExample(type) {
    const query = examples[type];
    if (query) {
        document.getElementById('graphql-query').value = query;
    }
}

// Execute GraphQL query
async function executeQuery() {
    const query = document.getElementById('graphql-query').value.trim();
    const resultsEl = document.getElementById('query-results');
    
    if (!query) {
        resultsEl.textContent = 'Please enter a query';
        return;
    }
    
    resultsEl.textContent = 'Executing query...';
    
    try {
        const response = await fetch(GATEWAY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });
        
        const result = await response.json();
        resultsEl.textContent = JSON.stringify(result, null, 2);
        
        if (result.errors) {
            resultsEl.style.color = '#f44336';
        } else {
            resultsEl.style.color = '#4caf50';
        }
    } catch (error) {
        resultsEl.textContent = `Error: ${error.message}\n\nMake sure the gateway is running at ${GATEWAY_URL}`;
        resultsEl.style.color = '#f44336';
    }
}

// Check service status
async function checkServiceStatus(url, elementId, isGraphQL = true) {
    const statusEl = document.getElementById(elementId);
    
    try {
        let response;
        if (isGraphQL) {
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: '{ __typename }' }),
            });
        } else {
            // For non-GraphQL services, just do a GET request
            response = await fetch(url, {
                method: 'GET',
            });
        }
        
        if (response.ok) {
            statusEl.textContent = '✓ Online';
            statusEl.className = 'status online';
        } else {
            statusEl.textContent = '✗ Offline';
            statusEl.className = 'status offline';
        }
    } catch (error) {
        statusEl.textContent = '✗ Offline';
        statusEl.className = 'status offline';
    }
}

// Check all services on load
document.addEventListener('DOMContentLoaded', () => {
    // Check gateway
    checkServiceStatus('http://localhost:4000/graphql', 'gateway-status', true);
    
    // Check individual services
    checkServiceStatus('http://localhost:8081/graphql', 'products-status', true);
    checkServiceStatus('http://localhost:8082/graphql', 'orders-status', true);
    checkServiceStatus('http://localhost:8083/graphql', 'customers-status', true);
    
    // Check MCP Server (REST API)
    checkServiceStatus('http://localhost:5001/api/health', 'mcp-status', false);
    
    // Check Web UI (self - just check if page loads)
    checkServiceStatus('http://localhost:3000', 'webui-status', false);
    
    // Load products example by default
    loadExample('products');
    
    // Recheck status every 30 seconds
    setInterval(() => {
        checkServiceStatus('http://localhost:4000/graphql', 'gateway-status', true);
        checkServiceStatus('http://localhost:8081/graphql', 'products-status', true);
        checkServiceStatus('http://localhost:8082/graphql', 'orders-status', true);
        checkServiceStatus('http://localhost:8083/graphql', 'customers-status', true);
        checkServiceStatus('http://localhost:5001/api/health', 'mcp-status', false);
        checkServiceStatus('http://localhost:3000', 'webui-status', false);
    }, 30000);
});

// Allow Enter key to execute in textarea (Ctrl+Enter)
document.getElementById('graphql-query').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        executeQuery();
    }
});

// AI Chat Functions
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    const typingId = addChatMessage('bot', 'Thinking...', true);
    
    try {
        const response = await fetch(MCP_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        document.getElementById(typingId)?.remove();
        
        if (data.error) {
            addChatMessage('bot', `❌ Error: ${data.error}`);
        } else {
            // Format the response
            let responseText = `🎯 <strong>Intent:</strong> ${data.intent}\n\n`;
            
            // Show the actual GraphQL query executed
            if (data.query && data.query !== 'N/A') {
                responseText += `📝 <strong>Query Executed:</strong>\n<pre class="graphql-query-preview">${escapeHtml(data.query)}</pre>\n\n`;
            }
            
            if (data.result) {
                const resultKey = Object.keys(data.result)[0];
                const resultData = data.result[resultKey];
                
                if (Array.isArray(resultData)) {
                    responseText += `📊 <strong>Found ${resultData.length} result(s):</strong>\n\n`;
                    responseText += `<div class="chat-result-json">${syntaxHighlightJSON(resultData)}</div>`;
                } else if (resultData) {
                    responseText += `📊 <strong>Result:</strong>\n\n`;
                    responseText += `<div class="chat-result-json">${syntaxHighlightJSON(resultData)}</div>`;
                } else {
                    responseText += '✅ Query executed successfully!';
                }
            }
            
            addChatMessage('bot', responseText);
        }
        
    } catch (error) {
        // Remove typing indicator
        document.getElementById(typingId)?.remove();
        addChatMessage('bot', `❌ Error: ${error.message}\n\nMake sure the MCP server is running on port 5001.`);
    }
}

function addChatMessage(sender, text, isTyping = false) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const messageId = `msg-${Date.now()}`;
    messageDiv.id = messageId;
    messageDiv.className = `chat-message ${sender}`;
    
    if (isTyping) {
        messageDiv.classList.add('typing');
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (sender === 'bot') {
        contentDiv.innerHTML = `<strong>🤖 AI Assistant:</strong><br>${text}`;
    } else {
        contentDiv.innerHTML = `<strong>You:</strong><br>${text}`;
    }
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageId;
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function syntaxHighlightJSON(obj) {
    const json = JSON.stringify(obj, null, 2);
    return json
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return `<span class="${cls}">${match}</span>`;
        });
}
