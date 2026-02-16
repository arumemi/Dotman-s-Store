/* @vitest-environment jsdom */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor, act, cleanup } from '@testing-library/react';

vi.mock('../../data.jsx', () => ({
  productsData: [],
}));

const createJsonResponse = (payload, ok = true, status = ok ? 200 : 500) => ({
  ok,
  status,
  json: async () => payload,
});

const configureMongoSyncEnv = () => {
  import.meta.env.VITE_PRODUCTS_SYNC_MODE = 'mongodb';
  import.meta.env.VITE_PRODUCTS_API_BASE_URL = '';
  import.meta.env.VITE_FIREBASE_DATABASE_URL = '';
};

describe('ShopContext MongoDB sync flow', () => {
  beforeEach(() => {
    cleanup();
    vi.resetModules();
    localStorage.clear();
    configureMongoSyncEnv();
  });

  it('syncs added products so a new session can see them', async () => {
    let sharedProducts = [];

    global.fetch = vi.fn(async (url, options = {}) => {
      const method = (options.method || 'GET').toUpperCase();

      if (url === '/api/products' && method === 'GET') {
        return createJsonResponse(sharedProducts);
      }

      if (url === '/api/products' && method === 'PUT') {
        sharedProducts = JSON.parse(options.body || '[]');
        return createJsonResponse({ ok: true, count: sharedProducts.length });
      }

      return createJsonResponse({ message: 'Not found' }, false, 404);
    });

    const { ShopContext, ShopContextProvider } = await import('./shopContex.jsx');

    let latestContext = null;

    const ContextProbe = () => {
      const ctx = React.useContext(ShopContext);
      React.useEffect(() => {
        latestContext = ctx;
      }, [ctx]);
      return null;
    };

    const firstSession = render(
      <ShopContextProvider>
        <ContextProbe />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/products', expect.objectContaining({ method: 'GET' }));
    });

    await act(async () => {
      latestContext.addProduct({
        title: 'Shared Test Phone',
        price: 499.99,
        category: 'Smartphone',
        description: 'Created in session A',
        image: 'https://example.com/shared-phone.jpg',
      });
    });

    await waitFor(() => {
      expect(sharedProducts.length).toBe(1);
      expect(sharedProducts[0].title).toBe('Shared Test Phone');
      expect(sharedProducts[0].images?.[0]).toBe('https://example.com/shared-phone.jpg');
    });

    firstSession.unmount();

    latestContext = null;

    render(
      <ShopContextProvider>
        <ContextProbe />
      </ShopContextProvider>
    );

    await waitFor(() => {
      expect(latestContext).toBeTruthy();
      expect(latestContext.products.length).toBe(1);
      expect(latestContext.products[0].title).toBe('Shared Test Phone');
    });
  });
});
