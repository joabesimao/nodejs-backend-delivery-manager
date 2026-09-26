# Plano: testes de integração + CI para develop e main (backend)

## Contexto
Os testes unitários (985 testes, todos passando) só mockam o Prisma. Por isso ninguém testa `main/routes`, `main/factories`, `main/config` e o SQL real dos repositórios: essas camadas estão com 0–8% de cobertura. Também não existe CI de testes: o único workflow é o `release.yml`, que roda na develop. O objetivo tem três partes:
- testes de integração em dois níveis: repositórios contra MySQL real e rotas HTTP com supertest;
- rodar esses testes no GitHub Actions nos PRs e pushes para `develop` e `main`;
- usar um banco e um GitHub Environment separados para cada branch.

Projeto: `nodejs-backend-delivery-manager`.

## Bloqueios encontrados (resolver primeiro)
1. **Rotas carregadas de forma assíncrona.** Em [src/main/config/routes.ts](src/main/config/routes.ts), `fg.sync(...).forEach(import(...).then(...))` não é aguardado. No teste, o supertest dispara a requisição antes de as rotas existirem e recebe 404.
   → `setupRoutes` passa a retornar `Promise<void>` (`await Promise.all(...)`). O [app.ts](src/main/config/app.ts) passa a exportar `setupApp(): Promise<Express>`. O [server.ts](src/main/server.ts) e os 4 `*.test.ts` existentes passam a usar `await setupApp()`.
2. **`jest-unit-config.js` quebrado.** Ele faz `require("./jest.config")`, mas o arquivo é `.ts`.
   → Converter `jest.config.ts` para `jest.config.js` (CommonJS), assim os configs de unit e de integração voltam a funcionar.
3. **O [config/Env.ts](config/Env.ts) chama `process.exit(1)` se faltar variável.**
   → Criar `.env.test` (versionado, só com valores fake) e um `setupFiles` do jest que carrega esse arquivo antes de qualquer import. O `dotenv` não sobrescreve variáveis já definidas.
4. **Os hooks do husky vão exigir banco.** O `pre-push` roda `test:ci`, que roda todos os testes, e o `test:staged` usa `--findRelatedTests`, que pode puxar arquivos `*.test.ts`.
   → Os dois passam a rodar só os unitários (`-c jest-unit-config.js`).
5. **Preset `@shelf/jest-mongodb`.** Ele só é necessário para `LogMongoRepository`, usado em `delete-account`. Vou manter o preset só no config de integração, para a rota `DELETE /account` funcionar, e tirar do config unitário para acelerar.

## Estrutura de testes
- Convenção atual: `*.spec.ts` para unitários e `*.test.ts` para integração.
- **Nível 1, repositórios:** `src/infra/db/mysql/<x>-repository/<x>-repository.test.ts`, usando o `prisma` real de [helpers/index.ts](src/infra/db/mysql/helpers/index.ts). Cada teste semeia os dados, chama o repositório e confere o resultado no banco. Ordem de prioridade: vehicle, fuel-refill, oil-change (módulo novo), account, order-delivery, client, product; depois os demais.
- **Nível 2, rotas:** `src/main/routes/<recurso>-routes.test.ts`, com supertest sobre `await setupApp()`. Para cada recurso, testar:
  - o caminho feliz de CRUD;
  - 401 sem token;
  - 403 com role errada (ex.: `PUT /vehicle/:id` exige `admin`/`gerente_estoque`);
  - 400 para validação.
  O [routes.ts](src/main/routes/routes.ts) é grande (828 linhas), então os testes dele serão divididos por domínio (`account-routes.test.ts`, `order-delivery-routes.test.ts`, …).
- **Helpers novos** em `src/test/integration/`:
  - `db.ts`: `truncateAll()` via `prisma.$executeRawUnsafe` com `SET FOREIGN_KEY_CHECKS=0`, rodando `TRUNCATE` em cada tabela de `information_schema.tables`, exceto `_prisma_migrations`. Chamado no `beforeEach`.
  - `auth.ts`: `makeAuthToken(role)` cria o Account com bcrypt e assina o token com o `JwtAdapter` existente ([jwt-adapter.ts](src/infra/cryptography/jwt-adapter/jwt-adapter.ts)) e o `env.JWT_SECRET`. Assim o token segue o mesmo formato que o `DbLoadAccountByToken` espera.
  - `factories.ts`: builders mínimos (`makeVehicle`, `makeDeliveryman`, …) que gravam direto via prisma.

