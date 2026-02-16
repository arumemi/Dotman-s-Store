# Product Card E-commerce (React + Vite)

Aplicação React com Vite e React Router para catálogo e carrinho.

## Cloudinary (upload e entrega de imagens)

O projeto está integrado com Cloudinary para:

- upload de imagens no painel `/admin` (via **unsigned upload preset**)
- otimização automática de imagens Cloudinary na listagem, detalhes e carrinho

### 1) Configurar variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

> ⚠️ Não use `API_SECRET` no frontend. Segredos nunca devem ficar em variáveis `VITE_*`.

### 2) Criar upload preset unsigned no Cloudinary

No dashboard Cloudinary:

1. Settings → Upload
2. Upload presets → Add upload preset
3. Signing Mode: **Unsigned**
4. Copie o nome do preset para `VITE_CLOUDINARY_UPLOAD_PRESET`

### 3) Comportamento de fallback

Se o preset não estiver configurado, o painel admin mantém fallback local (imagem comprimida em data URL) para não quebrar o fluxo.

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
