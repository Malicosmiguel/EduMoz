import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../prisma/client.js";

const router = Router();

// LISTAR TODOS OS CURSOS (público — qualquer um pode ver)
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { createdAt: "desc" } });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar cursos" });
  }
});

// DETALHE DE UM CURSO (público)
router.get("/:id", async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
    });
    if (!course) return res.status(404).json({ error: "Curso não encontrado" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar curso" });
  }
});

// CRIAR CURSO (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, category, image } = req.body;
  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        category: category || "Geral",
        image: image || "",
      },
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar curso" });
  }
});

// EDITAR CURSO (admin only) — ESTAVA A FALTAR!
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { title, description, category, image } = req.body;
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { title, description, category, image },
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Erro ao actualizar curso" });
  }
});

// APAGAR CURSO (admin only) — ESTAVA A FALTAR!
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Primeiro apaga inscrições para não dar erro de foreign key
    await prisma.enrollment.deleteMany({ where: { courseId: req.params.id } });
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ message: "Curso removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar curso" });
  }
});

export default router;