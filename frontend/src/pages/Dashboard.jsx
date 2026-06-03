import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCert, setShowCert] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/enrollments/me");
        setEnrollments(res.data);
      } catch {
        setError("Não foi possível carregar as inscrições.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function generateCertificate(course) {
    setShowCert({ course, date: new Date().toLocaleDateString("pt-MZ") });
  }

  if (loading) return <p style={{ textAlign: "center", padding: 40 }}>A carregar...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 8, fontSize: 28, color: "#111827" }}>Meus Cursos</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>Bem-vindo, {user.name || "Aluno"}! Aqui está o teu progresso.</p>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 16, borderRadius: 10, marginBottom: 20 }}>{error}</div>
      )}

      {enrollments.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 18, color: "#374151", marginBottom: 16 }}>Ainda não estás inscrito em nenhum curso.</p>
          <a href="/cursos" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none", fontSize: 16 }}>Explorar cursos →</a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {enrollments.map((item) => (
            <div key={item.id} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              {item.course.image ? (
                <img src={item.course.image} alt={item.course.title} style={{ width: "100%", height: 160, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 160, background: "linear-gradient(135deg, #667eea, #764ba2)" }} />
              )}
              <div style={{ padding: 24 }}>
                <span style={{ display: "inline-block", background: "#dbeafe", color: "#1e40af", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                  {item.course.category}
                </span>
                <h3 style={{ marginBottom: 8, color: "#111827", fontSize: 20 }}>{item.course.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                  {item.course.description.slice(0, 100)}...
                </p>

                {/* BARRA DE PROGRESSO (mock) */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
                    <span>Progresso</span>
                    <span>33%</span>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "#e5e7eb", borderRadius: 4 }}>
                    <div style={{ width: "33%", height: "100%", background: "linear-gradient(90deg, #2563eb, #4f46e5)", borderRadius: 4 }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ flex: 1, padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                    ▶ Continuar
                  </button>
                  <button
                    onClick={() => generateCertificate(item.course)}
                    style={{ flex: 1, padding: "10px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
                  >
                    🏆 Certificado
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CERTIFICADO */}
      {showCert && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }} onClick={() => setShowCert(null)}>
          <div style={{ background: "#fff", padding: 48, borderRadius: 16, maxWidth: 700, width: "100%", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ border: "4px solid #fbbf24", padding: 40, borderRadius: 12 }}>
              <div style={{ fontSize: 14, color: "#6b7280", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Certificado de Conclusão</div>
              <h2 style={{ fontSize: 32, color: "#111827", marginBottom: 8 }}>EduMoz</h2>
              <p style={{ fontSize: 18, color: "#6b7280", marginBottom: 24 }}>Certifica que</p>
              <h1 style={{ fontSize: 36, color: "#2563eb", marginBottom: 16, fontFamily: "Georgia, serif" }}>{user.name}</h1>
              <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>completou com sucesso o curso</p>
              <h3 style={{ fontSize: 24, color: "#111827", marginBottom: 24 }}>{showCert.course.title}</h3>
              <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 32, borderTop: "1px solid #e5e7eb", paddingTop: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Data</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{showCert.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>Categoria</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{showCert.course.category}</div>
                </div>
              </div>
            </div>
            <button onClick={() => window.print()} style={{ marginTop: 24, padding: "10px 24px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
              🖨️ Imprimir / Guardar PDF
            </button>
            <button onClick={() => setShowCert(null)} style={{ marginTop: 12, padding: "10px 24px", background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", marginLeft: 10 }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}