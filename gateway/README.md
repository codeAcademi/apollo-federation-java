# Apollo Gateway

Apollo Federation Gateway that composes multiple GraphQL subgraphs into a unified API.

## Overview

This gateway uses Apollo Federation to combine three Spring Boot microservices:
- **Products Service** (port 8081)
- **Orders Service** (port 8082)
- **Customers Service** (port 8083)

## Installation

```bash
npm install
```

## Running

```bash
npm start
```

The gateway will be available at: http://localhost:4000

## Development Mode

```bash
npm run dev
```

## Example Queries

### Get all products
```graphql
query {
  products {
    id
    name
    price
    stock
  }
}
```

### Get customer with their orders
```graphql
query {
  customer(id: "1") {
    name
    email
    orders {
      id
      totalAmount
      status
      items {
        product {
          name
          price
        }
        quantity
      }
    }
  }
}
```

### Cross-service query
```graphql
query {
  orders {
    id
    customer {
      name
      email
    }
    items {
      product {
        name
        category
      }
      quantity
      price
    }
    totalAmount
    status
  }
}
```

## Configuration

Subgraph URLs are configured in `index.js`. Update these if your services run on different ports.
