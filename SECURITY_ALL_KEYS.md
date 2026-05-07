# 🔐 Analiza Bezpieczeństwa Wszystkich Kluczy API

## 📊 Podsumowanie

| API | Używany w Frontend? | Bezpieczeństwo | Status | Priorytet |
|-----|-------------------|----------------|--------|-----------|
| **Pexels** | ❌ NIE (tylko skrypt) | ✅ BEZPIECZNE | OK | - |
| **Amplitude** | ✅ TAK | ✅ BEZPIECZNE | OK | - |
| **Anthropic** | ✅ TAK | ⚠️ NIEBEZPIECZNE | WYMAGA NAPRAWY | 🔴 WYSOKI |

---

## 1. 🟢 Pexels API - BEZPIECZNE ✅

### Gdzie używany:
- ❌ **NIE** w frontend
- ✅ Tylko w skrypcie `scripts/updateProductImages.ts`

### Jak działa:
```
Skrypt lokalny → Pexels API → Zapisuje URL-e → Frontend używa URL-i
```

### Bezpieczeństwo:
- ✅ Klucz w `.env` (ignorowany przez Git)
- ✅ Używany tylko lokalnie
- ✅ Frontend nie ma dostępu do klucza
- ✅ Zdjęcia z publicznego CDN

### Ryzyko: **BRAK** 🟢

---

## 2. 🟢 Amplitude API - BEZPIECZNE ✅

### Gdzie używany:
- ✅ W frontend (`src/lib/amplitude.ts`)
- ✅ W komponencie `GiftHelper.tsx`
- ✅ Inicjalizowany w `main.tsx`

### Kod:
```typescript
// src/lib/amplitude.ts
const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY;
amplitude.init(apiKey, ...);
```

### Dlaczego to BEZPIECZNE:

#### 1. **Amplitude klucz jest publiczny (write-only)**
- Przeznaczony do użycia w frontend
- Pozwala tylko **wysyłać** eventy
- **NIE POZWALA** czytać danych
- Nie daje dostępu do dashboard

#### 2. **Oficjalna dokumentacja Amplitude:**
> "Your API key is safe to use in client-side code. It only allows sending events, not reading data."

#### 3. **Standardowa praktyka:**
- Google Analytics - klucz w frontend ✅
- Mixpanel - klucz w frontend ✅
- Amplitude - klucz w frontend ✅

### Co może zrobić ktoś z Twoim kluczem Amplitude:
- ✅ Wysłać eventy do Twojego projektu (spam)
- ❌ **NIE MOŻE** czytać danych
- ❌ **NIE MOŻE** usuwać danych
- ❌ **NIE MOŻE** zmieniać ustawień

### Ochrona przed spamem:
1. Filtrowanie w Amplitude dashboard
2. Rate limiting po stronie Amplitude
3. Monitoring nietypowej aktywności
4. Możliwość zresetowania klucza

### Ryzyko: **MINIMALNE** 🟢
- Potencjalny spam eventów (łatwo filtrować)
- Brak dostępu do wrażliwych danych

---

## 3. 🔴 Anthropic API - NIEBEZPIECZNE ⚠️

### Gdzie używany:
- ✅ W frontend (`src/lib/anthropic.ts`)
- ✅ W komponencie `GiftHelper.tsx`

### Kod:
```typescript
// src/lib/anthropic.ts
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

return new Anthropic({
  apiKey,
  dangerouslyAllowBrowser: true, // ⚠️ NIEBEZPIECZNE!
});
```

### Dlaczego to NIEBEZPIECZNE:

#### 1. **Klucz widoczny w bundlu JavaScript**
```bash
# Każdy może zobaczyć klucz:
1. Otwórz DevTools (F12)
2. Zakładka "Sources" lub "Network"
3. Znajdź bundle.js
4. Szukaj "VITE_ANTHROPIC_API_KEY"
```

#### 2. **Pełny dostęp do API**
Ktoś z Twoim kluczem może:
- ❌ Wysyłać nieograniczone requesty
- ❌ Zużywać Twoje kredyty ($$$)
- ❌ Czytać historię requestów
- ❌ Potencjalnie dostać się do konta

#### 3. **Ostrzeżenie w kodzie**
```typescript
dangerouslyAllowBrowser: true, // ⚠️ Nazwa mówi sama za siebie!
```

### Ryzyko: **WYSOKIE** 🔴
- Kradzież kluczy API
- Zużycie kredytów
- Potencjalne koszty finansowe

---

## 🛠️ ROZWIĄZANIA

### ❌ Obecna sytuacja (NIEBEZPIECZNA):
```
Frontend → Anthropic API (z kluczem w JS)
```

### ✅ Rozwiązanie 1: Backend Proxy (ZALECANE)

#### Architektura:
```
Frontend → Twój Backend → Anthropic API
```

#### Implementacja:

**Backend (Node.js/Express):**
```javascript
// server.js
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Bezpieczne!
});

app.post('/api/recommendations', async (req, res) => {
  const { mood, products } = req.body;
  
  // Walidacja
  if (!['sleepy', 'sexy', 'daily'].includes(mood)) {
    return res.status(400).json({ error: 'Invalid mood' });
  }
  
  // Rate limiting
  // Authentication (opcjonalnie)
  
  const result = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    // ... prompt
  });
  
  res.json(result);
});

app.listen(3001);
```

