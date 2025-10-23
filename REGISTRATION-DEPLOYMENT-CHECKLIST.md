# Patient Registration - Deployment Checklist

## Pre-Deployment Verification

### ✅ Code Review
- [ ] All files properly formatted
- [ ] No console.log statements in production code
- [ ] Error handling implemented everywhere
- [ ] Input validation on frontend and backend
- [ ] No hardcoded credentials
- [ ] Environment variables used properly

### ✅ Security Checks
- [ ] Passwords are hashed (bcrypt)
- [ ] JWT secrets are secure
- [ ] CORS configured properly
- [ ] SQL injection prevention (Mongoose)
- [ ] XSS protection enabled
- [ ] Rate limiting considered
- [ ] HTTPS ready

### ✅ Testing
- [ ] Time slot validation working (5:30 PM - 7:30 PM)
- [ ] All required fields validated
- [ ] Duplicate user check working
- [ ] Aadhaar validation (12 digits)
- [ ] Mobile validation (10 digits, starts with 6-9)
- [ ] Pincode validation (6 digits)
- [ ] Blood group dropdown working
- [ ] Emergency contact saved correctly
- [ ] Address saved correctly
- [ ] Health ID auto-generated
- [ ] Tokens returned correctly
- [ ] Redirect to dashboard working
- [ ] Language switching (EN/HI)
- [ ] Responsive on mobile devices
- [ ] Form disables outside hours
- [ ] Error messages user-friendly

### ✅ Database
- [ ] MongoDB connection stable
- [ ] Indexes created on unique fields
- [ ] Database backup strategy in place
- [ ] Connection pooling configured

### ✅ API Endpoints
- [ ] POST /api/v1/auth/register - Working
- [ ] Returns proper status codes (201, 400, 403)
- [ ] Error responses structured correctly
- [ ] Success responses include all data

### ✅ Frontend
- [ ] Build completes without errors
- [ ] No TypeScript errors (if using TS)
- [ ] All translations present (EN/HI)
- [ ] Images/assets optimized
- [ ] Bundle size acceptable
- [ ] PWA configuration (if applicable)

### ✅ Documentation
- [ ] PATIENT-REGISTRATION.md complete
- [ ] REGISTRATION-IMPLEMENTATION.md reviewed
- [ ] REGISTRATION-TESTING.md verified
- [ ] API documentation up to date
- [ ] README updated

## Environment Configuration

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb://your-production-db-uri

# JWT
JWT_SECRET=your-strong-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_REFRESH_EXPIRE=30d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting (optional)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-api-url.com/api/v1
REACT_APP_ENV=production
```

## Deployment Steps

### 1. Backend Deployment

#### Option A: Traditional Server
```bash
# SSH into server
ssh user@your-server.com

# Clone or pull latest code
cd /var/www/vitacare-backend
git pull origin main

# Install dependencies
npm install --production

# Run database migrations (if any)
npm run migrate

# Restart service
pm2 restart vitacare-backend
# OR
systemctl restart vitacare-backend
```

#### Option B: Docker
```bash
# Build image
docker build -t vitacare-backend .

# Run container
docker run -d \
  --name vitacare-backend \
  -p 5000:5000 \
  --env-file .env \
  vitacare-backend
```

#### Option C: Cloud Platform (AWS, Azure, GCP)
- Deploy using platform-specific tools
- Configure environment variables
- Set up auto-scaling
- Configure load balancer

### 2. Frontend Deployment

#### Build Production Bundle
```bash
cd vitacare-frontend
npm run build
```

#### Option A: Static Hosting (Netlify, Vercel)
```bash
# Netlify
netlify deploy --prod --dir=build

