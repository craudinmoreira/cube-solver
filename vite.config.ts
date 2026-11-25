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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    headers: globalHeaders,
  },
})
