import "../styles/Navbar.css";
import "../styles/Button.css"
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {

  const navigate = useNavigate();

  const goWrite = () => {
    navigate("/write");
  };

  const goLogin = () => {
    navigate("/signin");
  };

  return (
    <nav className="navbar" aria-label="Global">
      <div className="container nav-inner">
        <Link to="/" className="brand" style={{ textDecoration: "none" }}>
          <img src="/studyfy_logo.png" alt="StudyFy" />
          <span style={{ fontSize: 28, fontWeight: 700, color: "#4B256D", marginLeft: 8 }}>StudyFy</span>
        </Link>
        <div className="nav-actions">
          <Button variant="ghost" onClick={goWrite}>글 올리기</Button>
          <Button variant="primary" onClick={goLogin}>로그인</Button>
          <Button variant="ghost" onClick={() => navigate("/signup")}>회원가입</Button>
        </div>
      </div>
    </nav>
  );
}
