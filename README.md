<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Projeto PaRo Gastos

## Visão geral
Esta aplicação web foi desenvolvida para facilitar o controle e análise de despesas pessoais. O objetivo é permitir que o usuário registre gastos, visualize histórico, faça comparações entre categorias e receba insights baseados em inteligência artificial, integrando o modelo Gemini da Google.

## Tecnologias e dependências
- **Frontend**: React 19 (com suporte a JSX moderno), TypeScript 5.8, Vite 6, Tailwind CSS 4, Recharts (para gráficos), Lucide‑React (ícones), Motion, clsx, tailwind‑merge.
- **Backend (opcional)**: Express 4, dotenv.
- **IA**: @google/genai – interage com a API Gemini.
- **Outros**: date-fns, motion, lucide‑react.

## Variáveis de ambiente
As variáveis são definidas em um arquivo de ambiente (*`.env`*). Um modelo de exemplo está em `.env.example`:

```dotenv
# GEMINI_API_KEY: Obrigatória para chamadas à API Gemini.
# AI Studio injeta automaticamente essa chave em tempo de execução.
# Usuários configuram via Painel de Segredos no UI.
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: URL onde o applet está hospedado.
# AI Studio injeta automaticamente o URL do serviço Cloud Run em tempo de execução.
# Usado em links autossimples, callbacks OAuth e pontos finais de API.
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
├─ lib/                # Context, utilidades e armazenamento local
├─ App.tsx             # Componente raiz
├─ main.tsx            # Ponto de entrada
└─ index.css           # Estilos globais
```

## Como começar
1. Clone o repositório.
2. Crie um arquivo `.env` copiando `.env.example` e preencha as variáveis.
3. Rode `npm install` para instalar dependências.
4. Inicie o dev server com `npm run dev`.
5. Abra o navegador em `http://localhost:3000`.

## Observações
- O arquivo `package.json` marca o projeto como `private: true`, então não há licença pública definida.
- A aplicação está preparada para ser empacotada com Vite, mas pode ser facilmente hospedada em qualquer servidor HTTP.

```


