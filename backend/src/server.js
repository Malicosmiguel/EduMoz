import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import prisma from "./prisma/client.js";

const app = express();

// CORS antes de tudo
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// JSON parser - ESSENCIAL para req.body funcionar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROTAS
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.get("/", (req, res) => {
  res.send("API EduMoz a funcionar");
});

// Seed inicial
async function seed() {
  try {
    const count = await prisma.course.count();
    if (count === 0) {
      const coursesData = [
        {
          title: "Contabilidade para Empresas",
          description: "Aprenda contabilidade prática aplicada ao contexto empresarial moçambicano. Gestão de facturas, impostos e balancetes.",
          category: "Finanças",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
        },
        {
          title: "Programação Web Moderna",
          description: "HTML, CSS, JavaScript e React. Construa aplicações web profissionais do zero até ao deploy.",
          category: "Tecnologia",
          image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
        },
        {
          title: "Empreendedorismo e Gestão",
          description: "Como criar, planear e gerir o seu próprio negócio em Moçambique. Modelos de negócio e financiamento.",
          category: "Negócios",
          image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
        },
        {
          title: "Microsoft Excel Avançado",
          description: "Domine fórmulas complexas, tabelas dinâmicas, dashboards e automação com macros para o mercado de trabalho.",
          category: "Tecnologia",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
        },
        {
          title: "Marketing Digital e Redes Sociais",
          description: "Estratégias de marketing digital, gestão de redes sociais, SEO e publicidade online para pequenas empresas.",
          category: "Marketing",
          image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&q=80",
        },
      ];

      for (const data of coursesData) {
        await prisma.course.create({ data });
      }

      console.log("✅ 5 cursos de seed criados com sucesso!");
    } else {
      console.log(`ℹ️ Seed ignorado — já existem ${count} cursos na BD.`);
    }
  } catch (err) {
    console.error("❌ Erro no seed:", err.message);
  }
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor a correr na porta ${PORT}`);
  await seed();
});