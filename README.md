
<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>


# Projeto PaRo Gastos

## Visão geral
Esta aplicação web foi desenvolvida para facilitar o controle e análise de despesas pessoais. O objetivo é permitir que o usuário registre gastos, visualize histórico, faça comparações entre categorias e receba insights baseados em inteligência artificial, integrando o modelo Gemini da Google.

## Tecnologias e dependências
- **Frontend**: React 19 (com suporte a JSX moderno), TypeScript 5.8, Vite 6, Tailwind CSS 4, Recharts (para gráficos), Lucide‑React (ícones), Motion, clsx, tailwind‑merge.
- **Backend**: Firebase Authentication + Firestore Database (Google Cloud).
- **IA**: @google/genai – interage com a API Gemini.
- **Outros**: date-fns, motion, lucide‑react.

## Funcionalidades
- **Autenticação Firebase**: Login com email e senha utilizando o Firebase Authentication.
- **Gastos em tempo real**: Os gastos são armazenados e sincronizados em tempo real via Firestore (coleção `gastos`).
- **Dashboard com gráficos**: Visualização mensal com gráficos de barras e rosca (Recharts), KPIs por usuário e por categoria.
- **Histórico completo**: Navegação por todos os gastos registrados com opção de excluir.
- **Gerenciamento de categorias**: Criação e exclusão de categorias personalizadas.
- **Suporte a múltiplos usuários**: Dois perfis fixos (Rogério e Patrícia) com cores distintas.

## Variáveis de ambiente
As variáveis são definidas em um arquivo de ambiente (*`.env`*). Um modelo de exemplo está em `.env.example`:

```dotenv
# Firebase Configuration
VITE_FIREBASE_API_KEY="sua_api_key"
VITE_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu_projeto"
VITE_FIREBASE_STORAGE_BUCKET="seu_projeto.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
VITE_FIREBASE_APP_ID="seu_app_id"

# GEMINI_API_KEY: Obrigatória para chamadas à API Gemini.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: URL onde o applet está hospedado.
APP_URL="MY_APP_URL"
```

## Scripts de desenvolvimento
```bash
# Instala as dependências
npm install

# Executa o servidor de desenvolvimento (porta 3000)
npm run dev

# Gera bundle de produção
npm run build

# Preview do bundle gerado
npm run preview

# Limpa a pasta dist
npm run clean

# Verifica tipos (sem emitir código)
npm run lint
```

## Estrutura de pastas
```
src/
├─ components/         # Componentes React (Dashboard, Login, AddExpense, History, Navigation, Settings)
├─ lib/                # Context, Firebase, storage e utilitários
├─ App.tsx             # Componente raiz
├─ main.tsx            # Ponto de entrada
└─ index.css           # Estilos globais
```

## Armazenamento
- **Firestore Database**: Os gastos são salvos na coleção `gastos` com sincronização em tempo real via `onSnapshot`.
- **localStorage**: Apenas usuários e categorias são persistidos localmente (para fallback e inicialização).
- **Security Rules**: Regras no arquivo `firestore.rules` — acesso somente para usuários autenticados.

## Como começar
1. Clone o repositório.
2. Crie um arquivo `.env` copiando `.env.example` e preencha as variáveis do Firebase e Gemini.
3. Rode `npm install` para instalar dependências.
4. Inicie o dev server com `npm run dev`.
5. Abra o navegador em `http://localhost:3000`.

## Observações
- O arquivo `package.json` marca o projeto como `private: true`, então não há licença pública definida.
- A aplicação está preparada para ser empacotada com Vite e hospedada em qualquer servidor HTTP ou Firebase Hosting.

```
 

.

