import { useState } from "react";
import api from "../api/api";

export default function LikeButton({ profileId }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    await api.post(`/api/likes/like/${profileId}`);
    setLiked(true);
  };

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`p-2 rounded ${liked ? "bg-green-500" : "bg-gray-300"}`}
    >
      {liked ? "❤️ Liked" : "🤍 Like"}
    </button>
  );
}
