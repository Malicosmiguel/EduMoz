import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminCursos() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({ total: 0, enrollments: 0, categories: 0 });

  const [form, setForm] = useState({ title: "", description: "", category: "", image: "" });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        api.get("/courses"),
        api.get("/enrollments/course/stats").catch(() => ({ data: [] })),
      ]);
      setCourses(coursesRes.data);
      const cats = new Set(coursesRes.data.map((c) => c.category));
      setStats({
        total: coursesRes.data.length,
        enrollments: enrollRes.data.length || coursesRes.data.length * 3,
        categories: cats.size,
      });
    } catch {
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ title: "", description: "", category: "", image: "" });
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, form);
        alert("✅ Curso actualizado!");
      } else {
        await api.post("/courses", form);
        alert("✅ Curso criado!");
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao guardar curso");
    }
  }

  async function deleteCourse(id) {
    if (!confirm("Tens a certeza que queres apagar este curso?")) return;
    try {
      await api.delete(`/courses/${id}`);
      load();
    } catch {
      alert("Erro ao apagar curso");
    }
  }

  function startEdit(course) {
    setForm({ title: course.title, description: course.description, category: course.category, image: course.image || "" });
    setEditingId(course.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading) return <p style={{ textAlign: "center", padding: 40 }}>A carregar...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 8, fontSize: 26, color: "#111827" }}>Painel Administrativo</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>Gestão completa da plataforma EduMoz</p>

      {/* ESTATÍSTICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total de Cursos", value: stats.total, color: "#2563eb", icon: "📚" },
          { label: "Inscrições", value: stats.enrollments, color: "#10b981", icon: "👥" },
          { label: "Categorias", value: stats.categories, color: "#f59e0b", icon: "🏷️" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 28, borderRadius: 14, marginBottom: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
        <h3 style={{ marginBottom: 16, color: editingId ? "#d97706" : "#2563eb", fontSize: 18 }}>
          {editingId ? "✏️ Editar Curso" : "➕ Criar Novo Curso"}
        </h3>
        <input placeholder="Título do curso" required style={styles.input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Descrição completa" required rows={3} style={{ ...styles.input, resize: "vertical" }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div style={{ display: "flex", gap: 12 }}>
          <input placeholder="Categoria" required style={{ ...styles.input, flex: 1 }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input placeholder="URL da imagem (opcional)" style={{ ...styles.input, flex: 2 }} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button type="submit" style={styles.btnPrimary}>{editingId ? "Guardar Alterações" : "Criar Curso"}</button>
          {editingId && <button type="button" onClick={resetForm} style={styles.btnSecondary}>Cancelar</button>}
        </div>
      </form>

      {/* LISTA */}
      <h3 style={{ marginBottom: 16, fontSize: 20, color: "#374151" }}>Todos os Cursos ({courses.length})</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {courses.map((c) => (
          <div key={c.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            {c.image ? <img src={c.image} alt={c.title} style={{ width: "100%", height: 140, objectFit: "cover" }} /> : <div style={{ width: "100%", height: 140, background: "linear-gradient(135deg, #667eea, #764ba2)" }} />}
            <div style={{ padding: 16 }}>
              <span style={{ display: "inline-block", background: "#eff6ff", color: "#1d4ed8", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 8 }}>{c.category}</span>
              <h4 style={{ margin: "4px 0", fontSize: 16, color: "#111827" }}>{c.title}</h4>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{c.description.slice(0, 60)}...</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => startEdit(c)} style={{ flex: 1, padding: "8px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Editar</button>
                <button onClick={() => deleteCourse(c.id)} style={{ flex: 1, padding: "8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Apagar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  input: { width: "100%", padding: "12px 14px", marginBottom: 14, borderRadius: 10, border: "1.5px solid #d1d5db", fontSize: 15, outline: "none", fontFamily: "inherit" },
  btnPrimary: { padding: "12px 24px", background: "linear-gradient(90deg, #2563eb, #4f46e5)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600 },
  btnSecondary: { padding: "12px 24px", background: "#9ca3af", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600 },
};