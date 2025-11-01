
const CACHE_NAME = 'expense-tracker-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/lib/supabaseClient.ts',
  '/components/Header.tsx',
  '/components/Navigation.tsx',
  '/components/Dashboard.tsx',
  '/components/ExpensesPage.tsx',
  '/components/IncomePage.tsx',
  '/components/CategoriesPage.tsx',
  '/components/Summary.tsx',
  '/components/ExpenseChart.tsx',
  '/components/ExpenseForm.tsx',
  '/components/ExpenseList.tsx',
  '/components/ExpenseItem.tsx',
  '/components/CategoryIcon.tsx',
  '/components/AuthPage.tsx',
  '/icon.svg',
  'https://aistudiocdn.com/recharts@^3.3.0',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react@^19.2.0/',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/@google/genai@^1.28.0',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/@supabase/supabase-js@^2.45.0'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => caches.match(event.request));
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
