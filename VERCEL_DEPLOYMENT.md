# 🚀 Vercel Deployment Guide

## Przegląd
Aplikacja używa Vercel Serverless Functions do bezpiecznego obsługiwania API Anthropic. Klucz API jest przechowywany bezpiecznie na backendzie, a nie w kodzie frontend.

## 📋 Przed Deploymentem

### 1. Przygotuj Konto Vercel
1. Przejdź na: https://vercel.com/
2. Zarejestruj się (możesz użyć GitHub)
3. Zainstaluj Vercel CLI (opcjonalnie):
```bash
npm install -g vercel
```

### 2. Przygotuj Klucze API
Upewnij się, że masz:
- ✅ Klucz Anthropic API (https://console.anthropic.com/)
- ✅ Klucz Amplitude API (https://analytics.amplitude.com/)

---

## 🎯 Deployment Krok po Kroku

### Opcja 1: Deploy przez GitHub (ZALECANE)

#### 1. Push do GitHub
```bash
git add .
git commit -m "Add Vercel serverless functions"
git push origin main
```

#### 2. Połącz z Vercel
1. Zaloguj się na https://vercel.com/
2. Kliknij "Add New Project"
3. Wybierz swoje repozytorium GitHub
4. Vercel automatycznie wykryje Vite

#### 3. Skonfiguruj Environment Variables
W Vercel dashboard:
1. Przejdź do: **Settings → Environment Variables**
2. Dodaj następujące zmienne:

```
ANTHROPIC_API_KEY = twoj_klucz_anthropic
VITE_AMPLITUDE_API_KEY = twoj_klucz_amplitude
```

**WAŻNE:** 
- `ANTHROPIC_API_KEY` (bez `VITE_`) - dla serverless function
- `VITE_AMPLITUDE_API_KEY` (z `VITE_`) - dla frontend

#### 4. Deploy
1. Kliknij "Deploy"
2. Poczekaj ~2 minuty
3. Gotowe! 🎉

---

### Opcja 2: Deploy przez CLI

#### 1. Zaloguj się
```bash
vercel login
```

#### 2. Deploy
```bash
vercel
```

#### 3. Dodaj Environment Variables
```bash
vercel env add ANTHROPIC_API_KEY
# Wklej swój klucz

vercel env add VITE_AMPLITUDE_API_KEY
# Wklej swój klucz
```

#### 4. Redeploy z nowymi zmiennymi
```bash
vercel --prod
```

---

## 🔧 Konfiguracja

### vercel.json
Plik `vercel.json` jest już skonfigurowany:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### Struktura Projektu
```
italica/
├── api/
│   └── recommendations.ts    # Serverless function
├── src/
│   ├── lib/
│   │   └── anthropic.ts      # Frontend (wywołuje /api/recommendations)
│   └── components/
│       └── GiftHelper.tsx    # Używa anthropic.ts
├── vercel.json               # Konfiguracja Vercel
└── package.json
```

---

## 🧪 Testowanie

### Lokalnie (Development)
```bash
npm run dev
```

**Uwaga:** Lokalnie endpoint `/api/recommendations` nie będzie działał bez Vercel CLI.

### Z Vercel CLI (Lokalne testowanie serverless)
```bash
vercel dev
```
To uruchomi lokalny serwer z działającymi serverless functions!

### Po Deploymencie
1. Otwórz swoją aplikację na Vercel URL
2. Kliknij Gift Helper
3. Wybierz mood (Sleepy/Sexy/Daily)
4. Sprawdź czy rekomendacje działają

---

## 🔍 Debugging

### Sprawdź Logi Vercel
1. Przejdź do Vercel Dashboard
2. Wybierz swój projekt
3. Zakładka "Deployments"
4. Kliknij na deployment
5. Zakładka "Functions" → Zobacz logi

### Sprawdź Environment Variables
```bash
vercel env ls
```

### Testuj Endpoint Bezpośrednio
```bash
curl -X POST https://twoja-domena.vercel.app/api/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "sexy",
    "products": [...]
  }'
```

---

## 🛡️ Bezpieczeństwo

### ✅ Co jest BEZPIECZNE:
- Klucz Anthropic API na backendzie (serverless function)
- Klucz Amplitude w frontend (write-only, publiczny)
- Rate limiting (10 requestów/godzinę na IP)
- CORS skonfigurowany
- Walidacja inputów

### 🔒 Dodatkowe Zabezpieczenia:

#### 1. Rate Limiting
Już zaimplementowane w `api/recommendations.ts`:
- 10 requestów/godzinę na IP
- Automatyczny reset co godzinę

#### 2. Monitoring
W Vercel Dashboard możesz monitorować:
- Liczbę requestów
- Czas wykonania
- Błędy
- Koszty

#### 3. Alerty
Ustaw alerty w Vercel:
1. Settings → Notifications
2. Dodaj alerty dla:
   - Wysokiego użycia
   - Błędów 5xx
   - Długiego czasu wykonania

---

## 💰 Koszty

### Vercel (Hobby Plan - DARMOWY)
- ✅ 100 GB bandwidth/miesiąc
- ✅ Unlimited serverless function invocations
- ✅ 100 GB-hours serverless execution
- ✅ Wystarczy dla małych/średnich projektów

### Anthropic API
- Claude 3 Haiku: ~$0.25 / 1M input tokens
- ~$1.25 / 1M output tokens
- Przykład: 1000 requestów ≈ $0.50-1.00

### Amplitude (Free Plan)
- ✅ 10M eventów/miesiąc
- ✅ Wystarczy dla większości projektów

---

## 🔄 Continuous Deployment

### Automatyczny Deploy
Po połączeniu z GitHub, każdy push do `main` automatycznie:
1. Buduje aplikację
2. Uruchamia testy (jeśli są)
3. Deployuje na Vercel
4. Generuje preview URL

### Preview Deployments
Każdy Pull Request dostaje własny preview URL:
```
https://italica-git-feature-xyz.vercel.app
```

---

## 📊 Monitoring i Analytics

### 1. Vercel Analytics
Dodaj do projektu:
```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

// W komponencie App
<Analytics />
```

### 2. Sprawdź Użycie API
Dashboard Anthropic:
- https://console.anthropic.com/
- Zakładka "Usage"

Dashboard Amplitude:
- https://analytics.amplitude.com/
- Zobacz eventy Gift Helper

---

## 🐛 Troubleshooting

### Problem: "API configuration error"
**Rozwiązanie:** Sprawdź czy `ANTHROPIC_API_KEY` jest ustawiony w Vercel:
```bash
vercel env ls
```

### Problem: CORS errors
**Rozwiązanie:** Sprawdź czy `vercel.json` ma poprawne rewrites:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### Problem: "Too many requests"
**Rozwiązanie:** Rate limit (10/h) został przekroczony. Poczekaj godzinę lub zwiększ limit w `api/recommendations.ts`.

### Problem: Funkcja nie działa lokalnie
**Rozwiązanie:** Użyj `vercel dev` zamiast `npm run dev`:
```bash
vercel dev
```

---

## 🎓 Najlepsze Praktyki

### 1. Environment Variables
- ✅ Używaj różnych kluczy dla dev/prod
- ✅ Nigdy nie commituj `.env` do Git
- ✅ Dokumentuj wszystkie zmienne w `.env.example`

### 2. Monitoring
- ✅ Regularnie sprawdzaj logi Vercel
- ✅ Monitoruj koszty Anthropic API
- ✅ Ustaw alerty dla nietypowej aktywności

### 3. Testing
- ✅ Testuj lokalnie z `vercel dev`
- ✅ Używaj preview deployments dla PR
- ✅ Testuj produkcję po każdym deploymencie

### 4. Security
- ✅ Regularnie rotuj klucze API
- ✅ Monitoruj rate limiting
- ✅ Sprawdzaj logi pod kątem podejrzanej aktywności

---

## 📚 Dodatkowe Zasoby

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

## 🎯 Checklist Przed Deploymentem

- [ ] Kod commitowany do GitHub
- [ ] `.env` w `.gitignore`
- [ ] `vercel.json` skonfigurowany
- [ ] Klucze API gotowe (Anthropic, Amplitude)
- [ ] Projekt połączony z Vercel
- [ ] Environment variables ustawione w Vercel
- [ ] Pierwszy deployment wykonany
- [ ] Testowanie na produkcji
- [ ] Monitoring skonfigurowany

---

## 🚀 Quick Start

```bash
# 1. Push do GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Połącz z Vercel (przez dashboard)
# https://vercel.com/new

# 3. Dodaj environment variables w Vercel dashboard
# ANTHROPIC_API_KEY
# VITE_AMPLITUDE_API_KEY

# 4. Deploy!
# Automatycznie po połączeniu z GitHub

# 5. Gotowe! 🎉
```

---

## 💡 Pro Tips

1. **Preview Deployments**: Każdy PR dostaje własny URL do testowania
2. **Instant Rollback**: Możesz wrócić do poprzedniej wersji jednym klikiem
3. **Custom Domains**: Dodaj własną domenę w Settings → Domains
4. **Edge Functions**: Dla jeszcze szybszego działania (opcjonalnie)
5. **Analytics**: Dodaj Vercel Analytics dla szczegółowych statystyk

---

Powodzenia z deploymentem! 🚀
