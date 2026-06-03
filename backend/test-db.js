import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('⏳ A testar ligação ao Supabase...')
  
  // Tenta criar um utilizador de teste
  const user = await prisma.user.create({
    data: {
      name: 'Edson Teste',
      email: `edson.${Date.now()}@edumoz.com`, // Email único usando o timestamp
      password: 'senha_criptografada_aqui',
    },
  })
  
  console.log('✅ Conexão bem-sucedida! Utilizador criado:', user)
}

main()
  .catch((e) => {
    console.error('❌ Erro ao ligar à base de dados:', e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
