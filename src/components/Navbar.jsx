import "../styles/Navbar.css";
import "../styles/Button.css"
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useState, useRef, useEffect } from "react";


export default function Navbar() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const bellRef = useRef(null);
  const alertRef = useRef(null);
  // 임시 mock 알림 데이터
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'apply', name: 'dev_hani', message: '팀원 신청이 들어왔습니다.' },
    { id: 2, type: 'apply', name: 'studycat', message: '팀원 신청이 들어왔습니다.' },
    // ...추가 알림 가능
  ]);

  const goWrite = () => {
    navigate("/write");
  };

  const goLogin = () => {
    navigate("/signin");
  };

  // 외부 클릭 시 알림창 닫기
  useEffect(() => {
    if (!showAlert) return;
    const handleClick = (e) => {
      if (
        alertRef.current &&
        !alertRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setShowAlert(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAlert]);

  return (
    <nav className="navbar" aria-label="Global">
      <div className="container nav-inner">
  <Link to="/" className="brand nav-brand-link">
          <img src="/studyfy_logo.png" alt="StudyFy" />
          <span className="nav-brand-title">StudiFy</span>
        </Link>
        <div className="nav-actions">
          <button
            ref={bellRef}
            onClick={() => setShowAlert((v) => !v)}
            aria-label="알림"
            className="nav-bell-btn"
          >
            <img src="/bell.png" alt="알림" className="nav-bell-img" />
            {showAlert && (
              <div ref={alertRef} className="nav-alert-card">
                <div className="nav-alert-title">알림</div>
                <hr className="nav-alert-divider" />
                
                {notifications.length === 0 ? (
                  <div className="nav-alert-empty">새로운 알림이 없습니다.</div>
                ) : (
                  <ul className="nav-alert-list">
                    {notifications.map((n) => (
                      <li key={n.id} className="nav-alert-item">
                        <span className="nav-alert-name">{n.name}</span>
                        <span className="nav-alert-message">{n.message}</span>
                        <div className="nav-alert-actions">
                          <button className="nav-alert-btn accept">수락</button>
                          <button className="nav-alert-btn reject">거절</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </button>
          <Button variant="ghost" onClick={goWrite}>글 올리기</Button>
          <Button variant="ghost" onClick={() => navigate("/mypage")}>마이페이지</Button>
          <Button variant="primary" onClick={goLogin}>로그인</Button>
        </div>
      </div>
    </nav>
  );
}
