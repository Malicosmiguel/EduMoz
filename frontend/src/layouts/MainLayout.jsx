import { Outlet, Link, useNavigate } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
  const navigate = useNavigate();
  
  // Busca usuário do localStorage (onde o Login.jsx salva)
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload(); // recarrega para atualizar o menu
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <Link to="/">EduMoz</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Início</Link></li>
          <li><Link to="/cursos">Cursos</Link></li>
          
          {user ? (
            <>
              <li className="user-name">Olá, {user.name?.split(" ")[0]}</li>
              <li><Link to="/dashboard">Meu Painel</Link></li>
              {isAdmin && (
                <li>
                  <Link to="/admin/cursos" style={{ color: "#f59e0b", fontWeight: "bold" }}>
                    ⚙️ Admin
                  </Link>
                </li>
              )}
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Sair
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Entrar</Link></li>
              <li>
                <Link to="/register" className="highlight">Cadastrar</Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© EduMoz Plataforma de Cursos. Projeto de Programação Web.</p>
      </footer>
    </div>
  );
}