import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    // Valores fixos nos testes: não dependem do package.json nem do git
    define: { __APP_VERSION__: JSON.stringify('1.2.0'), __APP_COMMIT__: JSON.stringify('abc1234') },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}', '.claude/hooks/**/*.test.mjs'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json-summary', 'lcov'],
        // Componentes WebGL (Scene, RubiksCube, Cubie, ViewCubeArrows) são cobertos pelo E2E.
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.*', 'src/test/**', 'src/main.tsx', 'src/App.tsx', 'src/components/Cube/{Scene,RubiksCube,Cubie,ViewCubeArrows}.tsx'],
        // Piso de cobertura: o CI falha abaixo disso. Suba quando a cobertura subir.
        thresholds: { lines: 95, functions: 95, branches: 90, statements: 95 },
      },
    },
  }),
)
