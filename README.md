# Delivery Manager API

![versao](https://img.shields.io/badge/version-1.0.0-0ea5e9.svg)
![node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![typescript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)
![mysql](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)
![docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

API para gerenciamento de clientes, pedidos de entrega, autenticacao e relatorios, usando Node.js + TypeScript + Prisma + MySQL.

## Principais recursos

- Cadastro de clientes, enderecos, cidades e bairros.
- Criacao e atualizacao de pedidos de entrega.
- Autenticacao com access token e refresh token.
- Ranking de entregadores por periodo.
- Seed inicial com dados de exemplo.

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- MySQL
- Jest

## Requisitos

- Node.js 20+
- npm 10+
- MySQL 8+

## Variaveis de ambiente

Arquivos publicos incluidos:

- .env.public
- .env.public.example

Variaveis utilizadas:

- PORT
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASSWORD
- DATABASE_URL
- JWT_SECRET

## Execucao local (sem Docker)

1. Instale dependencias:

```bash
npm install
```

2. Copie o ambiente publico:

```bash
cp .env.public.example .env
```

3. Gere client Prisma e aplique migracoes:

```bash
npx prisma generate
npx prisma migrate deploy
```

4. (Opcional) Seed inicial:

```bash
npx prisma db seed
```

5. Suba a API:

```bash
npm run dev
```

API em: http://localhost:3000/api

## Docker publico (API + MySQL + Frontend)

Foi adicionado um compose publico sem alterar o compose existente:

- docker-compose.public.yml

Subir stack completa:

```bash
docker compose -f docker-compose.public.yml up --build
```

Servicos:

- Frontend: http://localhost:5173
- API: http://localhost:3000/api
- MySQL: localhost:3306

Parar stack:

```bash
docker compose -f docker-compose.public.yml down
```

## Scripts

- npm run dev: desenvolvimento com nodemon.
- npm run build: build TypeScript em dist.
- npm run start: executa build em producao.
- npm run test: testes com Jest.
- npm run test:unit: testes unitarios.
- npm run test:integration: testes de integracao.

## Observacoes

- O projeto mantem o docker-compose.yml original intacto.
- Os arquivos publicos adicionados usam sufixo .public para facilitar publicacao no GitHub.

## Licenca

Uso interno/projeto privado. Ajuste conforme necessidade para repositoio publico.


