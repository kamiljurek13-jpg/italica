# Pexels Integration - Dokumentacja

## Przegląd
Integracja z Pexels API pozwala na automatyczne pobieranie wysokiej jakości zdjęć produktów na podstawie nastroju (mood) i kategorii. System jest zoptymalizowany pod kątem limitów API i zapewnia spójność wizualną z brandingiem.

## 🎨 Strategia Wizualna

### Nastroje i Słowa Kluczowe

#### **Sleepy** 🌙
Miękkie światło, satyna, delikatność
- `luxury silk pajamas`
- `soft satin fabric`
- `elegant nightwear`
- `minimalist jewelry soft light`
- `delicate gold jewelry natural light`

**Charakterystyka:**
- Jasne, naturalne światło
- Pastelowe i neutralne kolory
- Miękkie tekstury
- Spokojne kompozycje

#### **Sexy** 🔥
Dramatyzm, czerń, koronki, cienie
- `luxury black lingerie`
- `elegant lace underwear`
- `dramatic jewelry shadows`
- `bold gold jewelry black background`
- `statement jewelry dramatic lighting`

**Charakterystyka:**
- Ciemne tła
- Kontrastowe oświetlenie
- Odważne kompozycje
- Luksusowe materiały

#### **Daily** ☕
Minimalizm, jasność, wszechstronność
- `minimalist jewelry white background`
- `elegant everyday jewelry`
- `simple gold jewelry natural light`
- `modern jewelry clean background`
- `versatile jewelry bright light`

**Charakterystyka:**
- Czyste, białe tła
- Równomierne oświetlenie
- Proste kompozycje
- Uniwersalne ujęcia

## 📁 Struktura Plików

```
src/
├── lib/
│   └── pexels.ts              # Funkcje pomocnicze API
├── data/
│   └── products.json          # Produkty z URL-ami zdjęć
scripts/
└── updateProductImages.ts     # Skrypt do aktualizacji zdjęć
```

## 🚀 Jak Używać

### 1. Uzyskaj Klucz API

1. Przejdź na: https://www.pexels.com/api/
2. Zarejestruj się (darmowe konto)
3. Wygeneruj klucz API
4. Dodaj do `.env`:

```env
VITE_PEXELS_API_KEY=twoj_prawdziwy_klucz_api
```

### 2. Uruchom Skrypt Aktualizacji

```bash
npx tsx scripts/updateProductImages.ts
```

**Co robi skrypt:**
- Czyta `src/data/products.json`
- Dla każdego produktu:
  - Pobiera główny mood (pierwszy w tablicy)
  - Wyszukuje odpowiednie zdjęcie na Pexels
  - Aktualizuje pole `image` z nowym URL
- Zapisuje zaktualizowany plik
- Dodaje opóźnienia między requestami (300ms)

### 3. Sprawdź Wyniki

Po uruchomieniu skryptu, `products.json` będzie zawierał nowe URL-e:

```json
{
  "id": "1",
  "name": "Eclipse Ring",
  "image": "https://images.pexels.com/photos/123456/...",
  "mood": ["sexy", "daily"]
}
```

## 🔧 Funkcje API

### `fetchPexelsImage(mood, category, index)`

Pobiera pojedyncze zdjęcie z Pexels.

**Parametry:**
- `mood`: string - 'sleepy', 'sexy', lub 'daily'
- `category`: string - 'rings', 'earrings', 'bracelets', 'necklaces'
- `index`: number - indeks do rotacji słów kluczowych

**Zwraca:** `Promise<string | null>` - URL zdjęcia lub null

**Przykład:**
```typescript
const imageUrl = await fetchPexelsImage('sexy', 'rings', 0);
```

### `fetchImagesForProducts(products)`

Pobiera zdjęcia dla wielu produktów naraz.

**Parametry:**
- `products`: Array - tablica produktów z polami `id`, `mood`, `category`

**Zwraca:** `Promise<Record<string, string>>` - mapa ID → URL

**Przykład:**
```typescript
const imageMap = await fetchImagesForProducts(products);
console.log(imageMap['1']); // URL dla produktu o ID 1
```

## 📊 Limity API

**Darmowy plan Pexels:**
- 200 requestów/godzinę
- Bez limitu miesięcznego
- Wymagana atrybucja (opcjonalna w UI)

**Optymalizacja w kodzie:**
- Opóźnienie 300ms między requestami
- Cache w `products.json` (nie pobiera przy każdym ładowaniu)
- Fallback do oryginalnych zdjęć przy błędzie

## 🎯 Najlepsze Praktyki

### 1. Ręczna Kuracja (Zalecane)
Dla najlepszych rezultatów, wybierz zdjęcia ręcznie:

```typescript
import { getCuratedSearchQueries } from '@/lib/pexels';

const queries = getCuratedSearchQueries();
// Otwórz linki i wybierz najlepsze zdjęcia
```