## Configuração do Jest de integração
O `jest-integration-config.js` terá:
- `testMatch: ["**/*.test.ts"]`
- `setupFiles: [".../load-env-test.ts"]`
- `globalSetup`, que roda `prisma migrate deploy` contra o banco de teste. Com isso as migrations também são validadas.
- `maxWorkers: 1` / `--runInBand`, porque o banco é compartilhado.
- `afterAll(prisma.$disconnect)` via `setupFilesAfterEnv`.

Scripts no `package.json`:
- `test:unit:ci`: unitários com coverage, sem `--watch`.
- `test:integration:ci`: integração com coverage, sem `--watch`.
- `test:integration`: continua existindo para uso local, com `--watch`.

Para rodar localmente, criar `docker-compose.test.yml` com MySQL 8 na porta **3307** (não conflita com o banco de dev) e `tmpfs` para ficar rápido. O `DATABASE_URL`/`DB_*` do `.env.test` aponta para ele.

## Develop x main: bancos e ambientes separados
Novo workflow `.github/workflows/ci.yml`:
- **Gatilhos:** `pull_request` e `push` nas branches `[develop, main]`.
- **Job `unit`:** `npm ci` → `prisma generate` → `test:unit:ci` → `npm run build` (garante que o `tsc` compila).
- **Job `integration`:** `needs: unit`, com `services: mysql:8.0` e healthcheck.
  - `environment: ${{ github.base_ref || github.ref_name }}` usa o GitHub Environment `develop` ou `main`, cada um com seus próprios secrets (`JWT_SECRET`, credenciais do banco).
  - `DB_NAME` diferente por branch: `fastone_test_develop` / `fastone_test_main`.
  - `prisma migrate deploy` → `test:integration:ci`.
- **Extras só para a `main`** (`if: base_ref == 'main' || ref_name == 'main'`):
  - thresholds de coverage mais rígidos via `--coverageThreshold`;
  - `prisma migrate diff --from-migrations --to-schema-datamodel --exit-code`, que falha se o schema tiver mudança sem migration.
- Upload do relatório de coverage como artifact.
- O `release.yml` passa a depender do CI verde na develop (`workflow_run` do CI, ou a proteção de branch cuida disso).
- **Manual, no GitHub (eu te passo o passo a passo):**
  - criar os Environments `develop` e `main` com os secrets;
  - em Branch protection de `develop` e `main`, exigir os checks `unit` e `integration`.
- A `main` está 9 commits atrás da develop. O workflow chega nela pelo próximo PR develop→main.

## Arquivos principais
- Alterar: `src/main/config/{routes,app}.ts`, `src/main/server.ts`, `jest.config.ts` (vira `.js`), `jest-unit-config.js`, `jest-integration-config.js`, `package.json`, `.husky/pre-push`, `.lintstagedrc.json`, os 4 `*.test.ts` existentes.
- Criar: `.env.test`, `docker-compose.test.yml`, `src/test/integration/{db,auth,factories,load-env-test,global-setup}.ts`, `.github/workflows/ci.yml`, e os `*.test.ts` de repositórios e rotas.

## Ordem de execução
1. Corrigir a infraestrutura: bloqueios 1–5, configs, `.env.test`, docker-compose de teste e helpers.
2. Primeiro recurso completo como modelo: vehicle (repositório + rotas). Validar localmente.
3. Workflow `ci.yml` com um PR de teste para develop.
4. Expandir para os demais repositórios e rotas, um PR por domínio.

## Verificação
- `docker compose -f docker-compose.test.yml up -d && npm run test:integration:ci`: tudo verde, e a cobertura de `main/routes` e `main/factories` sai do 0%.
- `npx jest -c jest-unit-config.js`: continua com 985 testes passando, sem precisar de banco.
- `npm run dev` continua subindo normalmente, o que valida a mudança no `setupApp`.
- PR de teste para develop: os jobs `unit` e `integration` aparecem e passam. Quebrar um teste de propósito tem que bloquear o merge.
- PR develop→main: roda com o environment `main`, o `DB_NAME` da main e os checks extras.
