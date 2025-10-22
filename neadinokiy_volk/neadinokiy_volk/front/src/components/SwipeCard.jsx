import React from "react";
import { useNavigate } from "react-router-dom";

export default function SwipeCard({ profile, onSwipe }) {
  const navigate = useNavigate();

  const handleWriteMessage = () => {
    navigate(`/chat/${profile.id}`);
  };

  const getInterestName = (interest) => {
    return typeof interest === 'string' ? interest : interest.name || interest;
  };

  const getInterests = () => {
    if (!profile.interests) return [];
    return Array.isArray(profile.interests) 
      ? profile.interests.map(getInterestName)
      : [];
  };

  return (
    <div className="profile-card max-w-sm mx-auto mb-8 fade-in">
      <div className="relative">
        {profile.avatar_bytes ? (
          <img 
            src={profile.avatar_bytes} 
            alt={profile.display_name} 
            className="profile-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="profile-image bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-4xl text-gray-500">
              {profile.display_name ? profile.display_name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gradient mb-2">
          {profile.display_name || 'Аноним'}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {profile.bio || 'Пользователь пока не добавил описание'}
        </p>
        
        {getInterests().length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Интересы:</p>
            <div className="flex flex-wrap gap-2">
              {getInterests().slice(0, 5).map((interest, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
              {getInterests().length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  +{getInterests().length - 5}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between gap-3 mt-6">
          <button 
            onClick={() => onSwipe(profile.id, false)}
            className="btn-danger flex-1 flex items-center justify-center gap-2 py-3"
            title="Не нравится"
          >
            <span className="text-xl">👎</span>
            <span className="hidden sm:inline">Не волк</span>
          </button>
          
          <button 
            onClick={() => onSwipe(profile.id, true)}
            className="btn-success flex-1 flex items-center justify-center gap-2 py-3"
            title="Нравится"
          >
            <span className="text-xl">👍</span>
            <span className="hidden sm:inline">Волк</span>
          </button>
        </div>
        
        <button 
          onClick={handleWriteMessage}
          className="btn-primary w-full mt-3 flex items-center justify-center gap-2 py-3"
        >
          <span className="text-xl">💬</span>
          Написать сообщение
        </button>
      </div>
    </div>
  );
}