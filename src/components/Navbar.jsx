import "../styles/Navbar.css";
import "../styles/Button.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState({ isAuthed: false });

  const loadAuthFromStorage = () => {
    const token = localStorage.getItem("accessToken");
    setAuth({ isAuthed: !!token });
  };

  useEffect(() => {
    loadAuthFromStorage();

    const onStorage = (e) => {
      if (["accessToken", "refreshToken", "userEmail"].includes(e.key)) {
        loadAuthFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    const onAuthChanged = () => loadAuthFromStorage();
    window.addEventListener("auth-changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth-changed", onAuthChanged);
    };
  }, []);

  const goWrite = () => {
    if (!auth.isAuthed) return navigate("/signin");
    navigate("/write");
  };
  const goMyPage = () => {
    if (!auth.isAuthed) return navigate("/signin");
    navigate("/mypage");
  };
  const goLogin = () => navigate("/signin");

  const logout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userInfo");
    } finally {
      window.dispatchEvent(new Event("auth-changed"));
      navigate("/signin");
    }
  };

  return (
    <nav className="navbar" aria-label="Global">
      <div className="container nav-inner">
        <Link to="/" className="brand nav-brand-link">
          <img src="/studyfy_logo.png" alt="StudyFy" />
          <span className="nav-brand-title">StudiFy</span>
        </Link>

        <div className="nav-actions">
          <Button variant="ghost" onClick={goWrite}>글 올리기</Button>
          <Button variant="ghost" onClick={goMyPage}>마이페이지</Button>

          {auth.isAuthed ? (
            <Button variant="primary" onClick={logout}>로그아웃</Button>
          ) : (
            <Button variant="primary" onClick={goLogin}>로그인</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
