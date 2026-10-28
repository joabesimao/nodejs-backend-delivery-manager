# 🚚 Delivery Manager API

<div align="center">

![version](https://img.shields.io/badge/version-1.0.0-0ea5e9.svg?style=flat-square)
![node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white&style=flat-square)
![typescript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white&style=flat-square)
![postgres](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white&style=flat-square)
![docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white&style=flat-square)
![express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=flat-square)
![prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=flat-square)

API RESTful completa para gerenciamento de entregas, clientes, pedidos e relatórios em tempo real.

[Features](#-features) • [Requisitos](#-requisitos) • [Instalação](#-instalação) • [Rotas](#-rotas-da-api) • [Estrutura](#-estrutura-do-projeto) • [Docker](#-docker)

</div>

---

## 🎯 Features

- ✅ **Autenticação JWT** - Access Token e Refresh Token, com bloqueio de contas inativas
- ✅ **Gestão de Contas (RBAC)** - CRUD de usuários com papéis (`admin`, `gerente_estoque`, `entregador`, `user`), ativação/desativação e proteção contra exclusão do próprio usuário ou do último admin
- ✅ **Gestão de Clientes** - Cadastro, edição, exclusão e busca
- ✅ **Pedidos de Entrega** - Criação, atualização, rastreamento
- ✅ **Entregadores** - Cadastro e ranking por período
- ✅ **Localidades** - Cidades e bairros customizáveis
- ✅ **Relatórios** - Dashboard com métricas em tempo real
- ✅ **WebSocket** - Chat em tempo real entre filiais
- ✅ **Validação** - Dados validados e sanitizados
- ✅ **Testes** - Testes unitários e de integração (Jest)
- ✅ **Logs** - Sistema de logging estruturado
- ✅ **Docker** - Pronto para containerização

---

## 📋 Requisitos

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** 16+ (Docker local ou [Neon](https://neon.tech))
- **Git**

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nodejs-backend-delivery-manager.git
cd nodejs-backend-delivery-manager
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o arquivo de ambiente

```bash
cp .env.public .env
```

Edite o `.env` com suas configurações:

```env
PORT=3000
DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/CadClient
DIRECT_URL=postgresql://seu_usuario:sua_senha@localhost:5432/CadClient
JWT_SECRET=sua_chave_secreta_aqui
```

### 4. Configure o banco de dados

```bash
# Criar banco de dados
npx prisma migrate deploy

# Popular com dados iniciais
npx prisma db seed
```

### 5. Inicie o servidor

```bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3000`

---

## 🔗 Rotas da API

### 📝 Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/signup` | Criar nova conta (role `user`) | ✅ admin |
| POST | `/api/login` | Login | ❌ |
| POST | `/api/refresh-token` | Renovar token | ❌ |

**Exemplo de Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fastone.local", "password": "12345678"}'
```

Retorno (login válido, conta ativa):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "name": "Administrador",
  "role": "admin"
}
```

Contas com `active: false` não conseguem autenticar (login retorna como inválido) e, se já tiverem um `accessToken` válido, esse token deixa de ser aceito nas rotas protegidas assim que a conta é desativada.

---

### 🔐 Contas / Usuários (RBAC)

Todas as rotas abaixo exigem token de um usuário com papel `admin`.

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/account/staff` | Cria uma conta (`admin`, `gerente_estoque`, `entregador` ou `user`) |
| GET | `/api/account` | Lista contas, com filtro opcional por `role` e busca (`q`) por nome/e-mail |
| PUT | `/api/account/:id` | Atualiza nome, e-mail, papel, senha e/ou `active` |
| DELETE | `/api/account/:id` | Remove uma conta |

Papéis disponíveis (`AccountRole`): `admin`, `gerente_estoque`, `entregador`, `user`.

**Regras de exclusão (`DELETE /account/:id`):**
- Um admin não pode excluir a própria conta → `403 Forbidden` (`SelfActionError`)
- Não é possível excluir o último admin ativo do sistema → `403 Forbidden` (`LastAdminError`)
- Se a conta tiver registros vinculados (violação de chave estrangeira), a API responde `409 Conflict` (`AccountInUseError`) em vez de derrubar a exclusão com erro genérico

**Exemplo de criação de staff:**
```bash
curl -X POST http://localhost:3000/api/account/staff \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_admin" \
  -d '{
    "name": "Maria Souza",
    "email": "maria@fastone.local",
    "password": "12345678",
    "passwordConfirmation": "12345678",
    "role": "gerente_estoque"
  }'
```

**Exemplo de desativação (soft delete) sem remover a conta:**
```bash
curl -X PUT http://localhost:3000/api/account/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_admin" \
  -d '{"active": false}'
```

---

### 👥 Clientes

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/client` | Listar todos os clientes | ❌ |
| GET | `/api/client/:id` | Obter cliente por ID | ✅ |
| POST | `/api/register` | Criar novo cliente | ❌ |
| PUT | `/api/client/:id` | Atualizar cliente | ✅ |
| DELETE | `/api/client/:id` | Deletar cliente | ✅ |

**Exemplo de Criação:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "name": "João",
      "lastName": "Silva",
      "phone": "11987654321"
    },
    "address": {
      "street": "Rua A",
      "neighborhood": "Centro",
      "numberHouse": 100,
      "reference": "Perto da padaria",
      "city": "São Paulo"
    }
  }'
```

---

### 🚗 Entregadores

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/deliveryman` | Listar entregadores | ❌ |
| GET | `/api/deliveryman/:id` | Obter entregador por ID | ✅ |
| POST | `/api/deliveryman` | Criar entregador | ✅ |
| PUT | `/api/deliveryman/:id` | Atualizar entregador | ✅ |
| DELETE | `/api/deliveryman/:id` | Deletar entregador | ✅ |

---

### 📦 Pedidos de Entrega

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/orderDelivery` | Listar pedidos | ✅ |
| GET | `/api/orderDelivery/:id` | Obter pedido por ID | ✅ |
| GET | `/api/orderDelivery/ranking/deliveryman` | Ranking de entregadores | ✅ |
| POST | `/api/orderDelivery` | Criar novo pedido | ✅ |
| PUT | `/api/orderDelivery/:id` | Atualizar pedido | ✅ |
| DELETE | `/api/orderDelivery/:id` | Deletar pedido | ✅ |

**Exemplo de Criação:**
```bash
curl -X POST http://localhost:3000/api/orderDelivery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_aqui" \
  -d '{
    "registerId": 1,
    "deliverymanId": 1,
    "quantity": "5",
    "amount": 150.50
  }'
