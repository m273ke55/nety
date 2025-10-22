import { useState } from "react";
import api from "../api/api";

export default function AvatarUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (f.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой. Максимальный размер: 5MB");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await api.upload("/api/uploads/avatar", formData, token);
      onUpload(res.avatar_path);
      setError("");
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Ошибка загрузки. Попробуйте еще раз.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-uploader">
      {preview ? (
        <img 
          src={preview} 
          alt="Предпросмотр аватара" 
          className="avatar-preview"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span className="text-4xl text-gray-400">👤</span>
        </div>
      )}

      <div className="text-center">
        <label className="btn-secondary cursor-pointer inline-block mb-3">
          <span>📷 Выбрать фото</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              Выбрано: {file.name}
            </p>
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary flex items-center justify-center gap-2 mx-auto"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Загрузка...
                </>
              ) : (
                <>
                  <span>⬆️</span>
                  Загрузить
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <span className="mr-1">⚠️</span>
            {error}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-3">
          Максимальный размер: 5MB<br/>
          Поддерживаемые форматы: JPG, PNG, GIF
        </p>
      </div>
    </div>
  );
}
