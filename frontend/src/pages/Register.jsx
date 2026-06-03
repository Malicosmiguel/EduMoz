import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      alert("Conta criada! Agora faz login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>EduMoz</div>
        <p style={styles.subtitle}>Começa a tua jornada de aprendizagem</p>

        <h2 style={styles.title}>Criar conta</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome completo</label>
            <input
              placeholder="Edson Zua"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="edson@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "A criar..." : "Criar conta gratuita"}
          </button>
        </form>

        <p style={styles.footer}>
          Já tens conta? <Link to="/login" style={styles.link}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    padding: 20,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "48px 40px",
    borderRadius: 20,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    textAlign: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: "#059669",
    letterSpacing: "-1px",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 20,
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    border: "2px solid #e5e7eb",
    borderRadius: 12,
    outline: "none",
    transition: "all 0.2s ease",
    background: "#f9fafb",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    MozAppearance: "none",
    appearance: "none",
  },
  btn: {
    width: "100%",
    padding: "14px",
    marginTop: 8,
    background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  footer: {
    marginTop: 24,
    fontSize: 14,
    color: "#6b7280",
  },
  link: {
    color: "#059669",
    fontWeight: "600",
    textDecoration: "none",
  },
};