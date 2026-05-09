/**
 * @file src/lib/firebase.ts
 * @description Inicialização modular do Firebase SDK v9+.
 *
 * Exporta as instâncias de Auth e Firestore para uso em todo o projeto.
 * Utilize sempre os imports nomeados deste módulo — nunca inicialize
 * o Firebase diretamente em componentes ou serviços.
 *
 * Variáveis de ambiente obrigatórias (prefixo VITE_ exigido pelo Vite):
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 *
 * Opcionais:
 *   VITE_FIREBASE_DATABASE_URL   (Realtime Database)
 *   VITE_FIREBASE_MEASUREMENT_ID (Google Analytics)
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

// ---------------------------------------------------------------------------
// Configuração lida das variáveis de ambiente expostas pelo Vite
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
} as const;

// ---------------------------------------------------------------------------
// Validação das variáveis obrigatórias em desenvolvimento
// ---------------------------------------------------------------------------
if (import.meta.env.DEV) {
  const required: (keyof typeof firebaseConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missing = required.filter((key) => !firebaseConfig[key]);

  if (missing.length > 0) {
    const varNames = missing.map((k) => `VITE_FIREBASE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
    console.error(
      '[firebase.ts] ⚠️  Variáveis de ambiente Firebase ausentes:\n',
      varNames.join('\n '),
      '\n\nCopie .env.example para .env e preencha os valores.',
    );
  }
}

// ---------------------------------------------------------------------------
// Singleton guard — evita re-inicialização em HMR (Vite Fast Refresh)
// ---------------------------------------------------------------------------
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ---------------------------------------------------------------------------
// Serviços exportados
// ---------------------------------------------------------------------------

/** Instância do Firebase Authentication */
export const auth: Auth = getAuth(app);

/** Instância do Firestore Database */
export const db: Firestore = getFirestore(app);

/** Instância raiz do Firebase App (uso avançado) */
export { app };
