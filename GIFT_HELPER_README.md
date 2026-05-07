# Gift Helper Feature

## Overview
The Gift Helper is an AI-powered recommendation system that helps customers find the perfect jewelry pieces based on their mood. It uses Claude AI (Anthropic's Haiku model) to provide personalized product recommendations and tracks user interactions with Amplitude analytics.

## Features

### 🎁 Three Mood Options
- **Sleepy** 🌙 - Soft, comfortable pieces for relaxation
- **Sexy** 🔥 - Bold, statement pieces that turn heads
- **Daily** ☕ - Versatile pieces for everyday elegance

### 🤖 AI-Powered Recommendations
- Uses Claude 3 Haiku model from Anthropic
- Analyzes product catalog based on mood tags
- Returns 3-4 curated product recommendations
- Fallback mechanism if API fails

### 📊 Analytics Tracking
- Tracks mood button clicks
- Tracks recommendation generation
- Monitors user engagement patterns
- Powered by Amplitude

## Setup Instructions

### 1. Install Dependencies
Dependencies are already installed:
- `@anthropic-ai/sdk` - For Claude AI integration
- `@amplitude/analytics-browser` - For analytics tracking

### 2. Configure Environment Variables
Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then add your API keys:

```env
# Anthropic API Key
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...

# Amplitude API Key
VITE_AMPLITUDE_API_KEY=...
```

#### Getting API Keys:

**Anthropic API Key:**
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env`

**Amplitude API Key:**
1. Go to https://analytics.amplitude.com/
2. Sign up or log in
3. Create a new project or select existing
4. Go to Settings → Projects
5. Copy the API Key
6. Paste into `.env`

### 3. Run the Application

```bash
npm run dev
```

The Gift Helper will appear on the homepage between the Product Carousel and Large Hero sections.

## File Structure

```
src/
├── components/
│   └── GiftHelper.tsx          # Main Gift Helper component
├── lib/
│   ├── amplitude.ts            # Amplitude analytics utilities
│   └── anthropic.ts            # Anthropic AI integration
├── data/
│   └── products.json           # Product catalog with mood tags
└── pages/
    └── Index.tsx               # Homepage (includes GiftHelper)
```

## How It Works

1. **User Interaction**: User clicks on one of three mood buttons (Sleepy, Sexy, Daily)
2. **Analytics Tracking**: Click event is sent to Amplitude
3. **AI Processing**: Request is sent to Claude AI with:
   - Selected mood
   - Filtered product list (products matching the mood)
   - Prompt asking for top 3-4 recommendations
4. **Response Parsing**: AI response is parsed to extract product IDs
5. **Display Results**: Recommended products are displayed with images, descriptions, and prices
6. **Analytics Tracking**: Recommendation event is sent to Amplitude with product details

## Product Data Structure

Products in `src/data/products.json` include:

```json
{
  "id": "1",
  "name": "Eclipse Ring",
  "category": "rings",
  "price": 2800,
  "description": "A stunning ring...",
  "image": "/public/rings-collection.png",
  "mood": ["sexy", "daily"]
}
```

The `mood` array determines which moods the product is eligible for.

## Analytics Events

### Event: "Gift Helper Mood Selected"
Tracked when user clicks a mood button.

Properties:
- `mood`: string (sleepy/sexy/daily)
- `timestamp`: ISO timestamp

### Event: "Gift Helper Recommendation Generated"
Tracked when recommendations are successfully generated.

Properties:
- `mood`: string (sleepy/sexy/daily)
- `productCount`: number
- `productIds`: array of product IDs
- `timestamp`: ISO timestamp

## Customization

### Adding New Moods
1. Update `moodConfig` in `src/components/GiftHelper.tsx`
2. Add mood tags to products in `src/data/products.json`
3. Update the `Mood` type definition

### Changing AI Model
Edit `src/lib/anthropic.ts` and change the model:

```typescript
model: 'claude-3-haiku-20240307', // Change to another model
```

Available models:
- `claude-3-haiku-20240307` (fastest, cheapest)
- `claude-3-sonnet-20240229` (balanced)
- `claude-3-opus-20240229` (most capable)

### Modifying Product Count
In `src/lib/anthropic.ts`, adjust the prompt or fallback logic to return more/fewer products.

## Security Notes

⚠️ **Important**: The current implementation uses `dangerouslyAllowBrowser: true` for the Anthropic client. This is suitable for development but **NOT recommended for production**.

**For Production:**
1. Create a backend API endpoint
2. Move Anthropic API calls to the backend
3. Frontend calls your backend, which then calls Anthropic
4. This keeps your API key secure

## Troubleshooting

### API Key Issues
- Ensure `.env` file is in the root directory
- Verify environment variables start with `VITE_`
- Restart dev server after adding environment variables

### No Recommendations Showing
- Check browser console for errors
- Verify API keys are valid
- Check network tab for API call failures
- Fallback should still show mood-filtered products

### Analytics Not Tracking
- Verify Amplitude API key is correct
- Check browser console for Amplitude errors
- Events may take a few minutes to appear in Amplitude dashboard

## Future Enhancements

- Add more mood options
- Include price range filtering
- Add user preferences/history
- Implement A/B testing for different prompts
- Add product detail page integration
- Create backend proxy for API security
