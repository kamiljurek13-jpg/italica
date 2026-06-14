# Sandbox Branch

This branch (`sandbox`) exists exclusively to trigger and test **Vercel Preview Deployments**.

## Purpose

Every push to this branch generates a unique Vercel preview URL, allowing safe experimentation with UI changes, API integrations, and Vercel configuration without touching `main`.

## How it works

1. Push any change to this branch
2. Vercel automatically builds and deploys a preview
3. A unique URL is generated, e.g. `https://italica-git-sandbox-<team>.vercel.app`
4. Test freely — `main` is never affected

## What to test here

- Vercel Serverless Function behavior (`/api/*`)
- Environment variable configuration
- Build output and routing (`vercel.json`)
- New features before merging to `main`

## Notes

- This branch is **not** for production — never merge directly to `main` without review
- Preview deployments use the same environment variables configured in Vercel dashboard
- Each new push replaces the previous sandbox preview deployment
