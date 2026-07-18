---
title: "Snap Service"
slug: "snap-service"
date: "2026-01-15T00:00:00Z"
summary: "Proximity-based service marketplace connecting seekers with local providers — 10K+ users on AWS with blue-green deployments."
stack: ["Spring Boot", "Spring Cloud Gateway", "PostgreSQL", "PostGIS", "WebSocket", "AWS ECS", "Docker"]
repo: "Tabari-Linus/snap-service"
featured: true
order: 1
---

## Overview

Snap Service is a proximity-based marketplace connecting service seekers with independent providers — carpenters, dressmakers, shoemakers, IT technicians, electricians, teachers, and more. Users discover nearby providers, book ahead, and chat directly to confirm availability before committing. The platform scaled past 10,000 users on AWS with blue-green deployments driving zero-downtime releases.

## Architecture

```
                   ┌──────────────┐
   Web / Mobile ──►│  API Gateway │  auth · authz · rate-limit
                   └──────┬───────┘
                          │
      ┌───────────┬───────┼───────┬───────────┬──────────┐
      ▼           ▼       ▼       ▼           ▼          ▼
   ┌──────┐  ┌────────┐ ┌────┐ ┌───────┐ ┌────────┐ ┌────────┐
   │ User │  │Provider│ │Chat│ │ Order │ │Payment │ │Discovery│
   │ Svc  │  │  Svc   │ │Svc │ │  Svc  │ │  Svc   │ │ (Geo)   │
   └──────┘  └────────┘ └────┘ └───────┘ └────────┘ └────────┘
```

Deployed to AWS ECS with blue-green cutover per service.

## Design decisions and trade-offs

**Microservice split for fault isolation.** The driving concern wasn't scale — it was making sure that a payment outage couldn't stop a seeker from chatting with a provider to confirm availability. Discovery, chat, and browsing had to keep working while write-path services (orders, payments) recovered independently. Cost: operational complexity, per-service databases, coordination overhead at the gateway.

**Gateway as the single auth/authz choke point.** Rather than distributing authentication logic across every service, the gateway validates tokens and enforces role checks before requests reach downstream services. Kept individual services simpler but made the gateway a critical path — any misconfiguration blocked everything.

**Blue-green deploys per service.** Each service ships independently with a blue-green cutover on ECS, so releases don't require a full-platform maintenance window. Trade-off: doubled infrastructure cost during the cutover window.

## The hard part

The strict gateway restrictions were the correct security posture, but coordinating them with the DevOps team's ECS deployment turned into a multi-week debug. Services couldn't communicate across the cluster because ECS security groups and port mappings weren't aligned with what the gateway expected. The lesson: infra-level networking and application-level auth need to be treated as one system, not two.
