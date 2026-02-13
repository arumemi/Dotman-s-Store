# Product Card E-commerce (React + Vite)

Aplicação React com Vite e React Router para catálogo e carrinho.

## Scripts

- `npm run dev`: inicia ambiente de desenvolvimento
- `npm run build`: gera build de produção em `dist/`
- `npm run preview`: pré-visualiza build de produção localmente

## Deploy na Hostinger (hPanel / Apache)

Este projeto já está preparado para hospedagem estática com SPA:

- `public/.htaccess` garante fallback de rotas para `index.html`
- `vite.config.js` usa `base: './'` para assets funcionarem em raiz **ou subpasta**

### Passo a passo

1. Execute o build:
	- `npm run build`
2. Faça upload do conteúdo de `dist/` para `public_html/` (ou subpasta desejada).
3. Verifique se os seguintes arquivos estão presentes no destino:
	- `index.html`
	- `.htaccess`
	- pasta `assets/`

### Pacote pronto para upload

Se preferir upload único, use `hostinger-deploy.zip` (gerado a partir do `dist/`).

## Observações

- Se o domínio usar cache agressivo/CDN, limpe o cache após upload.
- Em SPA, erros 404 ao recarregar rotas geralmente indicam ausência ou problema no `.htaccess`.

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
