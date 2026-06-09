import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "edumoz-secret-key-2026";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role, name: decoded.name };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
  next();
}