# LOOKSMAXXKING: Organism Master Keys

This document contains the critical credentials and endpoints for the autonomous Super-Organism.

## 1. Organism API (Real-Time Oversight)

- **Endpoint**: `https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net/getOrganismStats`
- **Personal Secret Key**: `LOOKS_KNG_99_SECURE`
- **Usage**: Use this key in the `x-organism-secret` header to pull live data into external dashboards.

## 2. Environment Dependencies

| Service | Purpose | Key Location |
| :--- | :--- | :--- |
| **Firebase** | Database & Hosting | `C:\Users\thats\.gemini\antigravity\scratch\looksmaxxking\services\firebase.ts` |
| **Gemini AI** | The "Soul" / Logic | `C:\Users\thats\.gemini\antigravity\scratch\looksmaxxking\services\geminiService.ts` |
| **Stripe** | Monetization | Firebase Env: `STRIPE_SECRET_KEY` |
| **Remotion** | Viral Video Factory | `C:\Users\thats\.gemini\antigravity\scratch\looksmaxxking\videoFactory` |

## 3. Autonomous Heartbeat

- Driven by **GitHub Actions** in the `.github/workflows/heartbeat.yml` file.
- Current Frequency: Every 30 minutes.

## 4. Maintenance Folders

- **Videos**: `videoFactory/out/` (Rendered viral content)
- **Logs**: Firestore `meta_heartbeats` collection.
- **Outreach**: Firestore `outreach_tasks` collection.

---
> [!IMPORTANT]
> Keep this folder secure. It contains the instructions to control or shut down the organism if necessary.
