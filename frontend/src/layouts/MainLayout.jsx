import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [location.pathname]); // Atualiza quando muda de página

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#f3f4f6", display: "flex", flexDirection: "column" }}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logo}>EduMoz</Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/cursos" style={styles.link}>Cursos</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              {user.role === "admin" && <Link to="/admin/cursos" style={{ ...styles.link, color: "#fbbf24", fontWeight: 700 }}>Admin</Link>}
              <span style={styles.userName}>Olá, {user.name}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Registar</Link>
            </>
          )}
        </div>
      </nav>

      {/* CONTEÚDO */}
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", padding: 24, width: "100%" }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <h3 style={styles.footerLogo}>EduMoz</h3>
            <p style={styles.footerText}>Plataforma de cursos online para Moçambique. Formação acessível e de qualidade.</p>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/cursos" style={styles.footerLink}>Cursos</Link>
            <Link to="/" style={styles.footerLink}>Sobre</Link>
            <Link to="/" style={styles.footerLink}>Contacto</Link>
            <Link to="/" style={styles.footerLink}>Termos</Link>
          </div>
          <div style={styles.footerSocial}>
            <span style={styles.socialIcon}>📧</span>
            <span style={styles.socialIcon}>💬</span>
            <span style={styles.socialIcon}>📱</span>
          </div>
        </div>
        <div style={styles.footerBottom}>© 2026 EduMoz. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 32px", background: "#0f172a", color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)", position: "sticky", top: 0, zIndex: 50,
  },
  logo: { fontSize: 24, fontWeight: 800, color: "#60a5fa", textDecoration: "none", letterSpacing: "-0.5px" },
  links: { display: "flex", gap: 20, alignItems: "center" },
  link: { color: "#cbd5e1", textDecoration: "none", fontSize: 15, fontWeight: 500, transition: "color 0.2s" },
  userName: { color: "#94a3b8", fontSize: 14, marginLeft: 8 },
  logoutBtn: {
    background: "#ef4444", color: "#fff", border: "none", padding: "8px 16px",
    borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, marginLeft: 8,
  },
  registerBtn: {
    background: "linear-gradient(90deg, #2563eb, #4f46e5)", color: "#fff", textDecoration: "none",
    padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600,
  },
  footer: {
    background: "#0f172a", color: "#94a3b8", padding: "40px 32px 20px", marginTop: "auto",
  },
  footerContent: {
    maxWidth: 1200, margin: "0 auto", display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 32, marginBottom: 24,
  },
  footerLogo: { fontSize: 20, fontWeight: 800, color: "#60a5fa", marginBottom: 8 },
  footerText: { fontSize: 14, lineHeight: 1.6, maxWidth: 280 },
  footerLinks: { display: "flex", flexDirection: "column", gap: 10 },
  footerLink: { color: "#cbd5e1", textDecoration: "none", fontSize: 14 },
  footerSocial: { display: "flex", gap: 16, fontSize: 20 },
  socialIcon: { cursor: "pointer" },
  footerBottom: {
    textAlign: "center", fontSize: 13, color: "#64748b",
    borderTop: "1px solid #1e293b", paddingTop: 20,
  },
};