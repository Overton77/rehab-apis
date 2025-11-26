# The Rehab App (Archived)

> **Status:** 💤 Archived / On Hold  
> A Nest.js monorepo that powers a rehab discovery and insurance-orchestration backend using GraphQL, Fastify, and AI.

---

## Overview

The Rehab App is an experimental backend platform designed to help patients and their loved ones:

- Find rehab organizations, programs, and campuses that closely match their clinical and personal needs.
- Trigger and track insurance approval workflows.
- Use AI to enrich rehab data and guide users toward appropriate treatment options.

This repository contains the backend services only. The project is currently **archived** because it requires real insurance approval APIs and significant AI ingestion cost to operate at scale.

---

## Goals & Use Cases

- 🧭 **Rehab matching engine**  
  Model rehab organizations, programs, and campuses with enough structure and metadata to support precise matching.

- 🧾 **Insurance pre-check & approval orchestration**  
  Provide endpoints to initiate insurance verification / approval flows (payers, benefits, coverage checks, etc. – currently stubbed).

- 🤝 **Support for patients & loved ones**  
  Allow both patients and family members to submit information, explore options, and get nudged toward next steps.

- 🧠 **AI-assisted enrichment**  
  Use LLMs to:
  - Ingest and normalize rehab information from external sources.
  - Enrich data with tags, categories, and specialized attributes.
  - Potentially guide users via conversational flows.

---

## Tech Stack

- **Runtime & Language**
  - Node.js
  - TypeScript

- **Framework**
  - [Nest.js](https://nestjs.com/) monorepo (`apps/` + `libs/` style structure)

- **APIs**
  - **GraphQL API**
    - For frontend / client consumption
    - Exposes entities like `RehabOrganization`, `RehabProgram`, `RehabCampus`, and related queries/mutations.
  - **Fastify REST API**
    - For ingestion, internal tooling, and potentially webhooks
    - Built on Nest’s Fastify adapter

- **Data Layer**
  - [Prisma ORM](https://www.prisma.io/) (schema-driven data modeling)
  - Relational database (intended for PostgreSQL)

- **AI / LLMs**
  - External AI provider(s) (e.g. OpenAI or compatible API)  
    Used for enrichment and potentially for patient-facing guidance flows.

---

## High-Level Architecture

- **Nest.js monorepo**
  - Shared domain models and utilities live in `libs/`
  - Separate apps for:
    - `graphql-api` – main GraphQL server
    - `rest-api` (Fastify) – ingestion / admin / internal APIs

- **Core domain**
  - `RehabOrganization`
  - `RehabProgram`
  - `RehabCampus`
  - User & profile-related entities (patients, loved ones, etc.)
  - Insurance-related entities (payers, policies, eligibility checks – **PVerify API will be used. Current not wired in.**)

- **AI ingestion pipeline (conceptual)**
  - Fetch or receive raw rehab data
  - Use AI to normalize and enrich fields (specialties, levels of care, populations served, etc.)
  - Store structured results to support later search & matching

---

## Project Status

This project is **not production-ready** and is currently **archived** for the following reasons:

- No real insurance approval API is currently integrated.
- The AI-based ingestion pipeline is expensive to run at scale.
- The scope grew larger than planned; this codebase is preserved as a foundation for future iterations.
