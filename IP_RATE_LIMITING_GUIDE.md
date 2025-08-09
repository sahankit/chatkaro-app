# IP Rate Limiting & Abuse Prevention Guide

This document explains the comprehensive IP-based rate limiting and abuse prevention system implemented in the chat server.

## 🛡️ Features

### 1. **IP-Based Rate Limiting**
- **Connection Limits**: Maximum connections per IP per hour
- **Message Limits**: Maximum messages per IP per minute  
- **Room Join Limits**: Maximum room joins per IP per minute
- **User Creation Limits**: Maximum user accounts per IP per hour

### 2. **Automatic Blacklisting**
- **Abuse Detection**: Automatically blacklists IPs that severely exceed limits
- **Suspicious Activity Tracking**: Scores and tracks suspicious behavior
- **Temporary Bans**: Configurable ban durations (1 hour to permanent)

### 3. **Content Filtering**
- **Spam Detection**: Detects repeated characters and spam patterns
- **URL Filtering**: Limits multiple links in messages
- **Profanity Filter**: Basic inappropriate content detection
- **Caps Lock Detection**: Prevents excessive use of capital letters

### 4. **Admin Management**
- **Web Dashboard**: Easy-to-use admin interface at `/admin`
- **IP Statistics**: Detailed usage stats for any IP address
- **Manual Controls**: Blacklist/unblacklist IPs manually
- **Real-time Monitoring**: Live server metrics and alerts

## 📊 Default Rate Limits

| Limit Type | Default Value | Time Window |
|------------|---------------|-------------|
| Connections per IP | 20 | 1 hour |
| Messages per IP | 100 | 1 minute |
| Room joins per IP | 10 | 1 minute |
| User creations per IP | 5 | 1 hour |

## 🚀 Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# IP-based Rate Limiting
MAX_CONNECTIONS_PER_IP=20
MESSAGE_RATE_LIMIT_PER_IP=100
JOIN_RATE_LIMIT_PER_IP=10
USER_CREATION_LIMIT_PER_IP=5
```

### Whitelist/Blacklist Management

**Whitelisted IPs** (automatically allowed):
- `127.0.0.1` (localhost)
- `::1` (IPv6 localhost)

**Blacklisted IPs** are stored in Redis and can be managed via:
- Admin dashboard at `/admin`
- API endpoints (see below)

## 🔌 API Endpoints

### Admin Endpoints

**Get IP Statistics**
```http
GET /admin/ip-stats/:ip
```

**Blacklist IP**
```http
POST /admin/blacklist-ip
Content-Type: application/json

{
  "ip": "192.168.1.100",
  "reason": "Spam detected",
  "duration": 3600
}
```

**Remove from Blacklist**
```http
POST /admin/unblacklist-ip
Content-Type: application/json

{
  "ip": "192.168.1.100"
}
```

### Monitoring Endpoints

**Server Metrics**
```http
GET /metrics
```

**System Alerts**
```http
GET /alerts
```

## 🎯 Abuse Detection

### Automatic Blacklisting Triggers

An IP is automatically blacklisted when:

1. **Excessive Connections**: > 3x connection limit
2. **Message Spam**: > 2x message limit  
3. **Suspicious Score**: Reaches 50 points

### Suspicious Activity Scoring

| Activity | Points |
|----------|---------|
| Excessive connections | 5 |
| Message spam | 3 |
| Excessive room joins | 2 |
| Inappropriate content | 2 |
| Suspicious username patterns | 2 |
| Long message attempts | 1 |
| Excessive caps | 1 |

## 🖥️ Admin Dashboard

Access the admin dashboard at: `http://your-server:5000/admin`

### Features:
- **Real-time Stats**: Active users, connections, memory usage
- **IP Lookup**: Check statistics for any IP address
- **Blacklist Management**: Add/remove IPs from blacklist
- **System Alerts**: View current system warnings
- **Activity Logs**: Monitor recent server activity

### Dashboard Screenshots:

The dashboard provides:
- Server performance metrics
- IP management tools
- Real-time activity monitoring
- Rate limit configuration display

## 🔧 Advanced Configuration

### Custom Rate Limits

To modify rate limits, update the environment variables and restart:

