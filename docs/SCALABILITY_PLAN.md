# Scalability Plan

> **Implementation status: Planned.** The application currently runs as a single Next.js deployment reading/writing PostgreSQL directly via Prisma. No CDN caching layer, Redis/cache, search cluster, queue-based fanout, worker pool, or read-replica setup exists yet — this document describes target-state scaling, not current infrastructure.

## 1. Scaling Objective
Aggarha should be able to support millions of users without changing its core architecture. The platform must scale horizontally in read-heavy discovery, messaging, and trust computation workloads while preserving a consistent trust model.

## 1.1 Canonical Deployment Targets
- Public web: https://www.aggarha.com
- Public API: https://api.aggarha.com
- Admin console: https://admin.aggarha.com
- Development/staging: https://dev.aggarha.com

## 2. Primary Load Characteristics
- Search and browse are read-heavy.
- Chat is bursty and latency-sensitive.
- Deal confirmation is low-volume but integrity-critical.
- Reputation and trust updates are event-driven and asynchronous.
- Moderation and analytics are batch-heavy and queue-based.

## 3. Scaling Strategy by Layer
### Frontend
- Cache public pages aggressively.
- Optimize media delivery with CDN and responsive images.
- Keep route transitions and interaction feedback lightweight.

### API
- Stateless application servers
- Horizontal autoscaling
- Request rate limiting and circuit breakers
- Read/write separation when necessary

### Database
- Index for the highest-cardinality filters first
- Use read replicas for browse and profile reads
- Partition large ledgers and message tables by time or city if required
- Archive old data with policy-preserving access paths

### Search
- Dedicated search cluster
- Incremental indexing from domain events
- Query caches for popular cities, categories, and trust combinations

### Chat
- Realtime transport with backpressure controls
- Message fanout through queues
- Presence and unread counts derived asynchronously when possible

### Trust and XP
- Asynchronous recalculation jobs
- Replayable event ledgers
- Snapshot storage for fast reads

## 4. Performance Controls
- CDN for media and static assets
- Redis or equivalent for hot caches and rate limits
- Queue-based notifications
- Prefetch and pagination for large lists
- Lazy hydration or partial rendering on heavy views if needed later

## 5. Growth Phases
### Phase 1
Launch in one city with 1 to 2 categories.

### Phase 2
Expand to adjacent categories and more neighborhoods.

### Phase 3
Scale into events and pro equipment verticals.

### Phase 4
Introduce personalized ranking, advanced recommendations, and multi-city rollout.

## 6. Operational Scaling
- Separate trust-sensitive jobs from non-critical jobs.
- Build monitoring around confirmation latency, message backlog, search latency, and moderation SLA.
- Use automated degradation when non-critical systems are under pressure.

## 7. Cross-References
- System topology: [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
- Search: [SEARCH_ARCHITECTURE.md](SEARCH_ARCHITECTURE.md)
- Security: [SECURITY_ARCHITECTURE.md](SECURITY_ARCHITECTURE.md)
- Roadmap: [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md)
