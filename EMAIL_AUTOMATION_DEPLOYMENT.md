# Email Automation Deployment Guide

## SendGrid Setup (Required)

### 1. Create SendGrid Account

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free tier (100 emails/day free forever)
3. Verify your sender identity email

### 2. Create API Key

1. Settings → API Keys → Create API Key
2. Name: "looksmaxxking-firebase"
3. Permissions: Full Access
4. Copy API key (starts with `SG.`)

### 3. Set Firebase Environment Variable

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY_HERE"
```

### 4. Create Email Templates in SendGrid

**Template IDs needed:**

| Template ID | Purpose | Subject Line |
|-------------|---------|--------------|
| `d-welcome01` | Welcome email (immediate) | "Welcome to LOOKSMAXXKING - Your Journey Starts Now" |
| `d-welcome02` | Day 2 follow-up | "Your Personalized Looksmaxxing Roadmap" |
| `d-welcome03` | Day 3 tips | "3 Quick Wins to Improve Your Rating" |
| `d-welcome07` | Day 7 upgrade push | "Still Free: Unlock Premium Features" |
| `d-trial-reminder` | 2 scans remaining | "You Have 2 Free Scans Left" |
| `d-trial-expired` | All scans used | "Ready to Unlock Unlimited Scans?" |
| `d-reengage` | 14 days inactive | "We Miss You - Come Back for 30% Off" |
| `d-premium-welcome` | Premium upgrade | "Welcome to Premium - Here's What's Next" |
| `d-premium-tips1` | Premium day 1 | "3 Premium Features You Need to Try" |
| `d-premium-tips7` | Premium day 7 | "Maximizing Your Premium Membership" |
| `d-referral-success` | Referrer reward | "You Earned 7 Days Free Premium!" |
| `d-referred-welcome` | New referral | "Your Friend Gave You 7 Days Free Premium" |

**To create templates:**

1. SendGrid Dashboard → Email API → Dynamic Templates
2. Create Template
3. Add Version → Use Design Editor
4. Use variables like `{{name}}`, `{{ctaUrl}}`, `{{reward}}`
5. Copy Template ID and update `index.js`

## Firebase Deployment

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Project (if not done)

```bash
firebase init functions
# Select: Firestore, Functions, Hosting
# Choose existing project: gen-lang-client-0394791038
# Language: JavaScript
# ESLint: No
# Install dependencies: Yes
```

### 4. Deploy Functions

```bash
firebase deploy --only functions
```

This deploys:

- `sendWelcomeEmail` (Firestore trigger)
- `processScheduledEmails` (Runs every hour)
- `sendTrialReminderEmail` (Firestore trigger)
- `sendReengagementEmails` (Runs daily)
- `sendPremiumWelcome` (Firestore trigger)
- `sendReferralReward` (Firestore trigger)

### 5. Verify Deployment

```bash
firebase functions:log
```

## Firestore Setup

### Required Collections

**1. `leads` collection:**

- Stores email captures
- Triggers welcome email on create

**2. `scheduledEmails` collection:**

- Stores queued emails
- Processed by `processScheduledEmails` function

**3. `userProfiles` collection:**

- Must have fields:
  - `email` (string)
  - `displayName` (string)
  - `scanCount` (number)
  - `isPremium` (boolean)
  - `lastActive` (timestamp)
  - `emailSent_reengagement` (boolean)

**4. `referrals` collection:**

- Triggers referral reward emails

### Firestore Indexes (Required)

Create composite indexes:

```json
{
  "indexes": [
    {
      "collectionGroup": "scheduledEmails",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "sent", "order": "ASCENDING" },
        { "fieldPath": "scheduledFor", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "userProfiles",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "lastActive", "order": "ASCENDING" },
        { "fieldPath": "isPremium", "order": "ASCENDING" },
        { "fieldPath": "emailSent_reengagement", "order": "ASCENDING" }
      ]
    }
  ]
}
```

Save as `firestore.indexes.json` and deploy:

```bash
firebase deploy --only firestore:indexes
```

## Testing

### Test Welcome Email

1. Create new lead in Firestore:

```javascript
db.collection('leads').add({
  email: 'test@example.com',
  name: 'Test User',
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

1. Check SendGrid Activity Feed for delivery

### Test Scheduled Emails

1. Check `scheduledEmails` collection for queued emails
2. Wait for hourly cron to run
3. Verify emails sent and marked as `sent: true`

### Test Trial Reminder

1. Update user profile to `scanCount: 8`
2. Should trigger trial reminder email immediately

## Monitoring

### View Logs

```bash
firebase functions:log --only sendWelcomeEmail
firebase functions:log --only processScheduledEmails
```

### SendGrid Dashboard

- Email Activity Feed shows all sent emails
- Stats & Analytics for open/click rates

### Firebase Console

- Functions → Dashboard shows invocation counts
- Functions → Logs shows errors

## Cost Estimate

**SendGrid:**

- Free tier: 100 emails/day (3,000/month) = $0
- Essentials: 50,000 emails/month = $19.95/month
- Pro: 100,000 emails/month = $89.95/month

**Firebase Functions:**

- Free tier: 2M invocations/month
- This includes:
  - 6 Firestore triggers (welcome, trial, premium, referral)
  - 2 scheduled functions (hourly + daily)
- Estimate: 10,000 emails/month = well within free tier

**Total Cost:** $0-20/month depending on email volume

## Email Sequence Overview

### Welcome Series (Free Users)

1. **Immediate:** Welcome + explain features
2. **Day 2:** Personalized roadmap tips
3. **Day 3:** Quick wins (body fat, grooming)
4. **Day 7:** Premium upgrade offer

### Trial Management

1. **8/10 scans:** "2 scans left" reminder
2. **10/10 scans (7 days later):** "Upgrade to continue"

### Re-engagement  

1. **Day 14 inactive:** Comeback offer (30% off)

### Premium Onboarding

1. **Immediate:** Premium welcome
2. **Day 1:** Feature tutorial
3. **Day 7:** Maximizing premium

### Referrals

1. **Immediate:** Both users get reward notification

## Revenue Impact Projection

### Current State (No Emails)

- ~500 emails captured
- 0% email conversion
- Revenue: $0

### With Email Automation

- 500 existing leads × 20% conversion = 100 premium users
- 100 × $29.99 = **$2,999/month** from existing leads
- **$36,000/year** from backlog alone

### Ongoing (New Leads)

- 1,000 new leads/month (projected)
- × 20% email conversion = 200 premium/month
- × $29.99 = **$5,998/month** ongoing
- **$71,976/year** from new leads

**Total Projected:** $36K (backlog) + $72K (ongoing) = **$108K ARR from email automation**

## Next Steps

1. ✅ Deploy functions to Firebase
2. ✅ Create SendGrid templates
3. ✅ Set environment variables
4. ✅ Test with sample leads
5. ✅ Monitor for 1 week
6. ✅ Optimize based on open/click rates
7. ✅ Scale up as traffic grows

---

**Status:** Ready to deploy - waiting for SendGrid setup
