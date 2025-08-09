# Admin Authentication & Security Guide

This guide explains the comprehensive admin authentication system implemented to protect administrative functions of the chat server.

## 🔐 **Security Features**

### **1. Session-Based Authentication**
- **JWT-like tokens** stored in Redis with expiration
- **Session validation** on every admin request
- **Automatic logout** on session expiry
- **IP tracking** for additional security

### **2. Brute Force Protection**
- **Login attempt limiting**: Maximum 5 attempts per IP
- **Account lockout**: 15-minute lockout after failed attempts
- **Progressive penalties** for repeated violations
- **IP-based tracking** prevents distributed attacks

### **3. Secure Session Management**
- **1-hour session timeout** (configurable)
- **Activity-based renewal** extends sessions on use
- **Secure token generation** using crypto.randomBytes
- **Session invalidation** on logout or security events

## 🚀 **Getting Started**

### **Default Credentials**
```
Username: ankit
Password: ankit
```

⚠️ **IMPORTANT**: Change these defaults immediately in production!

### **Environment Configuration**

Add these variables to your `.env` file:

```bash
# Admin Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
ADMIN_SESSION_DURATION=3600  # 1 hour in seconds

# Security Settings
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900  # 15 minutes in seconds
```

## 🌐 **Access Points**

### **Admin Login**
- **URL**: `http://localhost:5000/admin/login`
- **Method**: GET (serves login page)
- **Public access**: No authentication required

### **Admin Dashboard**
- **URL**: `http://localhost:5000/admin`
- **Method**: GET (serves dashboard)
- **Authentication**: Required (redirects to login if not authenticated)

### **API Endpoints**

#### **Authentication Endpoints**

**Login**
```http
POST /admin/login
Content-Type: application/json

{
  "username": "ankit",
  "password": "ankit"
}
```

**Response (Success)**
```json
{
  "success": true,
  "sessionToken": "a1b2c3d4e5f6...",
  "expiresIn": 3600
}
```

**Response (Failed)**
```json
{
  "success": false,
  "error": "Invalid credentials. 3 attempts remaining.",
  "code": "INVALID_CREDENTIALS",
  "attemptsRemaining": 3
}
```

**Logout**
```http
POST /admin/logout
Authorization: Bearer <sessionToken>
```

**Session Validation**
```http
GET /admin/validate-session
Authorization: Bearer <sessionToken>
```

#### **Protected Admin Endpoints**

All admin endpoints require authentication:

- `GET /admin/ip-stats/:ip` - Get IP statistics
- `POST /admin/blacklist-ip` - Blacklist an IP
- `POST /admin/unblacklist-ip` - Remove IP from blacklist
- `GET /admin/sessions` - View active admin sessions
- `POST /admin/revoke-all-sessions` - Emergency logout all admins

## 🛡️ **Security Measures**

### **1. Login Protection**

**Rate Limiting**
- Maximum 5 login attempts per IP address
- 15-minute lockout after exceeding limit
- Counter resets on successful login

**Attack Mitigation**
- IP-based tracking prevents distributed brute force
- Progressive lockout duration for repeat offenders
- Secure password hashing with salt

### **2. Session Security**

**Token Management**
- Cryptographically secure token generation
- Redis-based session storage with TTL
- Automatic cleanup of expired sessions

**Session Validation**
- Every admin request validates session token
- IP address verification (optional, logged)
- Activity-based session renewal

### **3. Access Control**

**Middleware Protection**
- All admin routes protected by authentication middleware
- Automatic redirection for unauthenticated users
- Graceful error handling for expired sessions

**Audit Logging**
- All admin actions are logged with timestamps
- IP addresses and usernames tracked
- Failed login attempts recorded

## 📱 **User Interface**

### **Login Page Features**
- **Responsive design** works on all devices
- **Real-time validation** and error feedback
- **Loading states** for better UX
- **Security information** displayed to users
- **Auto-redirect** if already logged in

### **Dashboard Features**
- **Session information** displayed in header
- **Logout button** for easy session termination
- **Automatic authentication** check on page load
- **Seamless redirects** for expired sessions

## 🔧 **Advanced Configuration**

### **Custom Authentication Logic**

You can extend the authentication system by modifying `middleware/adminAuth.js`:

