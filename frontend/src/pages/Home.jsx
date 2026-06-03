import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [stats, setStats] = useState({ courses: 0, students: 0 });
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/courses");
        setStats({ courses: res.data.length, students: res.data.length * 12 + 47 });
        setFeatured(res.data.slice(0, 3));
      } catch {}
    }
    load();
  }, []);

  const categories = [
    { name: "Finanças", icon: "💰", count: 1 },
    { name: "Tecnologia", icon: "💻", count: 2 },
    { name: "Negócios", icon: "📈", count: 1 },
    { name: "Marketing", icon: "📢", count: 1 },
  ];

  return (
    <div style={{ fontFamily: "var(--sans)" }}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.badge}>🎓 Plataforma #1 em Moçambique</span>
          <h1 style={styles.heroTitle}>
            Aprenda Habilidades que<br />
            <span style={{ color: "#60a5fa" }}>Transformam a Sua Carreira</span>
          </h1>
          <p style={styles.heroText}>
            Cursos práticos de Contabilidade, Tecnologia, Empreendedorismo e Marketing.
            Aprenda no seu ritmo, onde estiver.
          </p>
          <div style={styles.heroButtons}>
            <Link to="/cursos" style={styles.btnPrimary}>Explorar Cursos</Link>
            <Link to="/register" style={styles.btnSecondary}>Criar Conta Grátis</Link>
          </div>
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{stats.courses}+</div>
              <div style={styles.statLabel}>Cursos Disponíveis</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{stats.students}+</div>
              <div style={styles.statLabel}>Alunos Inscritos</div>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.statItem}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statLabel}>Online & Grátis</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Categorias Populares</h2>
        <div style={styles.categoriesGrid}>
          {categories.map((cat) => (
            <Link to={`/cursos?cat=${cat.name}`} key={cat.name} style={styles.categoryCard}>
              <div style={styles.categoryIcon}>{cat.icon}</div>
              <h3 style={styles.categoryName}>{cat.name}</h3>
              <p style={styles.categoryCount}>{cat.count} curso{cat.count > 1 ? "s" : ""}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CURSOS EM DESTAQUE */}
      <section style={{ ...styles.section, background: "#f8fafc" }}>
        <h2 style={styles.sectionTitle}>Cursos em Destaque</h2>
        <div style={styles.coursesGrid}>
          {featured.map((course) => (
            <Link to={`/curso/${course.id}`} key={course.id} style={styles.courseCard}>
              {course.image ? (
                <img src={course.image} alt={course.title} style={styles.courseImg} />
              ) : (
                <div style={{ ...styles.courseImg, background: "linear-gradient(135deg, #667eea, #764ba2)" }} />
              )}
              <div style={styles.courseBody}>
                <span style={styles.courseBadge}>{course.category}</span>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseDesc}>{course.description.slice(0, 80)}...</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link to="/cursos" style={styles.btnPrimary}>Ver Todos os Cursos</Link>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Como Funciona</h2>
        <div style={styles.stepsGrid}>
          {[
            { step: "1", title: "Crie a sua conta", desc: "Registo rápido e gratuito em segundos." },
            { step: "2", title: "Escolha um curso", desc: "Navegue pelas categorias e inscreva-se." },
            { step: "3", title: "Aprenda no seu ritmo", desc: "Acesse o conteúdo quando quiser, onde estiver." },
            { step: "4", title: "Ganhe o seu certificado", desc: "Complete o curso e receba reconhecimento." },
          ].map((s) => (
            <div key={s.step} style={styles.stepCard}>
              <div style={styles.stepNumber}>{s.step}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
    color: "#fff",
    padding: "80px 24px 60px",
    textAlign: "center",
    borderRadius: "0 0 40px 40px",
    margin: "-24px -24px 0",
  },
  heroContent: { maxWidth: 800, margin: "0 auto" },
  badge: {
    display: "inline-block", background: "rgba(96,165,250,0.15)", color: "#60a5fa",
    padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 24,
  },
  heroTitle: { fontSize: 48, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, letterSpacing: "-1px" },
  heroText: { fontSize: 18, color: "#94a3b8", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.6 },
  heroButtons: { display: "flex", gap: 16, justifyContent: "center", marginBottom: 48 },
  btnPrimary: {
    display: "inline-block", background: "linear-gradient(90deg, #2563eb, #4f46e5)", color: "#fff",
    padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 600,
  },
  btnSecondary: {
    display: "inline-block", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.2)",
    padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontSize: 16, fontWeight: 600,
  },
  statsBar: {
    display: "flex", justifyContent: "center", alignItems: "center", gap: 40,
    background: "rgba(255,255,255,0.05)", padding: "24px 40px", borderRadius: 16,
    backdropFilter: "blur(10px)", maxWidth: 600, margin: "0 auto",
  },
  statItem: { textAlign: "center" },
  statNumber: { fontSize: 28, fontWeight: 800, color: "#60a5fa" },
  statLabel: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  statDivider: { width: 1, height: 40, background: "rgba(255,255,255,0.1)" },
  section: { padding: "64px 24px", maxWidth: 1200, margin: "0 auto" },
  sectionTitle: { fontSize: 32, fontWeight: 700, textAlign: "center", marginBottom: 40, color: "#111827" },
  categoriesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 },
  categoryCard: {
    background: "#fff", padding: 32, borderRadius: 16, textAlign: "center",
    textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
    transition: "transform 0.2s", cursor: "pointer",
  },
  categoryIcon: { fontSize: 40, marginBottom: 12 },
  categoryName: { fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 4 },
  categoryCount: { fontSize: 14, color: "#6b7280" },
  coursesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 },
  courseCard: {
    background: "#fff", borderRadius: 16, overflow: "hidden", textDecoration: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column",
  },
  courseImg: { width: "100%", height: 180, objectFit: "cover" },
  courseBody: { padding: 20, flex: 1 },
  courseBadge: {
    display: "inline-block", background: "#eff6ff", color: "#1d4ed8",
    padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 10,
  },
  courseTitle: { fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 },
  courseDesc: { fontSize: 14, color: "#6b7280", lineHeight: 1.5 },
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 },
  stepCard: { textAlign: "center", padding: 24 },
  stepNumber: {
    width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, fontWeight: 800, margin: "0 auto 16px",
  },
  stepTitle: { fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 },
  stepDesc: { fontSize: 14, color: "#6b7280", lineHeight: 1.5 },
};