```

---

### 📍 Localidades

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/city` | Listar cidades | ❌ |
| POST | `/api/city` | Criar cidade | ✅ |
| GET | `/api/neighborhood` | Listar bairros | ❌ |
| POST | `/api/neighborhood` | Criar bairro | ✅ |

---

### 📊 Dashboard

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/dashboard/overview` | Resumo geral | ✅ |

**Retorno:**
```json
{
  "metrics": {
    "clients": 150,
    "deliverymen": 25,
    "activeDeliveries": 12,
    "deliveredRevenue": 5250.75,
    "cities": 5,
    "neighborhoods": 45
  },
  "latestDeliveries": [...]
}
```

---

### 💬 Chat em Tempo Real

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api/chat-messages` | Listar mensagens | ✅ |
| POST | `/api/chat-message` | Enviar mensagem | ✅ |
| WS | `/api/chat` | WebSocket para chat ao vivo | ✅ |

---

## 📁 Estrutura do Projeto

```
src/
├── data/                    # Camada de dados
│   ├── protocols/          # Interfaces e contratos
│   └── repositories/       # Implementação dos repositórios
├── domain/                  # Lógica de negócios
│   ├── entities/           # Entidades do domínio
│   └── usecases/           # Casos de uso
├── infra/                   # Infraestrutura
│   ├── db/                 # Conexões com BD
│   └── cache/              # Cache e sessões
├── main/                    # Configuração geral
│   ├── adapters/           # Adaptadores (Express, WebSocket)
│   ├── config/             # Middleware e rotas
│   ├── factories/          # Factory patterns
│   └── middleware/         # Middlewares customizados
├── presentation/            # Camada de apresentação
│   ├── controllers/        # Controllers
│   ├── errors/             # Tratamento de erros
│   ├── helpers/            # Utilitários
│   └── protocols/          # Protocolos de requisição/resposta
├── utils/                   # Utilidades gerais
└── server.ts               # Ponto de entrada
```

---

