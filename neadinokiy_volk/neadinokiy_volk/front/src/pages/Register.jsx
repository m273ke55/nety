import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/api/auth/register", { username, email, password });
      setError(""); 
      alert("🎉 Регистрация успешна! Теперь вы можете войти в систему.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Ошибка регистрации. Возможно, пользователь с таким именем уже существует.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="form-container fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Присоединяйтесь к нам!
          </h1>
          <p className="text-gray-600">
            Создайте аккаунт и начните поиск новых знакомств
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="form-label">
              Имя пользователя
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Выберите уникальное имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Минимум 6 символов"
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
                Регистрация...
              </>
            ) : (
              <>
                <span>🎯</span>
                Зарегистрироваться
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Уже есть аккаунт?{" "}
            <a 
              href="/login" 
              className="text-purple-600 hover:text-purple-800 font-semibold transition-colors"
            >
              Войдите
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}