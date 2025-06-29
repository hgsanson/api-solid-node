import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()], // Habilitar importações configuradas em tsconfig.json/paths (como o @ por exemplo)
  test: {
    // Desabilitar o coverage.all que por padrão adiciona todos os arquivos do diretório no coverage
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/use-cases',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/http/controllers',
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
    globals: true,
    coverage: {
      all: false,
    },
  },
})
