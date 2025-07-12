# =====================================================
# 📁 README.md - Project Documentation
# =====================================================

# Vocabulary Master v3.0

> La tua app intelligente per imparare l'inglese con Firebase

## 🚀 Caratteristiche

- **🔐 Autenticazione Firebase**: Login con email/password o Google
- **☁️ Sync Cloud**: Dati sincronizzati su Firestore
- **🤖 AI Integration**: Supporto Google Gemini per funzionalità avanzate
- **📱 Responsive**: Ottimizzato per desktop e mobile
- **⚡ TypeScript**: Tipizzazione completa per maggiore sicurezza
- **🎨 Modern UI**: Design moderno con Tailwind CSS

## 🏗️ Struttura Tipi

### Word (Parola)
```typescript
interface Word {
  id: string;
  english: string;
  italian: string;
  group: string;
  sentences: string[];        // 0 a n frasi
  synonyms?: string[];        // 0 a n sinonimi
  antonyms?: string[];        // 0 a n contrari
  notes?: string;
  chapter: string;
  learned: boolean;
  difficult: boolean;
  // ... altri campi di performance
}
```

### Test
```typescript
interface Test {
  id: string;
  timestamp: Date;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  totalTime: number;
  avgTimePerWord: number;
  percentage: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  hitsUsed: number;
  selectedChapters: string[];
  testType: 'complete' | 'selective' | 'review' | 'difficult';
  wrongWords: TestWordResult[];
  rightWords: TestWordResult[];
  // ... altri campi
}
```

### Stats
```typescript
interface Stats {
  totalTests: number;
  correctAnswers: number;
  incorrectAnswers: number;
  hintsUsed: number;
  accuracyRate: number;
  currentStreak: number;
  dailyProgress: Record<string, DailyProgress>;
  // ... altri campi statistici
}
```

## 🛠️ Setup

### 1. Clona e installa
```bash
git clone <repository>
cd vocabulary-master-v3
npm install
```

### 2. Configura environment
```bash
cp .env.example .env.local
# Modifica .env.local con le tue credenziali
```

### 3. Configura Firebase
1. Crea progetto su [Firebase Console](https://console.firebase.google.com)
2. Abilita Authentication (Email/Password + Google)
3. Abilita Firestore Database
4. Copia le credenziali nel file `.env.local`

### 4. Avvia l'app
```bash
npm run check-env  # Verifica configurazione
npm start          # Avvia in development
```

## 🔧 Scripts Disponibili

- `npm start` - Avvia development server
- `npm run build` - Build per production
- `npm run test` - Esegue i test
- `npm run lint` - Controllo ESLint
- `npm run format` - Formattazione Prettier
- `npm run check-env` - Verifica environment
- `npm run firebase:emulators` - Avvia emulatori Firebase

## 📁 Struttura Progetto

```
src/
├── components/           # Componenti React
│   ├── auth/            # Componenti autenticazione
│   ├── common/          # Componenti comuni
│   ├── layout/          # Layout e navigazione
│   ├── pages/           # Pagine principali
│   └── ui/              # Componenti UI base
├── contexts/            # Context providers
├── services/            # Servizi Firebase e API
├── types/               # Definizioni TypeScript
├── utils/               # Utility functions
├── config/              # Configurazioni
└── styles/              # Stili globali
```

## 🔒 Sicurezza

- ✅ Variabili d'ambiente per credenziali
- ✅ Regole Firestore per sicurezza dati
- ✅ Validazione input lato client e server
- ✅ Autenticazione obbligatoria per dati utente

## 🎯 Prossimi Passi

1. **Implementazione Words**: Gestione completa parole
2. **Sistema Test**: Engine di test con AI
3. **Statistiche Avanzate**: Dashboard e grafici
4. **Migrazione Dati**: Import da localStorage
5. **Features Avanzate**: Sync offline, notifiche, ecc.

## 📝 Note Sviluppo

Questa è la struttura base v3.0 che implementa:
- ✅ Autenticazione Firebase completa
- ✅ Tipizzazione TypeScript rigorosa
- ✅ Servizi Firestore per tutti i tipi
- ✅ UI moderna e responsive
- ✅ Home page funzionale con placeholder

Le funzionalità complete saranno implementate iterativamente mantenendo questa solida base.

# =====================================================
# 📁 Comandi di Setup Rapido
# =====================================================

# 1. Inizializza nuovo progetto React con TypeScript
npx create-react-app vocabulary-master-v3 --template typescript
cd vocabulary-master-v3

# 2. Installa dipendenze Firebase e UI
npm install firebase react-router-dom clsx tailwind-merge lucide-react

# 3. Installa dipendenze di sviluppo
npm install -D tailwindcss autoprefixer postcss @tailwindcss/forms

# 4. Inizializza Tailwind CSS
npx tailwindcss init -p

# 5. Inizializza Firebase (opzionale, se non già fatto)
npm install -g firebase-tools
firebase login
firebase init

# 6. Copia tutti i file generati negli artifact sopra

# 7. Configura environment
cp .env.example .env.local
# Modifica .env.local con le tue credenziali Firebase e Gemini

# 8. Verifica configurazione e avvia
npm run check-env
npm start