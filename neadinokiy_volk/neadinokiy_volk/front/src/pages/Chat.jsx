import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import messageSound from "../../assets/sounds/wolf.wav";

export default function Chat() {
  const { toProfileId } = useParams(); 
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState(`Пользователь ${toProfileId}`);
  const [profileData, setProfileData] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!toProfileId) return;

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for toProfileId:", JSON.stringify(toProfileId));
        
        const res = await api.get(`/api/chat/with/${toProfileId}`);
        
        if (Array.isArray(res)) {
          setMessages(res);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Не удалось загрузить сообщения: " + err.message);
        setMessages([]);
      }
    };

    const fetchProfileData = async () => {
        try {
          const profiles = await api.get("/api/profiles/feed?limit=100");
          const foundProfile = profiles.find(p => p.id === parseInt(toProfileId));
          if (foundProfile && foundProfile.display_name) {
            setProfileName(foundProfile.display_name);
            setProfileData(foundProfile);
          } else {
            setProfileName(`Пользователь ${toProfileId}`);
          }
        } catch (secondErr) {
          console.error("Failed to fetch from feed:", secondErr);
          setProfileName(`Пользователь ${toProfileId}`);
        }
    };
    audioRef.current = new Audio(messageSound);
    audioRef.current.volume = 0.3;

    fetchMessages();
    fetchProfileData();
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, [toProfileId]);

  const getSenderName = (message) => {
    if (message.display_name) {
      return message.display_name;
    }
    
    if (message.from_profile === parseInt(toProfileId)) {
      return profileName;
    }
    
    return `Пользователь ${message.from_profile}`;
  };

  const playMessageSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log("Не удалось воспроизвести звук:", error);
      });
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !toProfileId) return;

    setLoading(true);
    try {
      const res = await api.post("/api/chat/send/" + toProfileId, {  
        text: text 
      });
      
      setMessages((prevMessages) => [...prevMessages, res]);
      setText("");
      setError(null);

      playMessageSound();

    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Не удалось отправить сообщение: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && text.trim()) {
        sendMessage();
      }
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="nav-container">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gradient">💕 НеАдинокий Волк 🐺⛓🖤</h1>
            <nav className="flex">
              <a href="/profile/edit" className="nav-link">Профиль</a>
              <a href="/feed" className="nav-link">Лента</a>
            </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="chat-container slide-up">\
            <div className="chat-header">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.history.back()}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ← Назад
                </button>
                <div className="flex items-center gap-3">
                  {profileData?.avatar_bytes && (
                    <img 
                      src={profileData.avatar_bytes} 
                      alt={profileName}
                      className="w-10 h-10 rounded-full border-2 border-white/20"
                    />
                  )}
                  <div>
                    <h2 className="text-xl font-bold">💬 Чат</h2>
                    <p className="text-white/80 text-sm">
                      {profileName}
                      {profileData?.bio && (
                        <span className="ml-2 text-white/60">• {profileData.bio.substring(0, 30)}...</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-400">
                <div className="flex">
                  <div className="text-red-700">
                    <span className="text-lg mr-2">⚠️</span>
                    {error}
                  </div>
                </div>
              </div>
            )}
            
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((m, index) => (
                  <div 
                    key={m.id || index} 
                    className={`message ${
                      m.from_profile !== parseInt(toProfileId) 
                        ? 'bg-blue-50 border-l-4 border-blue-400' 
                        : 'bg-white'
                    }`}
                  >
                    <div className="message-sender">
                      {m.display_name}
                    </div>
                    <div className="text-gray-800">
                      {m.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {m.created_at ? new Date(m.created_at).toLocaleTimeString() : 'Сейчас'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-gray-500 text-lg font-medium">
                    Сообщений пока нет
                  </p>
                  <p className="text-gray-400 mt-2">
                    Начните разговор с {profileName}!
                  </p>
                </div>
              )}
            </div>
            
            <div className="chat-input-container">
              <input
                className="chat-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Введите сообщение для ${profileName}...`}
                disabled={loading}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !text.trim()}
                className="btn-primary px-6 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Отправка...
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    Отправить
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