---
title: "Recruitment Platform"
slug: "recruitment-platform"
date: "2025-08-01T00:00:00Z"
summary: "Full-stack hiring workflow with four roles, interview scheduling, and project submissions — my role: backend."
stack: ["Spring Boot", "AngularJS", "PostgreSQL", "Spring Security", "JWT"]
repo: "Tabari-Linus/recruitment-platform"
featured: true
order: 3
---

## Overview

A full recruitment workflow platform built collaboratively with frontend trainees during the AmaliTech program. Recruiters post job listings and shortlist candidates; applicants apply, submit project work for review, and book interview slots; interviewers run scheduled interviews; admins oversee the whole system. My focus was the backend — REST APIs, data model, and role-based access control.

## Architecture

```
  AngularJS SPA ──JWT──► Spring Boot API ──► PostgreSQL
                          · Spring Security
                          · Endpoint role checks
                          · Row-level ownership
```

## Design decisions and trade-offs

**Four roles, one authorization model.** Admin, recruiter, applicant, and interviewer each see a very different slice of the platform. Roles were enforced declaratively on endpoints (Spring Security's `@PreAuthorize`) plus row-level checks for ownership. Trade-off: two layers of authorization to keep in sync — but neither is sufficient alone.

**Interview scheduling as a first-class resource.** Interview slots are their own domain object with availability, bookings, and links out to the meeting itself, rather than being a field on the application. This made it possible to model rescheduling and multi-round interviews without contorting the application entity.

**Project submissions handled separately from applications.** Candidates submit project work for review as a distinct step in the pipeline, so reviewer feedback and revision history live on the submission, not the application.

**REST + JWT over sessions.** Stateless JWT authentication so the API could scale horizontally without shared session storage.