### 2. Testowanie Słów Kluczowych
Przed uruchomieniem skryptu, przetestuj słowa kluczowe:

```bash
# Otwórz w przeglądarce:
https://www.pexels.com/search/luxury%20black%20lingerie/
```

### 3. Backup Danych
Przed uruchomieniem skryptu:

```bash
cp src/data/products.json src/data/products.backup.json
```

### 4. Orientacja Zdjęć
Skrypt automatycznie wybiera orientację pionową (`portrait`), idealną dla e-commerce.

## 🔄 Aktualizacja Zdjęć

### Automatyczna (Skrypt)
```bash
npx tsx scripts/updateProductImages.ts
```

### Ręczna (Pojedyncze Produkty)
1. Znajdź zdjęcie na Pexels
2. Skopiuj URL (format: `https://images.pexels.com/photos/...`)
3. Zaktualizuj `products.json`:

```json
{
  "id": "1",
  "image": "https://images.pexels.com/photos/123456/pexels-photo-123456.jpeg"
}
```

### Dynamiczna (W Komponencie)
```typescript
import { fetchPexelsImage } from '@/lib/pexels';

const [imageUrl, setImageUrl] = useState(product.image);

useEffect(() => {
  if (!imageUrl.includes('pexels.com')) {
    fetchPexelsImage(product.mood[0], product.category, 0)
      .then(url => url && setImageUrl(url));
  }
}, []);
```

## 🐛 Troubleshooting

### Błąd: "VITE_PEXELS_API_KEY not found"
**Rozwiązanie:** Dodaj klucz do `.env` i zrestartuj serwer dev

### Błąd: "Pexels API error: 401"
**Rozwiązanie:** Sprawdź czy klucz API jest poprawny

### Błąd: "Pexels API error: 429"
**Rozwiązanie:** Przekroczono limit requestów, poczekaj godzinę

### Brak zdjęć dla niektórych produktów
**Rozwiązanie:** 
- Zmień słowa kluczowe w `pexels.ts`
- Użyj ręcznej kuracji
- Sprawdź czy kategoria jest poprawna

### Zdjęcia nie pasują do produktów
**Rozwiązanie:**
- Dostosuj słowa kluczowe w `moodKeywords`
- Użyj bardziej specyficznych zapytań
- Rozważ ręczny wybór zdjęć

## 📝 Przykładowy Output Skryptu

```
🚀 Starting Pexels image update...

📦 Found 12 products

[1/12] Eclipse Ring (sexy - rings)
  🔍 Searching: "luxury black lingerie ring"
  ✅ Found image (ID: 789456)
  💾 Updated image URL

[2/12] Halo Earrings (sexy - earrings)
  🔍 Searching: "elegant lace underwear earrings"
  ✅ Found image (ID: 123789)
  💾 Updated image URL

...

✨ Products updated successfully!
📁 File saved: /workspaces/italica/src/data/products.json
```

## 🎨 Customizacja

### Dodaj Nowy Mood

1. Zaktualizuj `moodKeywords` w `pexels.ts`:
```typescript
const moodKeywords = {
  sleepy: [...],
  sexy: [...],
  daily: [...],
  romantic: [  // NOWY
    'romantic jewelry soft pink',
    'delicate rose gold jewelry',
    'elegant pearl jewelry',
  ],
};
```

2. Dodaj mood do produktów w `products.json`

### Zmień Kategorię

1. Zaktualizuj `categoryKeywords` w `pexels.ts`:
```typescript
const categoryKeywords = {
  rings: 'ring',
  earrings: 'earrings',
  bracelets: 'bracelet',
  necklaces: 'necklace',
  watches: 'watch',  // NOWY
};
```

### Dostosuj Orientację

W `fetchPexelsImage()` zmień parametr `orientation`:
```typescript
orientation=portrait  // pionowo (domyślne)
orientation=landscape // poziomo
orientation=square    // kwadrat
```

## 🔐 Bezpieczeństwo

- ✅ Klucz API w `.env` (nie commituj!)
- ✅ `.env` w `.gitignore`
- ✅ `.env.example` dla zespołu
- ✅ Używaj `import.meta.env` w frontend
- ✅ Używaj `process.env` w skryptach Node.js

## 📚 Dodatkowe Zasoby

- [Pexels API Docs](https://www.pexels.com/api/documentation/)
- [Pexels License](https://www.pexels.com/license/)
- [Best Practices](https://www.pexels.com/api/documentation/#guidelines)

## 🚀 Następne Kroki

1. ✅ Uzyskaj prawdziwy klucz API z Pexels
2. ✅ Uruchom skrypt: `npx tsx scripts/updateProductImages.ts`
3. ✅ Sprawdź wyniki w przeglądarce
4. ✅ Dostosuj słowa kluczowe jeśli potrzeba
5. ✅ Rozważ ręczną kurację dla kluczowych produktów
