import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // ← IMPORTA O api.js

export default function CursoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Buscar curso da API
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await api.get(`/courses/${id}`); // ← USA api.js
        const data = res.data;
        console.log("Curso recebido:", data);

        if (data.error || !data.id) {
          setCourse(null);
        } else {
          setCourse(data);
        }
      } catch (err) {
        console.error("Erro ao buscar curso:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  async function handleEnroll() {
    if (!token) {
      navigate("/login");
      return;
    }

    setEnrolling(true);
    setMessage("");

    try {
      const res = await api.post("/enrollments", { courseId: parseInt(id) }); // ← USA api.js
      const data = res.data;
      console.log("Resposta matrícula:", data);

      if (data.error) {
        setMessage("❌ " + data.error);
      } else {
        setMessage("✅ Matrícula realizada com sucesso!");
      }
    } catch (err) {
      setMessage("❌ Erro ao conectar com o servidor");
    } finally {
      setEnrolling(false);
    }
  }

  if (loading) {
    return <div style={{ textAlign: "center", padding: "3rem" }}>Carregando...</div>;
  }

  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Curso não encontrado.</h2>
        <button
          onClick={() => navigate("/cursos")}
          style={{
            marginTop: "1rem",
            padding: "0.8rem 1.5rem",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Ver todos os cursos
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "transparent",
          border: "2px solid #e2e8f0",
          padding: "0.5rem 1rem",
          borderRadius: 8,
          cursor: "pointer",
          marginBottom: "1.5rem",
          fontWeight: 600,
        }}
      >
        ← Voltar
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <img
          src={course.image}
          alt={course.title}
          style={{ width: "100%", borderRadius: 16, boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
        />

        <div>
          <h1 style={{ color: "#1e293b", fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {course.title}
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem", marginBottom: "1rem" }}>
            {course.category}
          </p>

          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "0.4rem 1rem", borderRadius: 20, fontSize: "0.85rem", fontWeight: 600 }}>
              40 horas
            </span>
            <span style={{ background: "#f0fdf4", color: "#166534", padding: "0.4rem 1rem", borderRadius: 20, fontSize: "0.85rem", fontWeight: 600 }}>
              {course.category}
            </span>
          </div>

          {message && (
            <div style={{ padding: "1rem", borderRadius: 8, marginBottom: "1rem", fontWeight: 600, background: message.includes("sucesso") ? "#d1fae5" : "#fee2e2", color: message.includes("sucesso") ? "#065f46" : "#991b1b" }}>
              {message}
            </div>
          )}

          <button
            onClick={handleEnroll}
            disabled={enrolling}
            style={{
              width: "100%",
              padding: "1rem",
              background: "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: "1.1rem",
              fontWeight: 700,
              cursor: enrolling ? "not-allowed" : "pointer",
              opacity: enrolling ? 0.7 : 1,
            }}
          >
            {enrolling ? "Processando..." : token ? "Matricular-se Agora" : "Faça login para se matricular"}
          </button>
        </div>
      </div>

      <div style={{ background: "white", padding: "2rem", borderRadius: 16, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
        <h3 style={{ color: "#1e293b", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
          Sobre o curso
        </h3>
        <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          {course.description}
        </p>

        <h3 style={{ color: "#1e293b", fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>
          O que você vai aprender
        </h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {["Conteúdo prático", "Exercícios reais", "Certificado de conclusão"].map((topic, index) => (
            <li key={index} style={{ padding: "0.6rem 0", paddingLeft: "1.8rem", position: "relative", color: "#475569" }}>
              <span style={{ position: "absolute", left: 0, color: "#059669", fontWeight: "bold" }}>✓</span>
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}