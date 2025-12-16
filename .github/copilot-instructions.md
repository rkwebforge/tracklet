# Mini Jira - Project Context

## Project Overview
Production-ready monolithic Mini Jira application for team project management.

## Tech Stack
- **Backend**: Laravel (latest), MySQL, Laravel Fortify
- **Frontend**: React with Vite, Tailwind CSS
- **Bridge**: Inertia.js (React adapter)
- **Authentication**: Laravel Fortify configured for Inertia + React

## Architecture Principles
- Clean Architecture & Domain-Driven Design
- No REST/GraphQL APIs - Inertia.js only
- Strong separation of concerns
- Feature-based frontend structure
- Domain-driven backend structure

## Core Features
- Organizations / Teams management
- Projects management
- Kanban Boards
- Tasks / Issues tracking
- Role-based access control (Admin, Manager, Member)

## Development Guidelines
- Follow Clean Architecture boundaries
- Use Policies and Gates for authorization
- Keep domain logic separate from infrastructure
- Frontend and backend teams work independently
- Maintain production-ready code quality
