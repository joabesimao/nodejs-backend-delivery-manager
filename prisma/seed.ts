import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const citiesWithNeighborhoods = [
  {
    name: "Fortaleza",
    neighborhoods: [
      "Aldeota",
      "Meireles",
      "Iracema",
      "Centro",
      "Benfica",
      "Montese",
      "Damas",
      "Fátima",
      "Messejana",
      "Parangaba",
      "Bom Jardim",
      "Conjunto Ceará",
      "Granja Portugal",
      "Granja Lisboa",
      "Mondubim",
      "Siqueira",
      "Jangurussu",
      "Lagamar",
      "Pirambu",
      "Cristo Redentor",
      "Barra do Ceará",
      "Mucuripe",
      "Varjota",
      "Dionísio Torres",
      "Cocó",
      "Papicu",
      "Aerolândia",
      "Passaré",
      "Itaperi",
      "Paupina",
      "Cajazeiras",
      "Jóquei Clube",
      "Parquelândia",
      "Antônio Bezerra",
      "Presidente Kennedy",
      "Bela Vista",
      "Alagadiço",
      "Monte Castelo",
      "Quintino Cunha",
      "São Gerardo",
      "Amadeu Furtado",
      "Ellery",
      "Edson Queiroz",
      "Sapiranga",
      "Eusébio (Fortaleza)",
      "Cidade dos Funcionários",
      "Cambeba",
      "Guararapes",
      "Água Fria",
      "Floresta",
      "Henrique Jorge",
      "João XXIII",
      "Jardim América",
      "Parque Dois Irmãos",
      "Vila Velha",
      "Maraponga",
      "Manibura",
      "Pan Americano",
      "Serrinha",
      "Boa Vista",
      "Dom Lustosa",
    ],
  },
  {
    name: "Caucaia",
    neighborhoods: [
      "Centro",
      "Jurema",
      "Araturi",
      "Parque Solon de Lucena",
      "Taboleiro",
      "Novo Mondubim",
      "Catuana",
      "Iparana",
      "Pacheco",
    ],
  },
  {
    name: "Juazeiro do Norte",
    neighborhoods: [
      "Centro",
      "João Cabral",
      "Salesiano",
      "Triângulo",
      "Lagoa Seca",
      "Pirajá",
      "Franciscanos",
      "Santo Antônio",
      "São José",
      "Frei Damião",
    ],
  },
  {
    name: "Maracanaú",
    neighborhoods: [
      "Centro",
      "Conjunto Jereissati",
      "Parque Tabapuá",
      "Novo Oriente",
      "Jardim Bandeirantes",
      "São Francisco",
    ],
  },
  {
    name: "Sobral",
    neighborhoods: [
      "Centro",
      "Dom Expedito",
      "Padre Ibiapina",
      "Sumaré",
      "Terrenos Novos",
      "Cohab",
      "Junco",
    ],
  },
  {
    name: "Crato",
    neighborhoods: [
      "Centro",
      "Pimenta",
      "Seminário",
      "Lameiro",
      "Mirandão",
      "Alto da Penha",
    ],
  },
  {
    name: "Iguatu",
    neighborhoods: ["Centro", "Novo Iguatu", "Raimundo Gomes", "São Francisco"],
  },
  {
    name: "Quixadá",
    neighborhoods: ["Centro", "Açudinho", "Bom Nome", "Dinamarca"],
  },
  {
    name: "Pacatuba",
    neighborhoods: ["Centro", "Pajuçara", "Mondego", "Sítios Novos"],
  },
  {
    name: "Horizonte",
    neighborhoods: ["Centro", "Aningas", "Jardim Horizonte", "Itambé"],
  },
  {
    name: "Aquiraz",
    neighborhoods: ["Centro", "Prainha", "Porto das Dunas", "Jacaúna"],
  },
  {
    name: "Itapipoca",
    neighborhoods: ["Centro", "Planalto", "Ventura", "Santo Antônio"],
  },
  {
    name: "Maranguape",
    neighborhoods: ["Centro", "Aracapá", "Gameleira", "Sítio Olho d'Água"],
  },
  {
    name: "Barbalha",
    neighborhoods: ["Centro", "Limoeiro", "São Sebastião", "Muriti"],
  },
  {
    name: "Crateús",
    neighborhoods: ["Centro", "Betânia", "Planalto", "Nova Vida"],
  },
  {
    name: "Canindé",
    neighborhoods: ["Centro", "São Francisco", "Boa Vista", "Lagoa"],
  },
  {
    name: "Russas",
    neighborhoods: ["Centro", "Bonfim", "Várzea Alegre", "Boa Esperança"],
  },
  {
    name: "Tianguá",
    neighborhoods: ["Centro", "Fátima", "Colina", "Santa Luzia"],
  },
  {
    name: "Limoeiro do Norte",
    neighborhoods: ["Centro", "Olho d'Água", "Santo Antônio", "Lagoa Nova"],
  },
  {
    name: "Icó",
    neighborhoods: ["Centro", "Várzea", "Bom Jesus", "Penedo"],
  },
];

async function main() {
  console.log("🌱 Iniciando seed...");

  for (const cityData of citiesWithNeighborhoods) {
    const city = await prisma.city.upsert({
      where: { name: cityData.name },
      update: {},
      create: { name: cityData.name },
    });

    for (const neighborhoodName of cityData.neighborhoods) {
      const exists = await prisma.neighborhood.findFirst({
        where: { name: neighborhoodName, cityId: city.id },
      });

      if (!exists) {
        await prisma.neighborhood.create({
          data: { name: neighborhoodName, cityId: city.id },
        });
      }
    }

    console.log(
      `  ✔ ${city.name} — ${cityData.neighborhoods.length} bairros`
    );
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
