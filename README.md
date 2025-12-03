<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mole8436-art/youtube)

### Manual Deployment Steps:

1. **Push to GitHub** (already done)
2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `mole8436-art/youtube`
3. **Set Environment Variable:**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `GEMINI_API_KEY` = `your_actual_gemini_api_key`
4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Important:
⚠️ **You MUST add your Gemini API key as an environment variable in Vercel settings, or the app will not work!**

Get your API key: https://aistudio.google.com/apikey
