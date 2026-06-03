import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../prisma/client.js";

const router = express.Router();

// INSCREVER-SE (protegido — usa token)
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.body;

  if (!courseId) return res.status(400).json({ error: "courseId é obrigatório" });

  try {
    // Verifica se curso existe
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: "Curso não encontrado" });

    const exists = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (exists) {
      return res.status(400).json({ error: "Já inscrito neste curso" });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
      include: { course: true },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro na inscrição" });
  }
});

// MEUS CURSOS (do utilizador logado)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: { course: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar inscrições" });
  }
});

export default router;