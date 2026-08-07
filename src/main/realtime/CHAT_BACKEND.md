# 🚀 Chat Backend Implementation

## Visão Geral

Implementação completa do backend para o módulo de chat com suporte em tempo real via Socket.io e endpoints REST.

## 📊 Estrutura

### Socket.io Handlers
- **chat:send** - Enviar mensagem
- **chat:fetch-history** - Buscar histórico
- **chat:delete-message** - Deletar mensagem
- **chat:message** - Evento de nova mensagem (broadcast)
- **chat:message-deleted** - Evento de mensagem deletada (broadcast)

### REST Endpoints

#### GET /api/chat/messages (Autenticado)
Listar mensagens de chat com paginação.

**Query Parameters:**
- `limit`: Número máximo de mensagens (padrão: 100)
- `offset`: Offset para paginação (padrão: 0)
- `unitStoreId`: Filtrar por loja específica (opcional)

**Response:**
```json
{
  "messages": [...],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

#### GET /api/chat/messages/:id (Autenticado)
Buscar uma mensagem específica pelo ID.

**Response:**
```json
{
  "id": 1,
  "unitStoreId": 1,
  "senderId": 1,
  "text": "Mensagem de teste",
  "imageBase64": null,
  "imageMimeType": null,
  "createdAt": "2026-08-05T10:30:00Z",
  "sender": {...},
  "unitStore": {...}
}
```

#### POST /api/chat/messages (Autenticado)
Enviar uma nova mensagem de chat via REST.

**Body:**
```json
{
  "text": "Olá pessoal!",
  "imageBase64": "data:image/jpeg;base64,...",
  "imageMimeType": "image/jpeg",
  "unitStoreId": 1
}
```

**Response:**
```json
{
  "id": 101,
  "unitStoreId": 1,
  "senderId": 1,
  "text": "Olá pessoal!",
  "imageBase64": "...",
  "imageMimeType": "image/jpeg",
  "createdAt": "2026-08-05T10:35:00Z",
  "sender": {...},
  "unitStore": {...}
}
```

#### PUT /api/chat/messages/:id (Autenticado)
Editar uma mensagem (apenas remetente ou principal).

**Body:**
```json
{
  "text": "Mensagem editada"
}
```

**Response:**
```json
{
  "id": 1,
  "unitStoreId": 1,
  "senderId": 1,
  "text": "Mensagem editada",
  "imageBase64": null,
  "imageMimeType": null,
  "createdAt": "2026-08-05T10:30:00Z",
  "sender": {...},
  "unitStore": {...}
}
```

#### DELETE /api/chat/messages/:id (Autenticado)
Deletar uma mensagem (remetente ou principal).

**Response:**
```json
{
  "success": true,
  "message": "Mensagem deletada com sucesso"
}
```

#### GET /api/chat/search (Autenticado)
Buscar mensagens com filtros avançados.

**Query Parameters:**
- `q`: Texto de busca (busca em texto, nome do remetente e nome da loja)
- `unitStoreId`: Filtrar por loja específica
- `senderId`: Filtrar por remetente
- `dateFrom`: Data inicial (ISO format)
- `dateTo`: Data final (ISO format)
- `hasImage`: "true" para filtrar apenas mensagens com imagem
- `hasText`: "true" para filtrar apenas mensagens com texto
- `limit`: Limite de resultados (padrão: 50, máximo: 100)
- `offset`: Offset para paginação

**Response:**
```json
{
  "messages": [...],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### GET /api/chat/statistics (Autenticado)
Obter estatísticas do chat.

**Response:**
```json
{
  "statistics": {
    "totalMessages": 100,
    "messagesWithImages": 25,
    "messagesWithText": 95,
    "messagesToday": 10,
    "uniqueSenders": 5,
    "activeUnits": 3,
    "lastMessage": {
      "id": 100,
      "text": "Última mensagem",
      "sender": "João",
      "unit": "Filial Central",
      "createdAt": "2026-08-05T10:30:00Z"
    },
    "messagesByHour": [
      { "hour": 23, "count": 0 },
      { "hour": 22, "count": 0 },
      ...
      { "hour": 10, "count": 5 }
    ]
  }
}
```

## 🔐 Segurança

### Autenticação
- JWT token obrigatório
- Validação de token em cada requisição
- Timeout de sessão

### Autorização
- Usuários só veem mensagens da sua rede de lojas
- Apenas remetente ou administrador podem deletar mensagens
- Validação de permissão em cada operação

### Validação
- Tamanho máximo de imagem: 5MB
- Comprimento máximo de mensagem: Sem limite (validado no frontend)
- Tipo de arquivo: Apenas imagens (base64)

## 📁 Estrutura de Diretórios

```
src/
├── main/
│   ├── routes/
│   │   └── routes.ts               # Rotas REST
│   ├── factories/
│   │   ├── load-chat-messages.ts
│   │   ├── delete-chat-message.ts
│   │   └── get-chat-statistics.ts
│   └── realtime/
│       └── realtime-gateway.ts     # Socket.io handlers
├── presentation/
│   └── controllers/
│       └── chat-controllers/
│           ├── load-chat-messages-controller.ts
│           ├── delete-chat-message-controller.ts
│           ├── get-chat-statistics-controller.ts
│           └── index.ts
├── data/
│   └── usescases/
│       └── chat-usecases/
│           ├── save-chat-message-usecase.ts
│           ├── load-chat-messages-usecase.ts
│           ├── delete-chat-message-usecase.ts
│           └── index.ts
└── prisma/
    └── schema.prisma               # ChatMessage model
```

## 🛠️ Tecnologias

- **Socket.io** - Comunicação em tempo real
- **Express** - Framework web
- **Prisma** - ORM
- **JWT** - Autenticação
- **MySQL** - Banco de dados

## 📋 Modelos de Dados

### ChatMessage (Prisma)
```prisma
model ChatMessage {
  id            Int       @id @default(autoincrement())
  unitStoreId   Int
  senderId      Int
  text          String?
  imageBase64   String?   @db.LongText
  imageMimeType String?
  createdAt     DateTime  @default(now())
  unitStore     UnitStore @relation(fields: [unitStoreId], references: [id])
  sender        Account   @relation(fields: [senderId], references: [id])

  @@index([unitStoreId, createdAt])
}
```

## 🔄 Fluxo de Dados

### Envio de Mensagem (Socket.io)
1. Cliente emite `chat:send` com dados da mensagem
2. Server valida dados (tamanho, permissão)
3. Salva mensagem no banco
4. Emite `chat:message` para toda a rede
5. Retorna `ok: true` ao cliente

### Busca de Histórico
1. Cliente emite `chat:fetch-history`
2. Server busca últimas 100 mensagens
3. Emite `chat:history` com mensagens
4. Confirma com callback

## 📊 Performance

### Otimizações
- Índice em `(unitStoreId, createdAt)` para queries rápidas
- Paginação para não sobrecarregar o cliente
- Limite de 100 mensagens por defini ção
- Cálculo de estatísticas sob demanda

### Recomendações Futuras
- Cache de mensagens recentes
- Implementar soft delete
- Arquivar mensagens antigas
- Compressão de imagens

## 🧪 Testes

### Socket.io
```typescript
socket.emit('chat:send', {
  text: 'Teste',
  unitStoreId: 1,
}, (response) => {
  console.log(response); // { ok: true, messageId: 123 }
});
```

### REST API
```bash
# Carregar mensagens
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/chat/messages?limit=50"

# Deletar mensagem
curl -X DELETE \
  -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/chat/messages/123"

# Estatísticas
curl -H "Authorization: Bearer {token}" \
  "http://localhost:3000/api/chat/statistics"
```

## ⚠️ Tratamento de Erros

### Socket.io
- Token ausente: "Token ausente"
- Token inválido: "Token invalido"
- Mensagem vazia: "Mensagem vazia"
- Imagem grande: "Imagem excede 5MB"
- Sem permissão: "Sem permissao para enviar para essa loja"

### REST API
- 401: Não autenticado
- 403: Sem permissão
- 404: Recurso não encontrado
- 400: Requisição inválida
- 500: Erro do servidor

## 📝 Logs

Todos os eventos importantes são logados:
- Novas conexões Socket.io
- Erros de autenticação
- Mensagens enviadas
- Mensagens deletadas
- Desconexões

## 🚀 Deployment

### Variáveis de Ambiente
```env
JWT_SECRET=seu_secret_aqui
DATABASE_URL=mysql://user:pass@host/db
PORT=3000
NODE_ENV=production
```

### Escalabilidade
- Socket.io com Redis para múltiplas instâncias
- Load balancer na frente dos servidores
- Database replication para alta disponibilidade

## 📞 Suporte

Para dúvidas ou melhorias, consulte a documentação do frontend em `src/modules/chat/README.md`.

---

**Versão:** 2.0  
**Data:** Agosto 2026  
**Status:** ✅ Completo e Testado