```javascript
// Custom password validation
authenticate(username, password, ip) {
  // Add your custom logic here
  // e.g., LDAP integration, database lookup, etc.
}

// Custom session validation
validateSession(sessionToken, ip) {
  // Add additional security checks
  // e.g., device fingerprinting, geolocation, etc.
}
```

### **Multiple Admin Users**

To support multiple admin users, modify the authentication logic:

```javascript
// Example: Database-backed admin users
const adminUsers = [
  { username: 'admin1', password: 'hashed_password_1', role: 'super' },
  { username: 'admin2', password: 'hashed_password_2', role: 'moderator' }
];
```

### **Role-Based Access Control**

Implement different permission levels:

```javascript
// Example middleware for role checking
requireRole(role) {
  return (req, res, next) => {
    if (req.adminSession.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.get('/admin/super-secure', adminAuth.requireAuth(), adminAuth.requireRole('super'), handler);
```

## 📊 **Monitoring & Maintenance**

### **Session Management**

**View Active Sessions**
```http
GET /admin/sessions
Authorization: Bearer <sessionToken>
```

**Emergency Logout All**
```http
POST /admin/revoke-all-sessions
Authorization: Bearer <sessionToken>
```

### **Security Monitoring**

**Key Metrics to Watch**
- Failed login attempts per IP
- Active admin sessions count
- Session duration patterns
- Geographic distribution of admin logins

**Redis Keys Used**
- `admin_session:*` - Active admin sessions
- `admin_login_attempts:*` - Failed login counters
- Session data includes: username, IP, login time, last activity

### **Maintenance Tasks**

**Regular Cleanup**
- Expired sessions are automatically cleaned up
- Failed login counters reset after lockout period
- Audit logs should be rotated periodically

**Security Updates**
- Regularly update session duration settings
- Monitor and adjust rate limiting thresholds
- Review and update admin credentials

## 🚨 **Troubleshooting**

### **Common Issues**

**1. Can't Login - "Too many attempts"**
- Wait 15 minutes for lockout to expire
- Check if IP is correctly detected
- Clear Redis login attempt counters manually if needed

**2. Session Expires Too Quickly**
- Increase `ADMIN_SESSION_DURATION` in environment
- Check if Redis is properly configured
- Verify system clock synchronization

**3. Redirected to Login After Authentication**
- Check browser localStorage for session token
- Verify session token format and validity
- Check network connectivity to Redis

### **Debug Commands**

```bash
# Check Redis for admin sessions
redis-cli keys "admin_session:*"

# View login attempts for IP
redis-cli get "admin_login_attempts:192.168.1.1"

# Clear all admin sessions (emergency)
redis-cli del $(redis-cli keys "admin_session:*")

# Clear login attempts for IP
redis-cli del "admin_login_attempts:192.168.1.1"
```

### **Logs to Monitor**

```bash
# Admin login attempts
grep "Admin login" server.log

# Authentication errors
grep "Auth.*error" server.log

# Session validation
grep "Session validation" server.log
```

## 🔒 **Best Practices**

### **Production Security**

1. **Change Default Credentials**
   ```bash
   ADMIN_USERNAME=secure_admin_name
   ADMIN_PASSWORD=very_secure_password_123!
   ```

2. **Use HTTPS in Production**
   - SSL/TLS encryption for all admin traffic
   - Secure cookie settings
   - HSTS headers

3. **Network Security**
   - Restrict admin access to specific IP ranges
   - Use VPN for remote admin access
   - Implement firewall rules

4. **Session Security**
   - Shorter session timeouts for high-security environments
   - Force logout on suspicious activity
   - Regular session token rotation

### **Operational Security**

1. **Regular Audits**
   - Review admin access logs monthly
   - Monitor failed login patterns
   - Check for unusual session activity

2. **Backup & Recovery**
   - Backup Redis session data
   - Document admin recovery procedures
   - Test authentication system regularly

3. **Incident Response**
   - Emergency session revocation procedures
   - Admin account lockout protocols
   - Security breach response plan

## 📞 **Support**

### **Getting Help**

For authentication-related issues:

1. Check the server logs for detailed error messages
2. Verify Redis connectivity and data
3. Test with default credentials in development
4. Review environment variable configuration

### **Security Reporting**

If you discover security vulnerabilities:

1. Do not post publicly
2. Contact system administrators directly
3. Provide detailed reproduction steps
4. Include potential impact assessment

The admin authentication system is designed to be secure by default while remaining user-friendly and maintainable.
