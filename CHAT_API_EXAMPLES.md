# Exemplos de Testes - Chat Backend

## 🔐 Autenticação

### 1. Login
```bash
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "sua-senha"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "seu@email.com",
    "role": "principal"
  }
}
```

## 📨 Chat - Endpoints REST

### 2. Listar Mensagens
```bash
GET http://localhost:3000/api/chat/messages?limit=50&offset=0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Response:
{
  "messages": [
    {
      "id": 1,
      "unitStoreId": 1,
      "senderId": 1,
      "text": "Olá pessoal!",
      "imageBase64": null,
      "imageMimeType": null,
      "createdAt": "2026-08-05T10:30:00.000Z",
      "sender": {
        "id": 1,
        "name": "João Silva",
        "email": "joao@example.com",
        "role": "principal",
        "unitStoreId": 1
      },
      "unitStore": {
        "id": 1,
        "name": "Loja Central"
      }
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### 2b. Buscar uma Mensagem Específica
```bash
GET http://localhost:3000/api/chat/messages/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Response:
{
  "id": 1,
  "unitStoreId": 1,
  "senderId": 1,
  "text": "Olá pessoal!",
  "imageBase64": null,
  "imageMimeType": null,
  "createdAt": "2026-08-05T10:30:00.000Z",
  "sender": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "principal",
    "unitStoreId": 1
  },
  "unitStore": {
    "id": 1,
    "name": "Loja Central"
  }
}
```

### 2c. Enviar Mensagem via REST
```bash
POST http://localhost:3000/api/chat/messages
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "text": "Olá pessoal!",
  "imageBase64": null,
  "imageMimeType": null,
  "unitStoreId": 1
}

Response (201 Created):
{
  "id": 101,
  "unitStoreId": 1,
  "senderId": 1,
  "text": "Olá pessoal!",
  "imageBase64": null,
  "imageMimeType": null,
  "createdAt": "2026-08-05T10:45:00.000Z",
  "sender": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "principal",
    "unitStoreId": 1
  },
  "unitStore": {
    "id": 1,
    "name": "Loja Central"
  }
}
```

### 2d. Editar Mensagem
```bash
PUT http://localhost:3000/api/chat/messages/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "text": "Olá pessoal! (editado)"
}

Response:
{
  "id": 1,
  "unitStoreId": 1,
  "senderId": 1,
  "text": "Olá pessoal! (editado)",
  "imageBase64": null,
  "imageMimeType": null,
  "createdAt": "2026-08-05T10:30:00.000Z",
  "sender": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "principal",
    "unitStoreId": 1
  },
  "unitStore": {
    "id": 1,
    "name": "Loja Central"
  }
}
```

### 2e. Buscar com Filtros Avançados
```bash
GET http://localhost:3000/api/chat/search?q=teste&unitStoreId=1&limit=25
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Response:
{
  "messages": [...],
  "pagination": {
    "total": 5,
    "limit": 25,
    "offset": 0,
    "hasMore": false
  }
}
```

### 2f. Deletar Mensagem
```bash
DELETE http://localhost:3000/api/chat/messages/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Response:
{
  "success": true,
  "message": "Mensagem deletada com sucesso"
}

Error (não é proprietário):
{
  "error": "Sem permissão para deletar esta mensagem",
  "statusCode": 403
}

Error (mensagem não existe):
{
  "error": "Mensagem não encontrada",
  "statusCode": 404
}
```

### 3. Obter Estatísticas do Chat
```bash
GET http://localhost:3000/api/chat/statistics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