# Vercel
vercel --prod
```

#### Option B: Traditional Server (Nginx)
```bash
# Copy build files
scp -r build/* user@server:/var/www/vitacare-frontend/

# Nginx configuration already set
sudo nginx -t
sudo systemctl reload nginx
```

#### Option C: Cloud Storage (AWS S3, Azure Blob)
```bash
# AWS S3 example
aws s3 sync build/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### 3. Database Setup

```bash
# Ensure indexes are created
use vitacare;

db.users.createIndex({ aadhaarNumber: 1 }, { unique: true });
db.users.createIndex({ mobileNumber: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true, sparse: true });
db.users.createIndex({ healthId: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

# Verify indexes
db.users.getIndexes();
```

### 4. SSL/TLS Configuration

#### Option A: Let's Encrypt (Certbot)
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

#### Option B: Cloud Platform
- Use platform-managed certificates (AWS ACM, Azure Key Vault)
- Configure in load balancer

### 5. Monitoring Setup

#### PM2 Monitoring (if using)
```bash
pm2 startup
pm2 save
pm2 install pm2-logrotate
```

#### Application Monitoring
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Configure logging (Winston, Morgan)
- [ ] Set up uptime monitoring
- [ ] Configure alerts

### 6. Performance Optimization

#### Backend
- [ ] Enable compression middleware
- [ ] Configure caching (Redis)
- [ ] Optimize database queries
- [ ] Enable connection pooling
- [ ] Set up CDN for static assets

#### Frontend
- [ ] Code splitting enabled
- [ ] Lazy loading implemented
- [ ] Images optimized
- [ ] Gzip compression enabled
- [ ] Browser caching configured

## Post-Deployment Verification

### Smoke Tests
```bash
# Health check
curl https://your-api.com/health

# Registration endpoint (during valid hours)
curl -X POST https://your-api.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d @test-data/sample-patient.json

# Check response codes
# 201 - Success (during hours)
# 403 - Time restriction (outside hours)
# 400 - Validation error
```

### Frontend Tests
- [ ] Open https://your-frontend.com
- [ ] Registration page loads
- [ ] Time validation works
- [ ] Form submission works
- [ ] Language switching works
- [ ] Responsive design works
- [ ] No console errors

### Database Verification
```bash
# Connect to production DB
mongo "mongodb://your-production-uri"

# Check user created
db.users.findOne({ healthId: "VH..." })

# Verify fields
# - healthId exists
# - password is hashed
# - profile.bloodGroup exists
# - emergencyContacts array populated
# - createdAt timestamp present
```

### Monitoring Checks
- [ ] Application logs accessible
- [ ] Error tracking working
- [ ] Performance metrics visible
- [ ] Uptime monitoring active
- [ ] Alerts configured

## Rollback Plan

### If Issues Detected

#### Backend Rollback
```bash
# Revert to previous version
git checkout <previous-commit-hash>
npm install
pm2 restart vitacare-backend
```

#### Frontend Rollback
```bash
# Redeploy previous build
# Netlify
netlify rollback

# Manual
git checkout <previous-commit-hash>
npm run build
# Deploy build/
```

#### Database Rollback
```bash
# Restore from backup
mongorestore --uri="mongodb://your-uri" /path/to/backup
```

## Go-Live Checklist

### Final Verification
- [ ] All smoke tests passed
- [ ] No critical errors in logs
- [ ] Database connections stable
- [ ] SSL certificate valid
- [ ] DNS configured correctly
- [ ] Monitoring active
- [ ] Backup strategy in place
- [ ] Team notified
- [ ] Documentation updated
- [ ] Support team briefed

### Communication
- [ ] Announce maintenance window (if any)
- [ ] Notify stakeholders of go-live
- [ ] Prepare rollback communication
- [ ] Share registration hours with users

### Support Readiness
- [ ] Support team trained on new feature
- [ ] FAQs prepared
- [ ] Known issues documented
- [ ] Escalation path defined
- [ ] Monitoring dashboard accessible

## Post-Go-Live

### Week 1 Monitoring
- [ ] Monitor error rates daily
- [ ] Check user registration success rate
- [ ] Verify time restriction working
- [ ] Review user feedback
- [ ] Track performance metrics

### Week 2-4 Monitoring
- [ ] Analyze usage patterns
- [ ] Review registration conversion rate
- [ ] Check for duplicate registrations
- [ ] Optimize based on metrics
- [ ] Collect user feedback

### Continuous Improvement
- [ ] Plan next iteration features
- [ ] Address user feedback
- [ ] Optimize performance bottlenecks
- [ ] Update documentation
- [ ] Train support team on issues

## Emergency Contacts

**Technical Lead**: [Name] - [Phone] - [Email]  
**DevOps**: [Name] - [Phone] - [Email]  
**DBA**: [Name] - [Phone] - [Email]  
**Support Lead**: [Name] - [Phone] - [Email]

## Reference Documents

- `PATIENT-REGISTRATION.md` - Feature documentation
- `REGISTRATION-IMPLEMENTATION.md` - Technical details
- `REGISTRATION-TESTING.md` - Test cases
- `REGISTRATION-QUICK-REF.md` - Quick reference

---

**Deployment Date**: _________________  
**Deployed By**: _________________  
**Sign-off**: _________________  

**Status**: ⬜ Ready for Deployment / ✅ Deployed / ❌ Rollback Required