## 🐳 Docker

### Build da imagem

```bash
docker build -f Dockerfile.public -t fastone-backend:latest .
```

### Executar com Docker Compose

```bash
docker-compose -f docker-compose.public.yml up -d
```

### Verificar logs

```bash
docker-compose -f docker-compose.public.yml logs -f api
```

---

## ☁️ Deploy (Neon + Vercel)

**Banco (Neon):** crie o projeto na região `AWS São Paulo (sa-east-1)`, perto da função no Vercel (`gru1`, em `vercel.json`). Copie duas connection strings: a _pooled_ (host com `-pooler`) para `DATABASE_URL` e a direta para `DIRECT_URL`. Aplique as migrations e o seed a partir da sua máquina:

```bash
DATABASE_URL="<pooled>" DIRECT_URL="<direta>" npm run db:migrate:deploy
DATABASE_URL="<pooled>" DIRECT_URL="<direta>" SEED_ADMIN_PASSWORD="<senha forte>" npx prisma db seed
```

**API (Vercel):** importe o repositório no Vercel (o preset Express é detectado). O entrypoint é `src/server.ts`, que exporta o servidor HTTP com o Socket.IO. Configure as variáveis em Production:

| Variável       | Valor                                                   |
| -------------- | ------------------------------------------------------- |
| `NODE_ENV`     | `production`                                            |
| `DATABASE_URL` | connection string _pooled_ do Neon                      |
| `DIRECT_URL`   | connection string direta do Neon                        |
| `JWT_SECRET`   | `openssl rand -hex 32`                                  |
| `CORS_ORIGINS` | URL do app web (ex.: `https://fastone-mobile.vercel.app`) |

As migrations não rodam no build: aplique com `npm run db:migrate:deploy` antes de publicar uma versão que muda o schema.

**Tempo real no Vercel:** o Socket.IO funciona só com o transporte `websocket` (o app já usa). Cada conexão fica presa a uma instância da função e cai quando ela atinge a duração máxima; o cliente reconecta sozinho. Eventos emitidos por uma requisição HTTP só chegam aos sockets da mesma instância. Com mais de uma instância ativa, alguns avisos em tempo real não chegam até a próxima atualização da tela. Para garantir a entrega, use um adapter do Socket.IO com Redis.

---

## 🧪 Testes

### Rodar testes unitários

```bash
npm run test:unit
```

### Rodar testes de integração

```bash
npm run test:integration
```

### Cobertura de testes

```bash
npm run test:unit:coverage
```

---

## 📝 Variáveis de Ambiente

```env
# Servidor
PORT=3000                                    # Porta do servidor

# Banco de Dados PostgreSQL (Neon em produção)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require  # Neon: string "pooled" (host -pooler), usada pela API
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require    # Neon: string direta, usada pelo prisma migrate

# Autenticação
JWT_SECRET=fastone_jwt_secret_here          # Chave secreta para JWT (openssl rand -hex 32)

# Ambiente
NODE_ENV=development                        # development | test | production
CORS_ORIGINS=http://localhost:5173          # Origens do frontend (vírgula); obrigatória em produção

# Seed (opcional)
SEED_ADMIN_EMAIL=admin@fastone.local        # E-mail do admin criado pelo seed
SEED_ADMIN_PASSWORD=                        # Obrigatória com NODE_ENV=production
```

> Com `NODE_ENV=production`, a API não sobe se o `JWT_SECRET` tiver menos de 32
> caracteres, for um dos valores de exemplo deste repositório ou se `CORS_ORIGINS`
> não estiver definida. O seed só cria o
> admin quando ele ainda não existe — rodar de novo não altera a senha.

---

## 🔐 Segurança

- ✅ Tokens JWT com expiração
- ✅ Refresh tokens para renovação
- ✅ Validação de entrada em todas as rotas
- ✅ Proteção contra SQL Injection (Prisma ORM)
- ✅ Rate limiting em produção
- ✅ CORS configurável

---

## 📈 Performance

- ⚡ Cache de resultados frequentes
- ⚡ Paginação em listagens
- ⚡ Índices no banco de dados
- ⚡ Compressão de respostas

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

<div align="center">

**Feito com ❤️ by FastOne Delivery Team**

[⬆ Voltar ao topo](#-delivery-manager-api)

</div>


