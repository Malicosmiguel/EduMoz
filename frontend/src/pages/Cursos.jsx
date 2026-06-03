import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Cursos() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Todos");
  const [myEnrollments, setMyEnrollments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const categories = ["Todos", "Finanças", "Tecnologia", "Negócios", "Marketing"];

  useEffect(() => {
    async function load() {
      try {
        const [coursesRes, enrollRes] = await Promise.all([
          api.get("/courses"),
          user ? api.get("/enrollments/me") : Promise.resolve({ data: [] }),
        ]);
        setCourses(coursesRes.data);
        setFiltered(coursesRes.data);
        setMyEnrollments(enrollRes.data.map((e) => e.courseId));
      } catch {
        setMsg("Erro ao carregar cursos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    let result = courses;
    if (activeCat !== "Todos") {
      result = result.filter((c) => c.category === activeCat);
    }
    if (search) {
      result = result.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [search, activeCat, courses]);

  async function enroll(courseId, e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/enrollments", { courseId });
      setMyEnrollments((prev) => [...prev, courseId]);
      setMsg("✅ Inscrito com sucesso! Vai ao Dashboard.");
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      alert(err.response?.data?.error || "Erro na inscrição");
    }
  }

  if (loading) return <p style={{ textAlign: "center", padding: 40 }}>A carregar cursos...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: 8, fontSize: 28, color: "#111827" }}>Cursos Disponíveis</h2>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>Escolha um curso e comece a aprender hoje</p>

      {msg && (
        <div style={{ background: "#d1fae5", color: "#065f46", padding: "14px 18px", borderRadius: 10, marginBottom: 20, fontWeight: 500 }}>
          {msg}
        </div>
      )}

      {/* FILTROS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="🔍 Buscar curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: "12px 16px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 15, outline: "none" }}
        />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            style={{
              padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: activeCat === cat ? "linear-gradient(90deg, #2563eb, #4f46e5)" : "#f1f5f9",
              color: activeCat === cat ? "#fff" : "#374151",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>Nenhum curso encontrado.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filtered.map((course) => {
            const isEnrolled = myEnrollments.includes(course.id);
            return (
              <Link to={`/curso/${course.id}`} key={course.id} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", height: "100%" }}>
                  {course.image ? (
                    <img src={course.image} alt={course.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: 180, background: "linear-gradient(135deg, #667eea, #764ba2)" }} />
                  )}
                  <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ display: "inline-block", alignSelf: "flex-start", background: "#eff6ff", color: "#1d4ed8", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                      {course.category}
                    </span>
                    <h3 style={{ marginBottom: 10, fontSize: 20, color: "#111827" }}>{course.title}</h3>
                    <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                      {course.description.slice(0, 100)}...
                    </p>
                    {isEnrolled ? (
                      <div style={{ padding: "10px", background: "#d1fae5", color: "#065f46", borderRadius: 10, textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                        ✅ Já inscrito
                      </div>
                    ) : (
                      <button
                        onClick={(e) => enroll(course.id, e)}
                        style={{
                          width: "100%", padding: "12px", background: "linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)",
                          color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 600,
                        }}
                      >
                        Inscrever-se agora
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}