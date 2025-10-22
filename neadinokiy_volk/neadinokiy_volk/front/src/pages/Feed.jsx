import React, { useEffect, useState } from "react";
import api from "../api/api";
import SwipeCard from "../components/SwipeCard";

export default function Feed() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const data = await api.get("/api/profiles/feed", token);
        setProfiles(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
        setError("Не удалось загрузить профили");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);
  
  async function handleSwipe(toProfileId, liked) {
    try {
      const token = localStorage.getItem("token");
      await api.post(`/api/likes/swipe/${toProfileId}?liked=${liked}`, {}, token);
      setProfiles(prev => prev.filter(p => p.id !== toProfileId));
    } catch (err) {
      console.error("Failed to swipe:", err);
      setError("Не удалось обработать действие");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Загружаем профили...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <p className="text-white text-lg font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="nav-container">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient">💕 НеАдинокий Волк 🐺⛓🖤</h1>
            <nav className="flex">
              <a href="/profile/edit" className="nav-link">Профиль</a>
              <a href="/feed" className="nav-link active">Лента</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {profiles.length > 0 ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Найди свою половинку
              </h2>
              <p className="text-white/80">
                Осталось профилей: {profiles.length}
              </p>
            </div>
            
            {profiles.map(profile => (
              <SwipeCard 
                key={profile.id} 
                profile={profile} 
                onSwipe={handleSwipe} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Вы просмотрели всех!
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Новые профили появятся совсем скоро
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary text-lg px-8 py-4"
            >
              Обновить ленту
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
