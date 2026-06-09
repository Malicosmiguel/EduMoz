import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const res = await api.get("/enrollments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(res.data);
      } catch (err) {
        console.error("Erro ao buscar matrículas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, [token]);

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Carregando...</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ color: "#1e293b", fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>
        Meus Cursos
      </h1>

      {enrollments.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
            Você ainda não está matriculado em nenhum curso.
          </p>
          <Link
            to="/cursos"
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Ver cursos disponíveis →
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {enrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                border: "1px solid #e2e8f0",
              }}
            >
              <img
                src={enrollment.course.image}
                alt={enrollment.course.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ color: "#1e293b", fontWeight: 700, marginBottom: "0.5rem" }}>
                  {enrollment.course.title}
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem" }}>
                  {enrollment.course.category}
                </p>
                <Link
                  to={`/curso/${enrollment.course.id}`}
                  style={{
                    display: "inline-block",
                    background: "#2563eb",
                    color: "white",
                    padding: "0.6rem 1.2rem",
                    borderRadius: 8,
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  Acessar Curso
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}