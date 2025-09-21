# Production Monitoring Setup Guide - Complete

## 🎯 Comprehensive Monitoring Stack

Your Second Turn Games project now has enterprise-grade monitoring with **Vercel Analytics**, **Logflare integration**, and **Supabase logs** for complete visibility into frontend performance, API operations, and database activity.

## 📊 Monitoring Architecture

### **Frontend Monitoring**

- **Vercel Analytics** - User behavior and page views
- **Vercel Speed Insights** - Core Web Vitals and performance metrics
- **Custom Performance Tracking** - Component-level performance monitoring
- **Sentry Integration** - Error tracking and user sessions

### **Backend Monitoring**

- **Logflare Integration** - Structured logging for API routes
- **Supabase Logs** - Database operations and auth events
- **API Performance Tracking** - Response times and error rates
- **Database Monitoring** - Query performance and connection health

### **Business Intelligence**

- **User Journey Tracking** - Complete user flow analysis
- **Conversion Funnel** - Listing creation and contact rates
- **Feature Usage** - BGG integration and search patterns
- **Performance Impact** - Business metrics correlation

## 🚀 Setup Instructions

### **1. Vercel Analytics Setup**

#### **Automatic Activation**

Vercel Analytics is **automatically enabled** when you deploy to Vercel - no additional configuration needed!

#### **Manual Configuration (Optional)**

If you need custom tracking or are using a different hosting provider:

```bash
# Already installed
npm install @vercel/analytics @vercel/speed-insights
```

**Environment Variables:**

```bash
# Optional - Vercel automatically provides these
VERCEL_ANALYTICS_ID=your-analytics-id
```

#### **Verification Steps**

1. Deploy your app to Vercel
2. Visit your Vercel dashboard
3. Navigate to your project → Analytics tab
4. Verify data is being collected

### **2. Logflare Integration Setup**

#### **Create Logflare Account**

