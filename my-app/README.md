# Product Card E-commerce (React + Vite)

Aplicação React com Vite e React Router para catálogo e carrinho.

## Scripts

- `npm run dev`: inicia ambiente de desenvolvimento
- `npm run build`: gera build de produção em `dist/`
- `npm run preview`: pré-visualiza build de produção localmente

## Deploy na Vercel

Projeto preparado para deploy com Vercel usando `vercel.json`:

- framework: `vite`
- output: `dist`
- rewrite SPA: `/(.*) -> /index.html`

### Passo a passo

1. Suba o repositório para GitHub/GitLab/Bitbucket.
2. Na Vercel, clique em **Add New Project** e importe o repositório.
3. Build command: `npm run build` (já definido).
4. Output directory: `dist` (já definido).
5. Deploy.

### Observação importante

Para Vercel com `BrowserRouter`, os assets devem ser gerados com base raiz (`/`) para funcionar em rotas profundas como `/product/123`.
