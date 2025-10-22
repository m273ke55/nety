import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileEdit from "./pages/ProfileEdit";
import Feed from "./pages/Feed";  
import Chat from "./pages/Chat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<Feed />} />  
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/chat/:toProfileId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}