#!/bin/bash

# Script de teste para Chat API
# Substitua {token} pelo seu JWT token

BASE_URL="http://localhost:3000/api"

echo "🧪 Iniciando testes do Chat API..."

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para fazer requisições
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local token=$4
  
  echo ""
  echo -e "${YELLOW}▶ $method $endpoint${NC}"
  
  if [ -z "$data" ]; then
    response=$(curl -s -X $method \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      "$BASE_URL$endpoint")
  else
    response=$(curl -s -X $method \
      -H "Authorization: Bearer $token" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "$BASE_URL$endpoint")
  fi
  
  echo "$response" | jq '.' 2>/dev/null || echo "$response"
}

# Obter token (você precisa fazer login primeiro)
echo -e "${YELLOW}1️⃣  Faça login para obter um token${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "sua-senha"
  }' \
  "$BASE_URL/login")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}❌ Falha ao fazer login${NC}"
  echo "Resposta: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✅ Token obtido${NC}"
echo "Token: $TOKEN"

# Teste 1: Carregar mensagens
echo -e "\n${YELLOW}2️⃣  Teste: GET /chat/messages${NC}"
test_endpoint "GET" "/chat/messages?limit=10&offset=0" "" "$TOKEN"

# Teste 2: Carregar mensagens com filtro de loja
echo -e "\n${YELLOW}3️⃣  Teste: GET /chat/messages (com filtro)${NC}"
test_endpoint "GET" "/chat/messages?unitStoreId=1&limit=10" "" "$TOKEN"

# Teste 3: Obter estatísticas
echo -e "\n${YELLOW}4️⃣  Teste: GET /chat/statistics${NC}"
test_endpoint "GET" "/chat/statistics" "" "$TOKEN"

# Teste 4: Tentar deletar uma mensagem (substitua 1 pelo ID da mensagem)
echo -e "\n${YELLOW}5️⃣  Teste: DELETE /chat/messages/1${NC}"
test_endpoint "DELETE" "/chat/messages/1" "" "$TOKEN"

# Teste 5: Erro - sem autenticação
echo -e "\n${YELLOW}6️⃣  Teste: Sem autenticação${NC}"
response=$(curl -s -X GET "$BASE_URL/chat/messages")
echo "$response" | jq '.' 2>/dev/null || echo "$response"

# Teste 6: Erro - ID inválido
echo -e "\n${YELLOW}7️⃣  Teste: ID de mensagem inválido${NC}"
test_endpoint "DELETE" "/chat/messages/999999" "" "$TOKEN"

echo -e "\n${GREEN}✅ Testes concluídos${NC}"
