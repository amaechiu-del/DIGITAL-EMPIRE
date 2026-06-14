# 🚀 DIGITAL-EMPIRE Deployment Guide

Complete guide to deploy your PWA across GitHub Pages → Railway → Docker → Mobile Platforms.

---

## **Table of Contents**
1. [✅ GitHub Actions CI/CD](#1-github-actions-cicd)
2. [🚂 Railway Backend Deployment](#2-railway-backend-deployment)
3. [🐳 Docker Containerization](#3-docker-containerization)
4. [📱 Mobile App Deployment](#4-mobile-app-deployment)

---

# 1. ✅ GitHub Actions CI/CD

Your workflow is already set up! Here's how it works:

### **Current Workflow**
- **File**: `.github/workflows/deploy.yml`
- **Triggers**: Push to `main` branch (auto-deploys)
- **What it does**:
  - ✅ Validates all PWA files exist
  - ✅ Checks manifest.json is valid
  - ✅ Verifies Paystack SDK is included
  - ✅ Deploys frontend to GitHub Pages

### **How to Trigger**
```bash
git add .
git commit -m "Update app"
git push origin main
# → Workflow runs automatically!
```

### **Monitor Deployment**
1. Go to: https://github.com/amaechiu-del/DIGITAL-EMPIRE/actions
2. Click the latest workflow run
3. Watch the steps execute
4. ✅ When complete, app is live at: `https://amaechiu-del.github.io/DIGITAL-EMPIRE/`

### **Enhancement: Add GitHub Pages Configuration**

Enable GitHub Pages in your repo settings:
1. Go to **Settings** → **Pages**
2. Set **Source** to `GitHub Actions`
3. Your PWA deploys automatically

---

# 2. 🚂 Railway Backend Deployment

Railway is the easiest way to deploy your Node.js backend.

### **Step 1: Create Railway Account**
```bash
# Go to https://railway.app
# Sign up with GitHub (easiest)
```

### **Step 2: Create a New Project**
1. Click "Create New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `DIGITAL-EMPIRE` repo
4. Railway auto-detects Node.js 🎉

### **Step 3: Set Environment Variables**
In Railway dashboard:
1. Go to **Variables** tab
2. Add these secrets:
```env
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx
APP_URL=https://your-railway-domain.up.railway.app
CORS_ORIGINS=https://amaechiu-del.github.io,https://your-railway-domain.up.railway.app
NODE_ENV=production
```

### **Step 4: Deploy**
```bash
# Railway auto-deploys on push to main
git push origin main
# → Check Railway dashboard for deployment status
```

### **Get Your Backend URL**
- Railway creates a public domain: `https://your-app.up.railway.app`
- Your API endpoints:
  - `https://your-app.up.railway.app/api/payment/checkout`
  - `https://your-app.up.railway.app/api/payment/verify`
  - `https://your-app.up.railway.app/api/payment/webhook`

### **Connect Frontend to Backend**
In `js/payment.js`, update:
```javascript
const API_BASE_URL = 'https://your-railway-domain.up.railway.app';

fetch(`${API_BASE_URL}/api/payment/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount, email })
})
```

### **Set up Paystack Webhook**
1. Go to Paystack Dashboard: https://dashboard.paystack.com
2. Settings → Webhooks
3. Set URL to: `https://your-railway-domain.up.railway.app/api/payment/webhook`
4. Select events: `charge.success`, `charge.failed`

---

# 3. 🐳 Docker Containerization

Docker packages your app for any platform.

### **Step 1: Create Dockerfile**

Create `Dockerfile` in your repo root:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
```

### **Step 2: Create Docker Compose (for local testing)**

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      PAYSTACK_PUBLIC_KEY: ${PAYSTACK_PUBLIC_KEY}
      PAYSTACK_SECRET_KEY: ${PAYSTACK_SECRET_KEY}
      APP_URL: http://localhost:3000
      NODE_ENV: development
    volumes:
      - .:/app
      - /app/node_modules
```

### **Step 3: Test Docker Locally**

```bash
# Build image
docker build -t digital-empire:latest .

# Run container
docker run -p 3000:3000 \
  -e PAYSTACK_PUBLIC_KEY=pk_test_xxx \
  -e PAYSTACK_SECRET_KEY=sk_test_xxx \
  digital-empire:latest

# Test: Open http://localhost:3000
```

### **Step 4: Deploy to Docker Hub**

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag digital-empire:latest your-dockerhub-username/digital-empire:latest

