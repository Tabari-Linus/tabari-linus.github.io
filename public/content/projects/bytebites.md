---
title: "ByteBites"
slug: "bytebites"
date: "2025-11-01T00:00:00Z"
summary: "Event-driven food delivery platform where Kafka orchestrates the order lifecycle from placement to doorstep."
stack: ["Spring Boot", "Apache Kafka", "PostgreSQL", "Docker"]
repo: "Tabari-Linus/bytebites"
featured: true
order: 2
---

## Overview

ByteBites is a food delivery platform that spans the full order lifecycle — customer places an order, restaurant accepts and prepares it, the delivery is dispatched and tracked to the customer's door. Order state and delivery updates flow between services over Kafka, giving each part of the system a durable event log to react to.

## Architecture

```
 Customer ─► Order Svc ─►[order.placed]─►┬─► Restaurant Svc
                                         │
                                         └─► Delivery Svc ─►[delivery.updated]─► Notification Svc
```

Each service owns its own PostgreSQL database.

## Design decisions and trade-offs

**Kafka over synchronous HTTP.** Order state changes fan out to three consumers. Synchronous calls would have coupled the order service to every downstream — a slow notification service would slow order placement. With Kafka, order acceptance is a single DB write plus an event; downstream services consume at their own pace.

**Database-per-service.** Each service owns its data and communicates only via events. Prevents the "distributed monolith" trap.

**`AFTER_COMMIT` for event publishing.** The most important lesson from this project. Publishing events inline with the transaction created orphan entries — sometimes the DB write succeeded and the Kafka publish failed. Moving to Spring's `@TransactionalEventListener(phase = AFTER_COMMIT)` guarantees events publish only after the DB transaction commits, so we never announce an order that doesn't exist.

## What I'd do differently

Adopt the **transactional outbox pattern** — write events into an `outbox` table inside the same DB transaction as the domain change, then have a separate relay publish them to Kafka. This closes the gap `AFTER_COMMIT` leaves open (crash between commit and publish).