Response:
{
  "statistics": {
    "totalMessages": 150,
    "messagesWithImages": 32,
    "messagesWithText": 148,
    "messagesToday": 15,
    "uniqueSenders": 8,
    "activeUnits": 4,
    "lastMessage": {
      "id": 150,
      "text": "Última mensagem enviada",
      "sender": "João Silva",
      "unit": "Loja Central",
      "createdAt": "2026-08-05T10:45:00.000Z"
    },
    "messagesByHour": [
      {
        "hour": 0,
        "count": 0
      },
      {
        "hour": 1,
        "count": 0
      },
      ...
      {
        "hour": 10,
        "count": 5
      },
      {
        "hour": 11,
        "count": 8
      }
    ]
  }
}
```

## 🔌 Chat - Socket.io Events

### 6. Enviar Mensagem (Socket.io)
```javascript
// Cliente (Frontend)
socket.emit('chat:send', {
  text: 'Olá pessoal!',
  unitStoreId: 1,
  imageBase64: null,
  imageMimeType: null
}, (response) => {
  if (response.ok) {
    console.log('Mensagem enviada! ID:', response.messageId);
  } else {
    console.error('Erro:', response.error);
  }
});

// Server responde com
{
  "ok": true,
  "messageId": 151
}

// E faz broadcast
{
  "event": "chat:message",
  "data": {
    "id": 151,
    "unitStoreId": 1,
    "senderId": 1,
    "text": "Olá pessoal!",
    "imageBase64": null,
    "imageMimeType": null,
    "createdAt": "2026-08-05T10:50:00.000Z",
    "sender": {
      "id": 1,
      "name": "João Silva",
      "email": "joao@example.com",
      "role": "principal",
      "unitStoreId": 1
    },
    "unitStore": {
      "id": 1,
      "name": "Loja Central"
    }
  }
}
```

### 7. Buscar Histórico (Socket.io)
```javascript
// Cliente (Frontend)
socket.emit('chat:fetch-history', (response) => {
  console.log('Histórico carregado:', response);
});

// Server responde com
{
  "ok": true
}

// E emite o histórico
{
  "event": "chat:history",
  "data": [
    // Array com todas as mensagens
  ]
}
```

### 8. Deletar Mensagem (Socket.io)
```javascript
// Cliente (Frontend)
socket.emit('chat:delete-message', {
  messageId: 1
}, (response) => {
  if (response.ok) {
    console.log('Mensagem deletada!');
  } else {
    console.error('Erro:', response.error);
  }
});

// Server responde com
{
  "ok": true
}

// E faz broadcast
{
  "event": "chat:message-deleted",
  "data": {
    "messageId": 1
  }
}
```

## ⚠️ Casos de Erro

### 401 - Não Autenticado
```json
{
  "error": "Não autenticado",
  "statusCode": 401
}
```

### 403 - Sem Permissão
```json
{
  "error": "Sem permissão para deletar esta mensagem",
  "statusCode": 403
}
```

### 404 - Mensagem não Encontrada
```json
{
  "error": "Mensagem não encontrada",
  "statusCode": 404
}
```

### 400 - Requisição Inválida
```json
{
  "error": "ID de mensagem inválido",
  "statusCode": 400
}
```

### 500 - Erro do Servidor
```json
{
  "error": "Falha ao carregar mensagens",
  "statusCode": 500
}
```

## 🧪 Usando Postman

1. **Crie uma variável de ambiente:**
   - `base_url`: http://localhost:3000/api
   - `token`: (coloque o token após fazer login)

2. **Importe as requisições:**
   - Login
   - GET /chat/messages
   - GET /chat/messages com filtro
   - GET /chat/statistics
   - DELETE /chat/messages/:id

3. **Configure o token automaticamente:**
   ```
   Em "Login" > "Tests", adicione:
   var jsonData = pm.response.json();
   pm.environment.set("token", jsonData.token);
   ```

## 📱 Usando Insomnia

1. **Crie um workspace**
2. **Importe o seguinte JSON:**
   ```json
   {
     "url": "{{ BASE_URL }}/chat/messages",
     "method": "GET",
     "headers": {
       "Authorization": "Bearer {{ TOKEN }}",
       "Content-Type": "application/json"
     }
   }
   ```

---

**Versão:** 2.0  
**Data:** Agosto 2026  
**Status:** ✅ Pronto para Testes
