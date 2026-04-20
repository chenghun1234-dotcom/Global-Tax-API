# Global Tax API - Monetization & Deployment Guide

This repository contains the logic for a distributed global tax compliance engine, optimized for RapidAPI distribution.

## 🚀 RapidAPI Deployment (Phase 2)

### 1. Cloudflare Worker Deployment
The backend is located in `/tax-worker`. We have provided a GitHub Action for automated deployment.

**Setup Instructions:**
1.  Go to your GitHub repository **Settings > Secrets and variables > Actions**.
2.  Add the following secrets:
    - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API Token (Edit Workers permission).
    - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
3.  Push to the `main` branch to trigger the deployment.

### 2. RapidAPI Registration
1.  Import the `public/openapi.json` file into the RapidAPI Provider Dashboard.
2.  Your pricing tiers are pre-configured in the `info.description` field.

---

## 📦 Global Tax SDKs

We provide lightweight SDKs for seamless integration.

### JavaScript (Web/Node.js)
```javascript
import GTaxClient from './sdk/js/gtax.js';

const gtax = new GTaxClient('YOUR_API_KEY');
const rate = await gtax.lookupRate('US', 'NY');
console.log(`NY Rate: ${rate.data.rate}`);
```

### Dart (Flutter)
```dart
import 'sdk/dart/gtax.dart';

final gtax = GTaxClient(apiKey: 'YOUR_API_KEY');
final result = await gtax.calculate(
  buyerLoc: 'JP',
  amount: 25000.0,
);
print('Tax Amount: ${result.taxAmount}');
```

---

## 💰 Monetization Strategy
- **Free**: 10 calls/mo (Lead generation)
- **Pro**: 1,000 calls/mo ($19/mo) (Indie Hackers)
- **Ultra**: 100,000 calls/mo ($99/mo) (B2B SaaS)

---
*Created with ❤️ by Antigravity AI*
