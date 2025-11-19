// Versão do cache: Alterar este nome força o navegador a baixar e recarregar todos os arquivos novamente.
const CACHE_NAME = 'protocolo-nexus-cache-v1.0.0';

// Lista de todos os arquivos que DEVEM ser armazenados em cache para acesso offline.
// **ATENÇÃO:** Você deve adicionar aqui TODOS os seus arquivos HTML, CSS, JS e imagens.
const urlsToCache = [
  '/', // O diretório raiz
  '/index.html',
  '/manifest.json',
  // Seus arquivos HTML existentes:
  '/Agenda Inteligente 2.html',
  '/Descanso.html',
  '/Fluxo Diário.html',
  '/Memória numérica.html',
  '/tédio.html',
  '/Game.html',
  // Adicione todos os seus outros arquivos .html, .css (se tiver), e ícones aqui
  '/icon-192.png',
  '/icon-512.png'
  // IMPORTANTE: Arquivos externos (como cdn.tailwindcss.com ou lucide@latest) NÃO podem ser cacheados.
];

// --- FASE 1: INSTALAÇÃO ---
self.addEventListener('install', event => {
  // O Service Worker está sendo instalado. Faz o cache de todos os arquivos essenciais.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aberto: Fazendo pré-cache dos arquivos essenciais.');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Falha ao fazer pré-cache:', error);
      })
  );
});

// --- FASE 2: ATIVAÇÃO ---
self.addEventListener('activate', event => {
  // Limpa caches antigos (para evitar acúmulo de versões antigas dos arquivos).
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[Service Worker] Deletando cache antigo:', name);
            return caches.delete(name);
          })
      );
    })
  );
});

// --- FASE 3: REQUISIÇÕES (CACHE-FIRST) ---
self.addEventListener('fetch', event => {
  // Intercepta todas as requisições de rede.
  event.respondWith(
    // 1. Tenta encontrar a resposta no CACHE
    caches.match(event.request)
      .then(response => {
        // Se a resposta estiver no cache, retorna-a imediatamente (OFFLINE OK).
        if (response) {
          return response;
        }

        // 2. Se não estiver no cache, faz a requisição pela REDE
        return fetch(event.request);
      }
    )
  );
});