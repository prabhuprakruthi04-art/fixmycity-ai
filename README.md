# FixMyCity AI

> Existing apps let you report a problem. FixMyCity AI makes sure it gets fixed.

Built for **CodeRED: Orion**.

**Live demo:** https://fixmycity-ai-667792102190.us-west1.run.app

## Quick tour for judges
1. Open the live demo and click **Continue as Guest**.
2. Click **Demo Mode** to load sample reports.
3. Open **Track Reports** and use the **+3 Days** button to trigger auto-escalation.
4. Click **Verify fix** to see the before/after AI check.
5. Open **City Dashboard** for the live incident map.
6. Or try **Report Issue** with your own photo of garbage, foam or pollution.

## The problem
Citizens who report garbage dumping, burning waste, polluted lakes or sewage overflows run into the same issues in existing civic apps (such as Swachhata and FixMyStreet):
- Reports have to be typed in by hand, in English, with manual forms.
- Nobody follows up when the authority ignores a complaint.
- Complaints get marked "resolved" even when nothing was fixed.

## What FixMyCity AI does
1. **Snap a photo** of an environmental hazard.
2. **Gemini analyses it** and identifies the problem, severity, environmental impact and the responsible authority.
3. **A formal complaint is written automatically**, with a deadline, in English or Hindi.
4. **Auto-escalation:** if the deadline passes, a firmer letter is drafted to a higher authority.
5. **Fix verification:** upload an "after" photo and the AI compares it with the original to detect fake fixes.
6. **City dashboard and live incident map** show Active, Escalated and Resolved reports by area.
7. **Voice:** results and letters can be read aloud using ElevenLabs, with a browser-voice fallback.

## What the statuses mean
- **Active:** reported, and the authority still has time to act.
- **Escalated:** the deadline passed without action, so a firmer letter goes to a higher authority.
- **Resolved:** fixed, and confirmed with an "after" photo.
- **Fake Fix:** marked resolved by the authority, but the photo shows the problem is still there.

## Tech stack
- Google AI Studio and the Gemini API: photo analysis, complaint writing, before/after verification
- ElevenLabs (`eleven_multilingual_v2`): text-to-speech
- React, TypeScript, Vite, Tailwind CSS
- Firebase (Firestore)
- Leaflet: incident map

## How this was built
I designed the concept, the features and the demo flow, and I tested and refined the result. The app code was generated and iterated with Google AI Studio (Gemini) using my own prompts.

## Notes
- The dashboard, map and Demo Mode use **sample data** to show how the app looks with real reports. No real complaints are sent to any government system.
- Demo photos are sample images sourced from the web, used only for illustration in this non-commercial hackathon project. All rights belong to the original photographers or owners, and I will remove any image on request.
- The ElevenLabs API key is entered by the user in Voice Settings and is never stored in the code. Without a key, the app uses the browser's built-in voice.

## Run locally
```bash
npm install
npm run dev
```
Set `GEMINI_API_KEY` in a `.env` file (see `.env.example`).

## Future plans
- Partner with municipalities for real complaint submission and status updates
- Offline photo capture and more Indian languages
- Public accountability scores by ward
