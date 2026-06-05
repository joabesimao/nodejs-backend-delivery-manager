import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialClients = [
  {
    client: { name: "Joao", lastName: "Silva", phone: "85999990001" },
    address: {
      street: "Rua das Flores",
      neighborhood: "Centro",
      numberHouse: 120,
      reference: "Proximo a praca",
      city: "Cidade Exemplo",
    },
  },
  {
    client: { name: "Maria", lastName: "Alves", phone: "85999990002" },
    address: {
      street: "Av. Principal",
      neighborhood: "Nova Esperanca",
      numberHouse: 45,
      reference: "Casa azul",
      city: "Cidade Exemplo",
    },
  },
  {
    client: { name: "Carlos", lastName: "Lima", phone: "85999990003" },
    address: {
      street: "Rua do Sol",
      neighborhood: "Sao Jose",
      numberHouse: 78,
      reference: "Apto 301",
      city: "Nova Cidade",
    },
  },
];

const initialOrders = [
  { phone: "85999990001", quantity: "3", amount: 48.5, daysAgo: 6, status: "finished" },
  { phone: "85999990001", quantity: "2", amount: 31.9, daysAgo: 4, status: "delivered" },
  { phone: "85999990002", quantity: "1", amount: 15, daysAgo: 3, status: "finished" },
  { phone: "85999990002", quantity: "5", amount: 82, daysAgo: 2, status: "actived" },
  { phone: "85999990003", quantity: "4", amount: 67.2, daysAgo: 1, status: "finished" },
] as const;

async function main() {
  console.log("🌱 Iniciando seed...");

  for (const entry of initialClients) {
    const existingClient = await prisma.client.findFirst({
      where: { phone: entry.client.phone },
      include: {
        Register: true,
      },
    });

    if (!existingClient?.Register?.id) {
      await prisma.register.create({
        data: {
          client: {
            create: {
              name: entry.client.name,
              lastName: entry.client.lastName,
              phone: entry.client.phone,
            },
          },
          address: {
            create: {
              street: entry.address.street,
              neighborhood: entry.address.neighborhood,
              numberHouse: entry.address.numberHouse,
              reference: entry.address.reference,
              city: entry.address.city,
            },
          },
        },
      });
    }
  }

  const existingOrdersCount = await prisma.orderDelivery.count();

  if (existingOrdersCount === 0) {
    for (const order of initialOrders) {
    const register = await prisma.register.findFirst({
      where: {
        client: {
          phone: order.phone,
        },
      },
    });

      if (!register) {
        continue;
      }

      const date = new Date();
      date.setDate(date.getDate() - order.daysAgo);

      await prisma.orderDelivery.create({
        data: {
          registerId: register.id,
          quantity: order.quantity,
          amount: order.amount,
          data: date,
          status: order.status,
        },
      });
    }
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
