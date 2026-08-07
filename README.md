# 🚚 Delivery Manager API

<div align="center">

![version](https://img.shields.io/badge/version-1.0.0-0ea5e9.svg?style=flat-square)
![node](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white&style=flat-square)
![typescript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white&style=flat-square)
![mysql](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white&style=flat-square)
![docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white&style=flat-square)
![express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=flat-square)
![prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=flat-square)

API RESTful completa para gerenciamento de entregas, clientes, pedidos e relatórios em tempo real.

[Features](#-features) • [Requisitos](#-requisitos) • [Instalação](#-instalação) • [Rotas](#-rotas-da-api) • [Estrutura](#-estrutura-do-projeto) • [Docker](#-docker)

</div>

---

## 🎯 Features

- ✅ **Autenticação JWT** - Access Token e Refresh Token
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
- **MySQL** 8+ (ou Docker)
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
DB_HOST=localhost
DB_PORT=3306
DB_NAME=CadClient
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DATABASE_URL=mysql://seu_usuario:sua_senha@localhost:3306/CadClient
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
| POST | `/api/signup` | Criar nova conta | ❌ |
| POST | `/api/login` | Login | ❌ |
| POST | `/api/refresh-token` | Renovar token | ❌ |

**Exemplo de Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fastone.local", "password": "12345678"}'
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
npm run test:coverage
```

---

## 📝 Variáveis de Ambiente

```env
# Servidor
PORT=3000                                    # Porta do servidor

# Banco de Dados MySQL
DB_HOST=localhost                           # Host do MySQL
DB_PORT=3306                                # Porta do MySQL
DB_NAME=CadClient                           # Nome do banco
DB_USER=myuser                              # Usuário do MySQL
DB_PASSWORD=mypassword                      # Senha do MySQL
DATABASE_URL=mysql://user:pass@host/db     # URL de conexão completa

# Autenticação
JWT_SECRET=fastone_jwt_secret_here          # Chave secreta para JWT
```

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