1. Go to [logflare.app](https://logflare.app)
2. Sign up with GitHub or email
3. Create a new source for your project
4. Copy the **Source Token** and **API Key**

#### **Environment Configuration**

Add to your `.env.local` and Vercel environment variables:

```bash
# Logflare Configuration
LOGFLARE_SOURCE_TOKEN=your-logflare-source-token
LOGFLARE_API_KEY=your-logflare-api-key
LOGFLARE_ENDPOINT=https://api.logflare.app/logs
```

#### **Verification Steps**

```bash
# Start development server
npm run dev

# Trigger some API calls
curl http://localhost:3000/api/listings

# Check Logflare dashboard for incoming logs
```

### **3. Supabase Logs Integration**

#### **Enable Supabase Logging**

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Enable **Log all API requests**
4. Configure **Log retention** (recommended: 7-30 days)

#### **Logflare-Supabase Integration**

1. In Logflare, create a new **Supabase source**
2. Connect your Supabase project using the integration
3. Configure log forwarding for:
   - **API requests** (`/rest/*`)
   - **Auth events** (`/auth/*`)
   - **Database operations** (via triggers)
   - **Real-time events** (`/realtime/*`)

#### **Custom Database Logging**

Add logging triggers to important tables:

```sql
-- Example: Log listing operations
CREATE OR REPLACE FUNCTION log_listing_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log to Supabase logs
  RAISE LOG 'Listing % %: % -> %',
    TG_OP,
    COALESCE(NEW.id, OLD.id),
    OLD,
    NEW;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to listings table
CREATE TRIGGER listing_changes_log
  AFTER INSERT OR UPDATE OR DELETE ON listings
  FOR EACH ROW EXECUTE FUNCTION log_listing_changes();
```

## 📈 Monitoring Dashboards

### **Vercel Analytics Dashboard**

**Key Metrics:**

- **Page Views** - Traffic patterns and popular pages
- **Unique Visitors** - User acquisition and retention
- **Top Pages** - Most visited content
- **Referrers** - Traffic sources and campaigns
- **Devices** - Mobile vs desktop usage
- **Countries** - Geographic distribution

**Access:** Vercel Dashboard → Your Project → Analytics

### **Vercel Speed Insights Dashboard**

**Core Web Vitals:**

- **LCP (Largest Contentful Paint)** - Loading performance
- **FID (First Input Delay)** - Interactivity
- **CLS (Cumulative Layout Shift)** - Visual stability
- **TTFB (Time to First Byte)** - Server response time

**Performance Scores:**

- **Real User Monitoring** - Actual user experience
- **Performance Trends** - Historical performance data
- **Page-specific Metrics** - Performance by route

**Access:** Vercel Dashboard → Your Project → Speed Insights

### **Logflare Dashboard**

**Log Streams:**

- **API Requests** - All API route activity
- **Database Operations** - Query performance and errors
- **Authentication Events** - User login/logout activity
- **Business Events** - Listing creation, contacts, searches

**Custom Dashboards:**

```javascript
// Example Logflare query for API performance
source: "your-source-id"
| where metadata.type == "api_call"
| where metadata.duration > 2000
| stats count() by metadata.endpoint
| sort by count desc
```

**Access:** [logflare.app](https://logflare.app) → Your Project → Dashboard

### **Supabase Logs Dashboard**

**Database Monitoring:**

- **Query Performance** - Slow query identification
- **Connection Pool** - Database connection health
- **Error Rates** - Database operation failures
- **Table Activity** - Most active tables and operations

**Auth Monitoring:**

- **Sign-up Rates** - User registration trends
- **Login Patterns** - Authentication success/failure rates
- **Session Duration** - User engagement metrics

**Access:** Supabase Dashboard → Your Project → Logs

## 🔔 Alerting Strategies

### **Critical Alerts (Immediate Response)**

#### **1. Application Down**

- **Metric:** Error rate > 50% for 2 minutes
- **Threshold:** 50% error rate
- **Action:** Immediate notification (SMS/Phone)
- **Escalation:** 5 minutes

#### **2. Database Connection Issues**

- **Metric:** Database connection errors
- **Threshold:** > 5 errors in 1 minute
- **Action:** Immediate notification
- **Escalation:** 2 minutes

#### **3. Authentication System Failure**

- **Metric:** Auth error rate > 25%
- **Threshold:** 25% auth error rate
- **Action:** Immediate notification
- **Escalation:** 5 minutes

### **Performance Alerts (Same Day Response)**

#### **1. Slow API Response Times**

- **Metric:** Average API response time
- **Threshold:** > 3 seconds for 5 minutes
- **Action:** Email notification
- **Escalation:** 30 minutes

#### **2. Core Web Vitals Degradation**

- **Metric:** LCP, FID, CLS scores
- **Thresholds:**
  - LCP > 2.5 seconds
  - FID > 100ms
  - CLS > 0.1
- **Action:** Daily digest email
- **Escalation:** Weekly review

#### **3. High Error Rate**

- **Metric:** Overall error rate
- **Threshold:** > 5% for 10 minutes
- **Action:** Email notification
- **Escalation:** 1 hour

### **Business Alerts (Daily Monitoring)**

#### **1. Conversion Rate Drop**

- **Metric:** Listing creation rate
- **Threshold:** 50% below 7-day average
- **Action:** Daily report
- **Review:** Weekly

#### **2. User Engagement Drop**

- **Metric:** Page views per session
- **Threshold:** 25% below average
- **Action:** Daily report
- **Review:** Weekly

#### **3. Search Performance Issues**

- **Metric:** Search result click-through rate
- **Threshold:** 30% below average
- **Action:** Weekly report
- **Review:** Bi-weekly

## 📊 Monitoring Thresholds

### **Performance Thresholds**

| Metric              | Good    | Warning   | Critical | Action                |
| ------------------- | ------- | --------- | -------- | --------------------- |
| API Response Time   | < 1s    | 1-3s      | > 3s     | Investigate/Optimize  |
| Database Query Time | < 100ms | 100-500ms | > 500ms  | Query Optimization    |
| Page Load Time      | < 2s    | 2-4s      | > 4s     | Performance Audit     |
| Error Rate          | < 1%    | 1-5%      | > 5%     | Error Investigation   |
| Uptime              | > 99.9% | 99-99.9%  | < 99%    | Infrastructure Review |

### **Business Thresholds**

| Metric                 | Good           | Warning        | Critical       | Action                  |
| ---------------------- | -------------- | -------------- | -------------- | ----------------------- |
| Daily Active Users     | Baseline + 10% | Baseline ± 10% | Baseline - 25% | Marketing Review        |
| Listing Creation Rate  | > 5/day        | 3-5/day        | < 3/day        | UX Review               |
| Search Success Rate    | > 80%          | 60-80%         | < 60%          | Search Algorithm Review |
| User Retention (7-day) | > 30%          | 20-30%         | < 20%          | Product Review          |

### **Technical Thresholds**

| Metric               | Good  | Warning | Critical | Action             |
| -------------------- | ----- | ------- | -------- | ------------------ |
| Memory Usage         | < 70% | 70-85%  | > 85%    | Scale Up           |
| CPU Usage            | < 60% | 60-80%  | > 80%    | Performance Review |
| Database Connections | < 50% | 50-75%  | > 75%    | Connection Pooling |
| Storage Usage        | < 80% | 80-90%  | > 90%    | Storage Cleanup    |

## 🔧 Alert Configuration

### **Logflare Alerts**

#### **Setup Process:**

1. Go to Logflare Dashboard
2. Navigate to **Alerts** section
3. Create new alert rule
4. Configure conditions and notifications

#### **Example Alert Rules:**

**High Error Rate Alert:**

```javascript
// Query
source: "your-source-id"
| where metadata.level == "error"
| stats count() by bin(timestamp, 5m)
| where count > 10

// Condition: count > 10 errors in 5 minutes
// Action: Send email notification
```

**Slow API Alert:**

```javascript
// Query
source: "your-source-id"
| where metadata.type == "api_call"
| where metadata.duration > 3000
| stats count() by metadata.endpoint

// Condition: > 5 slow requests in 10 minutes
// Action: Send Slack notification
```

### **Supabase Alerts**

#### **Database Performance Alert:**

1. Go to Supabase Dashboard → Settings → Integrations
2. Set up webhook for slow queries
3. Configure threshold (e.g., > 1 second)
4. Set notification endpoint

#### **Auth Rate Alert:**

1. Monitor auth error rates via logs
2. Set up custom webhook for high error rates
3. Configure alert for > 10 auth failures/minute

### **Vercel Alerts**

#### **Performance Budget Alert:**

1. Go to Vercel Dashboard → Your Project → Settings
2. Navigate to **Performance** section
3. Set performance budgets:
   - Bundle size < 200KB
   - LCP < 2.5s
   - FID < 100ms
4. Enable email notifications for budget violations

## 📱 Notification Channels

### **Immediate Notifications (Critical)**

- **SMS** - For application down scenarios
- **Phone Calls** - For extended outages
- **Slack** - Development team channel
- **PagerDuty** - On-call rotation (if available)

### **Regular Notifications (Performance)**

- **Email** - Daily/weekly performance reports
- **Slack** - Performance degradation alerts
- **Discord** - Community notifications (if applicable)

### **Business Notifications (Insights)**

- **Email Reports** - Weekly business metrics
- **Dashboard** - Real-time business intelligence
- **Slack Digest** - Daily summary of key metrics

## 📋 Monitoring Checklist

### **Daily Monitoring Tasks**

- [ ] Check error rates and recent issues
- [ ] Review API performance metrics
- [ ] Monitor user activity and engagement
- [ ] Verify all monitoring systems are operational
- [ ] Review critical alerts and responses

### **Weekly Monitoring Tasks**

- [ ] Analyze performance trends
- [ ] Review business metrics and KPIs
- [ ] Update alert thresholds based on traffic patterns
- [ ] Check monitoring system health
- [ ] Review and optimize slow queries

### **Monthly Monitoring Tasks**

- [ ] Comprehensive performance audit
- [ ] Review and update monitoring strategy
- [ ] Analyze user behavior patterns
- [ ] Update business metric baselines
- [ ] Review alert effectiveness and adjust

## 🎯 Key Performance Indicators (KPIs)

### **Technical KPIs**

1. **Availability** - 99.9% uptime target
2. **Performance** - 95% of requests < 2s response time
3. **Error Rate** - < 1% overall error rate
4. **Core Web Vitals** - All metrics in "Good" range
5. **Database Performance** - 95% of queries < 500ms

### **Business KPIs**

1. **User Engagement** - Average session duration > 5 minutes
2. **Conversion Rate** - Visitor to listing creator > 2%
3. **Search Success** - Search to listing view > 60%
4. **User Retention** - 7-day retention > 25%
5. **Growth Rate** - Monthly active users growth > 10%

### **User Experience KPIs**

1. **Page Load Speed** - 95% of pages load < 3s
2. **Search Response** - Search results < 1s
3. **Form Completion** - Listing creation success > 85%
4. **Error Recovery** - Users recover from errors > 70%
5. **Mobile Experience** - Mobile performance score > 80

## 🔍 Log Analysis and Insights

### **Common Log Patterns to Monitor**

#### **Performance Patterns**

```bash
# Slow API requests
grep "duration.*[3-9][0-9][0-9][0-9]" logs.json

# Database connection issues
grep "connection.*timeout\|connection.*failed" logs.json

# Memory usage spikes
grep "memory.*high\|out of memory" logs.json
```

#### **Error Patterns**

```bash
# Authentication failures
grep "auth.*failed\|login.*error" logs.json

# BGG API timeouts
grep "bgg.*timeout\|bgg.*failed" logs.json

# Image upload failures
grep "upload.*failed\|storage.*error" logs.json
```

#### **Business Patterns**

```bash
# Successful listing creations
grep "listing.*created" logs.json

# Search patterns
grep "search.*performed" logs.json

# User engagement
grep "user.*interaction" logs.json
```

### **Automated Log Analysis**

#### **Logflare Queries for Common Issues**

**Top Error Sources:**

```javascript
source: "your-source-id"
| where metadata.level == "error"
| stats count() by metadata.source
| sort by count desc
| limit 10
```

**Slowest API Endpoints:**

```javascript
source: "your-source-id"
| where metadata.type == "api_call"
| stats avg(metadata.duration) as avg_duration by metadata.endpoint
| sort by avg_duration desc
```

**Most Active Users:**

```javascript
source: "your-source-id"
| where metadata.user_id != null
| stats count() by metadata.user_id
| sort by count desc
| limit 20
```

## 🚀 Production Deployment Monitoring

### **Pre-Deployment Checklist**

- [ ] All monitoring systems configured
- [ ] Alert thresholds set appropriately
- [ ] Notification channels tested
- [ ] Baseline metrics established
- [ ] Rollback procedures documented

### **Post-Deployment Monitoring**

- [ ] Monitor error rates for first 30 minutes
- [ ] Check performance metrics vs baseline
- [ ] Verify all features working correctly
- [ ] Monitor user activity patterns
- [ ] Review logs for unexpected issues

### **Deployment Health Checks**

```bash
# API health check
curl -f https://your-domain.com/api/health

# Database connectivity
curl -f https://your-domain.com/api/listings?limit=1

# Authentication system
curl -f https://your-domain.com/api/auth/user
```

## 📞 Escalation Procedures

### **Level 1: Development Team (0-30 minutes)**

- **Scope:** Performance issues, minor bugs
- **Response:** Best effort during business hours
- **Contact:** Slack, email

### **Level 2: Technical Lead (30-60 minutes)**

- **Scope:** Service degradation, persistent errors
- **Response:** Within 1 hour during business hours
- **Contact:** Phone, SMS, Slack

### **Level 3: Emergency Response (Immediate)**

- **Scope:** Service outage, data loss, security breach
- **Response:** Immediate, 24/7
- **Contact:** Phone calls, SMS, PagerDuty

---

## 🎉 **Monitoring Ready!**

Your comprehensive monitoring stack is now configured and ready for production:

✅ **Frontend Performance** - Vercel Analytics + Speed Insights  
✅ **Backend Monitoring** - Logflare integration with structured logging  
✅ **Database Monitoring** - Supabase logs with custom triggers  
✅ **Error Tracking** - Sentry integration with contextual data  
✅ **Business Intelligence** - Custom analytics and KPI tracking  
✅ **Alerting Strategy** - Multi-level alerts with escalation procedures  
✅ **Performance Thresholds** - Established baselines and warning levels

**Start monitoring your production environment:**

```bash
# Deploy with monitoring
npm run build
vercel --prod

# Verify monitoring systems
curl https://your-domain.com/api/health
```

**Your board game marketplace now has enterprise-grade monitoring and alerting! 📊🔔**

## 📚 Additional Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Logflare Documentation](https://docs.logflare.app/)
- [Supabase Logging Guide](https://supabase.com/docs/guides/platform/logs)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [SRE Best Practices](https://sre.google/)
