import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // ← IMPORTA O api.js

export default function Cursos() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get("/courses"); // ← USA api.js (VITE_API_URL)
        const data = res.data;
        console.log("Dados recebidos:", data);
        
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("Resposta inválida do servidor");
        }
      } catch (err) {
        console.error("Erro:", err);
        setError("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Carregando cursos...</div>;

  if (error) return <div style={{ textAlign: "center", padding: "3rem", color: "red" }}>{error}</div>;

  if (courses.length === 0) return <div style={{ textAlign: "center", padding: "3rem" }}>Nenhum curso disponível.</div>;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <div style={{ textAlign: "center", padding: "3rem 2rem", background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)", color: "white", borderRadius: 16, marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800 }}>Catálogo de Cursos</h1>
        <p>Explore todos os cursos disponíveis em nossa plataforma</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {courses.map((course) => (
          <div key={course.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
            <img src={course.image} alt={course.title} style={{ width: "100%", height: 200, objectFit: "cover" }} />
            <div style={{ padding: "1.5rem" }}>
              <h3 style={{ color: "#1e293b", fontWeight: 700 }}>{course.title}</h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{course.category}</p>
              <Link to={`/curso/${course.id}`} style={{ display: "inline-block", background: "#2563eb", color: "white", padding: "0.75rem 1.5rem", borderRadius: 8, textDecoration: "none", fontWeight: 700, marginTop: "1rem" }}>
                Ver Curso
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}