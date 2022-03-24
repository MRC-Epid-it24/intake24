# Queue

Path: `apps/api/src/config/queue.ts`

Queueing system is handled by [Redis](https://redis.io) & [bullmq](https://github.com/taskforcesh/bullmq)

## Redis instance

### Host

- object-path: `redis.host`
- dotenv var: `QUEUE_REDIS_HOST`
- type: `string`
- default: `'localhost'`

### Port

- object-path: `redis.port`
- dotenv var: `QUEUE_REDIS_PORT`
- type: `number`
- default: `6379`

### Workers

Number of workers to spawn for job queue

- object-path: `workers`
- dotenv var: `QUEUE_WORKERS`
- type: `number`
- default: `3`
