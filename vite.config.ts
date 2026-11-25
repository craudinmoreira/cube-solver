import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Headers globais de produção (CSP etc.) vêm do firebase.json, fonte única.
// O `vite preview` os aplica também, para que testes locais e de CI rodem
// sob a mesma política que o Firebase Hosting serve.
type HostingHeader = { source: string; headers: { key: string; value: string }[] }
const firebase = JSON.parse(readFileSync(new URL('./firebase.json', import.meta.url), 'utf8'))
const globalHeaders = Object.fromEntries(
  (firebase.hosting.headers as HostingHeader[])
    .filter((h) => h.source === '**')
    .flatMap((h) => h.headers.map(({ key, value }) => [key, value])),
)

// Versão e commit exibidos no app (modal "Novidades").
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const commit = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return 'dev'
  }
})()

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_COMMIT__: JSON.stringify(commit),
  },
  build: {
    // O chunk do Three.js (~720 KB, ~180 KB gzip) é esperado; o orçamento real
    // fica em scripts/check-bundle-size.mjs.
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        // Vendors em chunks próprios: mudam pouco, então o cache do navegador
        // sobrevive aos deploys do app. A cena 3D já é carregada sob demanda.
        codeSplitting: {
          groups: [
            // A interface (React + estado) é o caminho inicial; Three.js e R3F só a cena.
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|zustand|use-sync-external-store)[\\/]/, priority: 30 },
            { name: 'three', test: /node_modules[\\/]three[\\/]/, priority: 20 },
            { name: 'r3f', test: /node_modules[\\/](@react-three|three-stdlib|camera-controls|troika-|its-fine|suspend-react|maath|meshline|stats-gl|detect-gpu|hls\.js)/, priority: 10 },
          ],
        },
      },
    },
  },
  preview: {
    headers: globalHeaders,
  },
})
