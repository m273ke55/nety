import { useState, useEffect } from "react";
import AvatarUploader from "../components/AvatarUploader";
import api from "../api/api";

export default function ProfileEdit() {
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState([]);
  const [avatarPath, setAvatarPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const availableInterests = [
    "Спорт", "Музыка", "Кино", "Путешествия", "Книги", 
    "Кулинария", "Искусство", "Технологии", "Фотография", "Танцы"
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await api.get("/api/profiles/me");
        
        if (profile) {
          setBio(profile.bio || "");
          setAvatarPath(profile.avatar_path || "");
          
          const interestNames = profile.interests 
            ? profile.interests.map(i => i.name || i) 
            : [];
          setInterests(interestNames);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    loadProfile();
  }, []);

  const toggleInterest = (interest) => {
    setInterests((prev) =>
      prev.includes(interest) 
        ? prev.filter((i) => i !== interest) 
        : [...prev, interest]
    );
  };

  const saveProfile = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      await api.post("/api/profiles/me", { 
        bio, 
        interests 
      });
      setMessage("Профиль успешно сохранён! 🎉");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setMessage("Ошибка при сохранении профиля 😔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="nav-container">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient">💕 НеАдинокий Волк 🐺⛓🖤</h1>
            <nav className="flex">
              <a href="/profile/edit" className="nav-link active">Профиль</a>
              <a href="/feed" className="nav-link">Лента</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="form-container slide-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gradient mb-2">
                Редактирование профиля
              </h2>
              <p className="text-gray-600">
                Расскажите о себе, чтобы найти подходящих людей
              </p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <AvatarUploader onUpload={setAvatarPath} currentAvatar={avatarPath} />
              </div>

              <div>
                <label className="form-label">
                  О себе
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Расскажите немного о себе, своих увлечениях и том, что ищете..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                />
              </div>

              <div>
                <label className="form-label mb-4">
                  Интересы (выберите до 5)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableInterests.map((interest) => (
                    <label 
                      key={interest} 
                      className={`interest-checkbox ${
                        interests.includes(interest) ? 'checked' : ''
                      } ${interests.length >= 5 && !interests.includes(interest) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={interests.includes(interest)}
                        onChange={() => {
                          if (interests.length < 5 || interests.includes(interest)) {
                            toggleInterest(interest);
                          }
                        }}
                        disabled={interests.length >= 5 && !interests.includes(interest)}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Выбрано: {interests.length}/5
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-12 text-center font-medium ${
                  message.includes('успешно') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {message}
                </div>
              )}

              <button 
                onClick={saveProfile} 
                disabled={loading}
                className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Сохранить профиль
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}