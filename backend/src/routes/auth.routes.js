import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "edumoz-secret-key-2026";

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    // Proteção contra req.body vazio
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: "Corpo da requisição inválido. Envie JSON." });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Senha mínimo 6 caracteres" });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Email já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: email === "admin@edumoz.com" ? "admin" : "aluno",
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: "Corpo da requisição inválido. Envie JSON." });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha email e senha" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Utilizador não encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ME (verificar token)
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Sem token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
    res.json(user);
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;