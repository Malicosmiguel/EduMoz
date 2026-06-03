import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CursoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Módulos mock (apresentação académica)
  const modules = [
    { title: "Módulo 1: Introdução", lessons: ["Aula 1: Apresentação", "Aula 2: Conceitos Básicos", "Aula 3: Configuração do Ambiente"] },
    { title: "Módulo 2: Fundamentos", lessons: ["Aula 4: Primeiros Passos", "Aula 5: Exercícios Práticos", "Aula 6: Revisão"] },
    { title: "Módulo 3: Avançado", lessons: ["Aula 7: Técnicas Avançadas", "Aula 8: Projeto Final", "Aula 9: Avaliação"] },
  ];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
        // Verifica se já está inscrito
        if (user) {
          const enrollRes = await api.get("/enrollments/me");
          const isEnrolled = enrollRes.data.some((e) => e.courseId === id);
          setEnrolled(isEnrolled);
        }
      } catch {
        alert("Curso não encontrado");
        navigate("/cursos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate, user]);

  async function handleEnroll() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/enrollments", { courseId: id });
      setEnrolled(true);
      alert("✅ Inscrito com sucesso!");
    } catch (err) {
      alert(err.response?.data?.error || "Erro na inscrição");
    }
  }

  if (loading) return <p style={{ textAlign: "center", padding: 60 }}>A carregar...</p>;
  if (!course) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={styles.header}>
        {course.image ? (
          <img src={course.image} alt={course.title} style={styles.headerImg} />
        ) : (
          <div style={{ ...styles.headerImg, background: "linear-gradient(135deg, #667eea, #764ba2)" }} />
        )}
        <div style={styles.headerOverlay}>
          <span style={styles.headerBadge}>{course.category}</span>
          <h1 style={styles.headerTitle}>{course.title}</h1>
          <p style={styles.headerDesc}>{course.description}</p>
          <div style={styles.headerMeta}>
            <span>📚 3 módulos</span>
            <span>•</span>
            <span>🎥 9 aulas</span>
            <span>•</span>
            <span>⏱️ 4 horas</span>
          </div>
          {enrolled ? (
            <div style={styles.enrolledBadge}>✅ Já estás inscrito neste curso</div>
          ) : (
            <button onClick={handleEnroll} style={styles.enrollBtn}>
              Inscrever-se Agora — Grátis
            </button>
          )}
        </div>
      </div>

      {/* CONTEÚDO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, marginTop: 32 }}>
        {/* MÓDULOS */}
        <div>
          <h2 style={styles.sectionTitle}>Conteúdo do Curso</h2>
          {modules.map((mod, i) => (
            <div key={i} style={styles.moduleCard}>
              <h3 style={styles.moduleTitle}>{mod.title}</h3>
              <div style={styles.lessonsList}>
                {mod.lessons.map((lesson, j) => (
                  <div key={j} style={styles.lessonItem}>
                    <span style={styles.lessonIcon}>▶</span>
                    <span style={styles.lessonText}>{lesson}</span>
                    <span style={styles.lessonTime}>15 min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>👨‍🏫 Instructor</h3>
            <div style={styles.instructor}>
              <div style={styles.instructorAvatar}>MZ</div>
              <div>
                <div style={styles.instructorName}>Equipa EduMoz</div>
                <div style={styles.instructorRole}>Especialistas em {course.category}</div>
              </div>
            </div>
          </div>
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>🎯 O que vais aprender</h3>
            <ul style={styles.benefitsList}>
              <li>✓ Conceitos fundamentais de {course.category}</li>
              <li>✓ Prática com projetos reais</li>
              <li>✓ Certificado de conclusão</li>
              <li>✓ Acesso vitalício ao conteúdo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { position: "relative", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
  headerImg: { width: "100%", height: 320, objectFit: "cover" },
  headerOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
    padding: "60px 40px 40px", color: "#fff",
  },
  headerBadge: {
    display: "inline-block", background: "rgba(96,165,250,0.2)", color: "#60a5fa",
    padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12,
  },
  headerTitle: { fontSize: 36, fontWeight: 800, marginBottom: 12 },
  headerDesc: { fontSize: 16, color: "#cbd5e1", maxWidth: 600, lineHeight: 1.5, marginBottom: 16 },
  headerMeta: { display: "flex", gap: 12, fontSize: 14, color: "#94a3b8", marginBottom: 20 },
  enrollBtn: {
    background: "linear-gradient(90deg, #2563eb, #4f46e5)", color: "#fff", border: "none",
    padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer",
  },
  enrolledBadge: {
    display: "inline-block", background: "#10b981", color: "#fff",
    padding: "12px 24px", borderRadius: 12, fontWeight: 600,
  },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: "#111827", marginBottom: 20 },
  moduleCard: {
    background: "#fff", borderRadius: 12, padding: 24, marginBottom: 16,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
  },
  moduleTitle: { fontSize: 16, fontWeight: 700, color: "#1e40af", marginBottom: 12 },
  lessonsList: { display: "flex", flexDirection: "column", gap: 10 },
  lessonItem: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, background: "#f8fafc" },
  lessonIcon: { color: "#2563eb", fontSize: 12 },
  lessonText: { flex: 1, fontSize: 14, color: "#374151" },
  lessonTime: { fontSize: 12, color: "#9ca3af" },
  sidebar: { display: "flex", flexDirection: "column", gap: 20 },
  sidebarCard: { background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  sidebarTitle: { fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 16 },
  instructor: { display: "flex", alignItems: "center", gap: 12 },
  instructorAvatar: {
    width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16,
  },
  instructorName: { fontWeight: 600, color: "#111827" },
  instructorRole: { fontSize: 13, color: "#6b7280" },
  benefitsList: { display: "flex", flexDirection: "column", gap: 10, padding: 0, listStyle: "none" },
  benefitsListItem: { fontSize: 14, color: "#374151", display: "flex", alignItems: "center", gap: 8 },
};