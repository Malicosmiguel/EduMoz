import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('edutech_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.id) setUser(parsed);
      } catch {
        localStorage.removeItem('edutech_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('edutech_users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('edutech_user', JSON.stringify(foundUser));
      return { success: true };
    }
    return { success: false, message: 'E-mail ou senha incorretos' };
  };

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('edutech_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'E-mail já cadastrado' };
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: email === 'admin@edutech.com' ? 'admin' : 'student',
      enrolledCourses: []
    };

    users.push(newUser);
    localStorage.setItem('edutech_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('edutech_user', JSON.stringify(newUser));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edutech_user');
  };

  const enrollCourse = (courseId) => {
    if (!user) return { success: false, message: 'Faça login para se matricular' };
    
    if (user.enrolledCourses.includes(courseId)) {
      return { success: false, message: 'Você já está matriculado neste curso' };
    }

    const updatedUser = {
      ...user,
      enrolledCourses: [...user.enrolledCourses, courseId]
    };

    setUser(updatedUser);
    localStorage.setItem('edutech_user', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('edutech_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('edutech_users', JSON.stringify(users));
    }

    return { success: true, message: 'Matrícula realizada com sucesso!' };
  };

  const isEnrolled = (courseId) => {
    return user?.enrolledCourses?.includes(courseId) || false;
  };

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, register, logout, enrollCourse, isEnrolled }}>
      {children}
    </AuthContext.Provider>
  );
}