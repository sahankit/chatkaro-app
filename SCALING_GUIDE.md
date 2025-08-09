# Chat Server Scaling Guide - 1 Million Concurrent Users

This guide explains how to scale the chat server to handle 1 million concurrent users.

## Architecture Overview

The server has been redesigned with the following components:

### 1. **Clustering & Load Distribution**
- **Multi-process clustering**: Uses Node.js cluster module to spawn multiple worker processes
- **Redis adapter**: Enables horizontal scaling across multiple server instances
- **Load balancer**: Nginx configuration for distributing connections

### 2. **Data Storage**
- **Redis**: Session management, user state, real-time data caching
- **MongoDB**: Persistent storage for messages, rooms, and user data
- **Memory optimization**: Efficient data structures and cleanup routines

### 3. **Performance Optimizations**
- **Connection pooling**: Optimized database and Redis connections
- **Rate limiting**: Prevents abuse and ensures fair resource usage
- **Message caching**: Redis caching for frequently accessed data
- **Compression**: Gzip compression for all HTTP responses

## Deployment Options

### Option 1: Single Server with Clustering (Up to 100K users)

```bash
# Install dependencies
npm install

# Start with clustering (recommended)
npm start

# Or start single process for development
npm run dev
```

### Option 2: Multi-Server with Docker (Up to 1M users)

```bash
# Build and start all services
docker-compose up -d

# Scale server instances
docker-compose up -d --scale chat-server-1=2 --scale chat-server-2=2
```

### Option 3: Kubernetes Deployment (Production Scale)

```yaml
# See k8s-deployment.yaml for full Kubernetes configuration
```

## Infrastructure Requirements

### For 1 Million Concurrent Users:

#### **Server Specifications (per instance)**
- **CPU**: 8-16 cores (3.0+ GHz)
- **RAM**: 16-32 GB
- **Network**: 10 Gbps
- **Storage**: SSD with high IOPS

#### **Redis Cluster**
- **Memory**: 64-128 GB total
- **Instances**: 6-12 nodes (3 masters, 3+ replicas)
- **Network**: Low latency connection to app servers

#### **MongoDB Cluster**
- **Storage**: 1-5 TB SSD
- **Instances**: 3-9 nodes (replica set + sharding)
- **RAM**: 32-64 GB per node

#### **Load Balancer**
- **Nginx**: Multiple instances with failover
- **Connection capacity**: 50K+ concurrent connections per instance

## Scaling Configuration

### Environment Variables (.env)

```bash
# Production settings
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Redis cluster endpoints
REDIS_HOST=redis-cluster-endpoint
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-password

# MongoDB cluster
MONGODB_URI=mongodb://user:pass@mongo-cluster/chat_app?replicaSet=rs0

# Performance tuning
MAX_WORKERS=8
REDIS_POOL_SIZE=100
MONGODB_POOL_SIZE=50

# Rate limiting
MAX_CONNECTIONS_PER_IP=50
MESSAGE_RATE_LIMIT=30
TYPING_RATE_LIMIT=10
```

### System Optimizations

#### **Linux Kernel Tuning**
```bash
# Increase file descriptor limits
echo "* soft nofile 1000000" >> /etc/security/limits.conf
echo "* hard nofile 1000000" >> /etc/security/limits.conf

# TCP optimizations
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65535" >> /etc/sysctl.conf
echo "net.core.netdev_max_backlog = 5000" >> /etc/sysctl.conf
```

#### **Node.js Optimizations**
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Enable clustering
export UV_THREADPOOL_SIZE=128
```

## Monitoring & Metrics

### Health Endpoints
- `GET /health` - Basic health check
- `GET /metrics` - Detailed performance metrics
- `GET /alerts` - System alerts and warnings

### Key Metrics to Monitor
- **Connection count**: Total active WebSocket connections
- **Memory usage**: Heap usage per process
- **Message throughput**: Messages per second
- **Response times**: Database and Redis latency
- **Error rates**: Connection failures and timeouts

### Alerting Thresholds
- Memory usage > 80%
- Connection count > 800K
- Message queue depth > 1000
- Database response time > 100ms

## Capacity Planning

### Connection Distribution
- **Per process**: ~25,000 connections (with 16GB RAM)
- **Per server**: ~200,000 connections (8 processes)
- **Total capacity**: 1M+ users (5+ servers)

### Resource Scaling
```
Users     | Servers | Redis Nodes | MongoDB Nodes
----------|---------|-------------|---------------
100K      | 1       | 1           | 1
250K      | 2       | 3           | 3
500K      | 3       | 6           | 6
1M        | 5+      | 9+          | 9+
```

## Performance Testing

### Load Testing Commands
```bash
# Install artillery for load testing
npm install -g artillery

# Test WebSocket connections
artillery run load-test.yml

# Monitor during testing
watch -n 1 'curl -s localhost:5000/metrics | jq .'
```

### Expected Performance
- **Latency**: <50ms for message delivery
- **Throughput**: 10,000+ messages/second
- **Memory**: ~150MB per 10K connections
- **CPU**: ~20% per core at 25K connections

## Troubleshooting

### Common Issues
1. **Memory leaks**: Monitor heap usage, implement cleanup routines
2. **Connection drops**: Check network stability and timeout settings
3. **Database bottlenecks**: Add read replicas, optimize queries
4. **Redis performance**: Use clustering, monitor memory usage

### Debug Commands
```bash
# Check process status
pm2 status

# Monitor Redis
redis-cli info memory

# MongoDB performance
mongotop --host mongodb-host

# System resources
htop
iotop
```

## Security Considerations

### Rate Limiting
- Connection limits per IP
- Message rate limiting per user
- Typing indicator throttling

### Input Validation
- Message content sanitization
- Username validation and filtering
- Room access control

### Network Security
- CORS configuration
- Helmet.js security headers
- SSL/TLS termination at load balancer

## Maintenance

### Regular Tasks
- **Daily**: Monitor metrics and alerts
- **Weekly**: Clean up old messages and inactive users
- **Monthly**: Database maintenance and optimization
- **Quarterly**: Security updates and dependency upgrades

### Backup Strategy
- **MongoDB**: Daily incremental, weekly full backups
- **Redis**: Snapshot backups for session recovery
- **Application**: Git-based deployments with rollback capability

## Getting Started

1. **Development**: `npm run dev`
2. **Production**: `npm run production`
3. **Docker**: `docker-compose up -d`
4. **Monitoring**: Access metrics at `http://localhost:5000/metrics`

For questions or issues, refer to the troubleshooting section or check the application logs.