**Frontend:**
```typescript
// src/lib/anthropic.ts
export const getProductRecommendations = async (
  mood: string,
  products: Product[]
): Promise<Product[]> => {
  // Wywołanie własnego backendu zamiast Anthropic
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, products }),
  });
  
  return response.json();
};
```

#### Zalety:
- ✅ Klucz API bezpieczny na backendzie
- ✅ Rate limiting
- ✅ Monitoring i logi
- ✅ Możliwość dodania autentykacji
- ✅ Kontrola kosztów

---

### ✅ Rozwiązanie 2: Serverless Functions

#### Vercel/Netlify Functions:
```typescript
// api/recommendations.ts
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY, // Bezpieczne!
  });
  
  // ... logika
}
```

#### Zalety:
- ✅ Brak potrzeby zarządzania serwerem
- ✅ Automatyczne skalowanie
- ✅ Klucz bezpieczny w zmiennych środowiskowych

---

### ✅ Rozwiązanie 3: Tymczasowe (Development Only)

Jeśli to tylko MVP/demo:

```typescript
// src/lib/anthropic.ts
export const getProductRecommendations = async (
  mood: string,
  products: Product[]
): Promise<Product[]> => {
  // Sprawdź czy jesteśmy w development
  if (import.meta.env.MODE !== 'development') {
    console.warn('Anthropic API disabled in production');
    // Fallback do prostego filtrowania
    return products
      .filter(p => p.mood.includes(mood))
      .slice(0, 3);
  }
  
  // Tylko w development
  const client = getAnthropicClient();
  // ... reszta kodu
};
```

#### Zalety:
- ✅ Szybkie rozwiązanie dla MVP
- ✅ Działa lokalnie
- ⚠️ Wyłączone w production

---

## 📋 Plan Działania

### 🔴 PILNE (Anthropic):

1. **Natychmiast:**
   - [ ] Nie commituj prawdziwego klucza Anthropic do Git
   - [ ] Sprawdź czy klucz nie jest już w historii Git
   - [ ] Jeśli jest - zresetuj klucz na Anthropic dashboard

2. **Krótkoterminowo (MVP):**
   - [ ] Użyj Rozwiązania 3 (wyłącz w production)
   - [ ] Dodaj ostrzeżenie w UI
   - [ ] Monitoruj użycie API

3. **Długoterminowo (Production):**
   - [ ] Zaimplementuj backend proxy (Rozwiązanie 1)
   - [ ] Lub użyj serverless functions (Rozwiązanie 2)
   - [ ] Dodaj rate limiting
   - [ ] Dodaj monitoring kosztów

### 🟢 OK (Amplitude):
- ✅ Wszystko w porządku
- ✅ Standardowa implementacja
- ✅ Monitoruj dashboard dla spamu

### 🟢 OK (Pexels):
- ✅ Wszystko w porządku
- ✅ Bezpieczna implementacja
- ✅ Używaj lokalnie do aktualizacji

---

## 🔍 Jak Sprawdzić Czy Klucze Wyciekły

### 1. Historia Git:
```bash
# Sprawdź czy klucze są w historii
git log --all --full-history --source -- .env
git log -p | grep -i "anthropic\|amplitude\|pexels"
```

### 2. GitHub (jeśli już spushowałeś):
```bash
# Sprawdź remote
git log origin/main --oneline | head -20
```

### 3. Jeśli znalazłeś klucz w historii:
```bash
# NATYCHMIAST zresetuj klucze na:
# - https://console.anthropic.com/
# - https://analytics.amplitude.com/
# - https://www.pexels.com/api/

# Potem wyczyść historię (zaawansowane):
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 📚 Najlepsze Praktyki

### ✅ RÓB:
1. **Zawsze** trzymaj `.env` w `.gitignore`
2. **Używaj** backend proxy dla wrażliwych API
3. **Monitoruj** użycie i koszty API
4. **Rotuj** klucze regularnie
5. **Używaj** różnych kluczy dla dev/prod

### ❌ NIE RÓB:
1. **Nie** commituj `.env` do Git
2. **Nie** używaj `dangerouslyAllowBrowser: true` w production
3. **Nie** wklejaj kluczy bezpośrednio w kod
4. **Nie** udostępniaj kluczy publicznie
5. **Nie** używaj tych samych kluczy wszędzie

---

## 🎯 Podsumowanie

| API | Status | Akcja |
|-----|--------|-------|
| **Pexels** | 🟢 Bezpieczne | Brak akcji |
| **Amplitude** | 🟢 Bezpieczne | Brak akcji |
| **Anthropic** | 🔴 Niebezpieczne | **WYMAGA NAPRAWY** |

### Priorytet:
1. 🔴 **WYSOKI**: Zabezpiecz Anthropic API (backend proxy)
2. 🟡 **ŚREDNI**: Monitoruj Amplitude (spam)
3. 🟢 **NISKI**: Pexels OK

---

## 📞 Dodatkowe Zasoby

- [Anthropic API Security Best Practices](https://docs.anthropic.com/claude/reference/security)
- [Amplitude Security](https://www.docs.developers.amplitude.com/analytics/apis/authentication/)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [12 Factor App - Config](https://12factor.net/config)
