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
