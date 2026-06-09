import { Router } from "express";
import { authMiddleware, adminMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../prisma/client.js";

const router = Router();

// LISTAR TODOS OS CURSOS (público)
router.get("/", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({ orderBy: { createdAt: "desc" } });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar cursos" });
  }
});

// DETALHE DE UM CURSO (público) — CORRIGIDO: parseInt()
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id); // ← CONVERTE PARA NÚMERO
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const course = await prisma.course.findUnique({
      where: { id },
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

// EDITAR CURSO (admin only) — CORRIGIDO: parseInt()
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id); // ← CONVERTE PARA NÚMERO
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { title, description, category, image } = req.body;
    const course = await prisma.course.update({
      where: { id },
      data: { title, description, category, image },
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Erro ao actualizar curso" });
  }
});

// APAGAR CURSO (admin only) — CORRIGIDO: parseInt()
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id); // ← CONVERTE PARA NÚMERO
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Primeiro apaga inscrições para não dar erro de foreign key
    await prisma.enrollment.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });
    res.json({ message: "Curso removido com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar curso" });
  }
});

export default router;