```bash
# More restrictive limits
MAX_CONNECTIONS_PER_IP=10
MESSAGE_RATE_LIMIT_PER_IP=50
JOIN_RATE_LIMIT_PER_IP=5
USER_CREATION_LIMIT_PER_IP=2

# More permissive limits  
MAX_CONNECTIONS_PER_IP=50
MESSAGE_RATE_LIMIT_PER_IP=200
JOIN_RATE_LIMIT_PER_IP=20
USER_CREATION_LIMIT_PER_IP=10
```

### Nginx Integration

For production deployments with Nginx, ensure proper IP forwarding:

```nginx
location /socket.io/ {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    # ... other proxy settings
}
```

### Redis Configuration

The system uses Redis keys with these prefixes:
- `rate_limit:connection:*` - Connection counts
- `rate_limit:message_ip:*` - Message counts  
- `rate_limit:join_ip:*` - Room join counts
- `rate_limit:user_creation:*` - User creation counts
- `ip_blacklist` - Blacklisted IP set
- `suspicious_activity:*` - Suspicious activity scores

## 📈 Monitoring & Alerts

### Key Metrics to Watch

1. **Blacklisted IPs**: Growing blacklist may indicate attacks
2. **Suspicious Activity**: High scores suggest coordinated abuse
3. **Rate Limit Hits**: Frequent limits may need adjustment
4. **Memory Usage**: Ensure Redis has sufficient memory

### Alert Conditions

The system automatically alerts when:
- Memory usage > 80%
- Active users > 800K
- High rate of blacklisting events
- Redis connection issues

## 🛠️ Troubleshooting

### Common Issues

**1. Legitimate users getting blocked**
- Check if rate limits are too restrictive
- Verify IP detection is working correctly
- Consider whitelisting known good IPs

**2. High memory usage in Redis**
- Monitor Redis memory with `redis-cli info memory`
- Adjust TTL values for rate limit keys
- Consider Redis memory optimization

**3. False positive spam detection**
- Review and adjust spam detection patterns
- Monitor suspicious activity scores
- Fine-tune content filtering rules

### Debug Commands

```bash
# Check Redis rate limit keys
redis-cli keys "rate_limit:*"

# View blacklisted IPs
redis-cli smembers ip_blacklist

# Monitor suspicious activity
redis-cli keys "suspicious_activity:*"

# Check server metrics
curl http://localhost:5000/metrics | jq

# View IP statistics
curl http://localhost:5000/admin/ip-stats/192.168.1.1
```

## 🔐 Security Best Practices

1. **Secure Admin Endpoints**: Implement authentication for admin routes
2. **Monitor Logs**: Regularly review rate limiting and blacklist logs
3. **Update Filters**: Keep content filters updated with new abuse patterns
4. **Backup Blacklists**: Backup Redis data including blacklist information
5. **Rate Limit Tuning**: Adjust limits based on legitimate usage patterns

## 📚 Integration Examples

### Programmatic IP Management

```javascript
const axios = require('axios');

// Blacklist an IP
async function blacklistIP(ip, reason) {
  try {
    const response = await axios.post('http://localhost:5000/admin/blacklist-ip', {
      ip: ip,
      reason: reason,
      duration: 3600 // 1 hour
    });
    console.log('IP blacklisted:', response.data.message);
  } catch (error) {
    console.error('Error:', error.response.data.error);
  }
}

// Check IP stats
async function checkIP(ip) {
  try {
    const response = await axios.get(`http://localhost:5000/admin/ip-stats/${ip}`);
    console.log('IP Stats:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data.error);
  }
}
```

### Webhook Integration

Set up webhooks to notify external systems of blacklisting events:

```javascript
// In your blacklisting function
await axios.post('https://your-webhook-url.com/ip-blacklisted', {
  ip: ip,
  reason: reason,
  timestamp: new Date().toISOString()
});
```

## 📞 Support

For issues or questions about the IP rate limiting system:

1. Check the server logs for detailed error messages
2. Use the admin dashboard for real-time monitoring
3. Review the Redis keys for rate limiting data
4. Monitor system metrics for performance issues

The system is designed to be robust and self-healing, with automatic cleanup and recovery mechanisms built-in.