# Push to registry
docker push your-dockerhub-username/digital-empire:latest
```

### **Step 5: Deploy to Production Platforms**

#### **Option A: AWS ECR + ECS**
```bash
# Push to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag digital-empire:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/digital-empire:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/digital-empire:latest
```

#### **Option B: Render with Docker**
1. Go to Render.com
2. Create "New Web Service"
3. Select "Docker"
4. Point to your Docker Hub image
5. Add environment variables
6. Deploy ✅

#### **Option C: DigitalOcean App Platform**
1. Connect GitHub repo
2. Select `Dockerfile`
3. Set environment variables
4. Deploy ✅

---

# 4. 📱 Mobile App Deployment

Deploy to Play Store (Android) and App Store (iOS).

### **Option A: Wrap PWA as Android App (Play Store)**

#### **Step 1: Create APK from PWA using Capacitor**

```bash
npm install @capacitor/core @capacitor/cli
npx cap init

# Generate Android project
npx cap add android

# Build for Android
npx cap sync
```

#### **Step 2: Configure Capacitor**

Create `capacitor.config.json`:

```json
{
  "appId": "com.domislink.empire",
  "appName": "Digital Empire",
  "webDir": ".",
  "server": {
    "url": "http://localhost:3000",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000
    }
  }
}
```

#### **Step 3: Build APK**

```bash
cd android
./gradlew assembleRelease
# APK location: app/build/outputs/apk/release/app-release.apk
```

#### **Step 4: Sign APK**

```bash
keytool -genkey -v -keystore digital-empire-keystore.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias digital-empire

# Sign APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore digital-empire-keystore.jks \
  app/build/outputs/apk/release/app-release.apk digital-empire
```

#### **Step 5: Upload to Play Store**

1. Go to **Google Play Console**: https://play.google.com/console
2. Create new app
3. Fill in details:
   - App name: "Digital Empire"
   - Category: Business
   - Description: "DOMISLINK International PWA"
4. Upload APK (Content → APK)
5. Add screenshots, privacy policy
6. Submit for review ✅

### **Option B: Wrap PWA as iOS App (App Store)**

#### **Step 1: Add iOS Platform**

```bash
npx cap add ios
```

#### **Step 2: Build for iOS**

```bash
cd ios
open DigitalEmpire.xcworkspace
# In Xcode: Product → Archive → Distribute App
```

#### **Step 3: Create App Store Listing**

1. Go to **App Store Connect**: https://appstoreconnect.apple.com
2. Create new app
3. Fill in details
4. Upload IPA file
5. Submit for review ✅

### **Option C: Use EAS (Expo Application Services)**

If using React Native:

```bash
npm install -g eas-cli
eas build --platform android --type apk
eas build --platform ios --type simulator
eas submit --platform android
eas submit --platform ios
```

---

## **Summary: Full Deployment Stack**

```
┌─────────────────────────────────────────┐
│  GitHub (Your Code Repository)          │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
┌──────────────┐   ┌─────────────────┐
│ GitHub       │   │ GitHub Actions  │
│ Pages        │   │ CI/CD Pipeline  │
│ (Frontend)   │   │ (Auto Deploy)   │
└──────────────┘   └────────┬────────┘
                             │
                    ┌────────┴──────────┐
                    ↓                   ↓
            ┌──────────────┐   ┌─────────────────┐
            │ Railway      │   │ Docker Hub      │
            │ (Backend)    │   │ (Container)     │
            └──────────────┘   └────────┬────────┘
                                        │
                    ┌───────────────────┴──────────────────┐
                    ↓                    ↓                ↓
            ┌──────────────┐   ┌────────────────┐  ┌──────────┐
            │ AWS ECS      │   │ DigitalOcean   │  │ Render   │
            │ Production   │   │ App Platform   │  │ Simple   │
            └──────────────┘   └────────────────┘  └──────────┘
                    │
        ┌───────────┴───────────┐
        ↓                       ↓
    ┌────────┐           ┌──────────┐
    │ Android│           │ iOS      │
    │App     │           │App Store │
    │Store   │           │          │
    └────────┘           └──────────┘
```

---

## **Quick Reference: Commands by Platform**

### **GitHub Pages (Frontend)**
```bash
git push origin main
# → Auto-deploys to https://amaechiu-del.github.io/DIGITAL-EMPIRE/
```

### **Railway (Backend)**
```bash
# Auto-deploys on push
git push origin main
# → Check Railway dashboard
```

### **Docker (Local/Cloud)**
```bash
docker build -t digital-empire:latest .
docker run -p 3000:3000 digital-empire:latest
```

### **Play Store (Android)**
```bash
npx cap add android
./gradlew assembleRelease
# → Upload to Google Play Console
```

### **App Store (iOS)**
```bash
npx cap add ios
open ios/DigitalEmpire.xcworkspace
# → Archive & submit in Xcode
```

---

## **Next Steps**

1. ✅ Verify GitHub Actions workflow is active
2. 🚂 Create Railway account and deploy backend
3. 🐳 Test Docker locally
4. 📱 Build and test APK/IPA
5. 📤 Submit to Play Store/App Store

Need help with any of these? Let me know! 🎉
