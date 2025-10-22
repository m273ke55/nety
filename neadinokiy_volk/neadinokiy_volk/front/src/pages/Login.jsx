import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/login", { username, password });
      localStorage.setItem("token", res.access_token);
      navigate("/feed");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Неверное имя пользователя или пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="form-container fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Добро пожаловать!
          </h1>
          <p className="text-gray-600">
            Войдите в свой аккаунт для поиска новых знакомств
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label">
              Пароль
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-12 text-red-700 text-center">
              <span className="text-lg mr-2">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Вход...
              </>
            ) : (
              <>
                <span>🚀</span>
                Войти
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Нет аккаунта?{" "}
            <a 
              href="/register" 
              className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
            >
              Зарегистрируйтесь
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
