# Distributed Order Aggregator System

## 📦 Overview

This system simulates a backend platform that:
- Aggregates stock from multiple vendor APIs
- Accepts and processes customer orders atomically
- Uses RabbitMQ to manage high-concurrency order processing safely

---

## 🚀 Tech Stack
- Node.js
- PostgreSQL
- RabbitMQ (via `amqplib`)
- Sequelize ORM
- Express.js

---

## 📂 Folder Structure

distributed-order-aggregator/
│
├── src/
│   ├── api/                   # Express API routes
│   ├── db/                    # DB connection + schema setup
│   ├── services/
│   │   ├── stockSync.js       # Pull vendor stock, update local
│   │   ├── orderService.js    # Atomic order processing logic
│   │   └── vendorClient.js    # Mock vendor API client
│   ├── workers/
│   │   └── orderWorker.js     # RabbitMQ worker
│   └── queue/
│       └── rabbitmq.js        # Setup + publish to queue
│
├── scripts/
│   └── syncStock.js           # CLI to run stock sync
│
├── design.md                  # System design doc (1-page)
├── README.md
└── package.json

# ENV File

PORT=3000

# PostgreSQL
DB_NAME=order_aggregator
DB_USER=postgres
DB_PASS=*******
DB_HOST=localhost
DB_PORT=5432

# RabbitMQ
RABBITMQ_URL=amqp://localhost


# ---------------------System Design – Distributed Order Aggregator----------------------------

## 🛠 Architecture

- Modular monolith using Node.js
- Vendor mock APIs exposed via Express
- PostgreSQL holds local product + order state
- RabbitMQ manages order queues and retries

---

## 🔄 Stock Sync Flow

1. A script (`syncStock.js`) pulls stock from `/vendor/:vendorId/stock`
2. Updates local `products` table
3. Retries up to 3 times on vendor failure

---

## 🛒 Order Placement Architecture

- API `/order` receives product ID and quantity
- Starts a Sequelize transaction:
  - Validates and locks product row
  - Decrements stock
  - Creates `pending` order
  - Enqueues message to RabbitMQ

---

## ⚙️ Queue-based Worker Model

- Worker listens to `orderQueue`
- Picks up one message per order
- Simulates vendor fulfillment
- Updates order status to `success` or `failed`
- Retries failed orders after 3 seconds

---

## ✅ Consistency Guarantees

- **Strong consistency** via DB transaction locking (SELECT ... FOR UPDATE)
- **Message durability** in RabbitMQ
- **At-least-once delivery** ensured by queue with ack/nack
- **Retries** built into both sync + order processing
