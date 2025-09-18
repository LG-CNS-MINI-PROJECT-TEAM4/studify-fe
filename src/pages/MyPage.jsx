import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Footer.css";
import "../styles/MyPage.css";
import { deletePost } from "../api/post"; // 상단에 추가

import { useState } from "react";

export default function MyPage() {
  // 탭 상태: 'info' 또는 'posts'
  const [tab, setTab] = useState('info');
  // 더미 글 데이터
  const [myPosts, setMyPosts] = useState([
    { id: 1, title: "React 스터디 모집", date: "2025-09-01", comment: 2 },
    { id: 2, title: "Node.js 프로젝트 팀원 구함", date: "2025-08-20", comment: 5 },
    { id: 3, title: "Python 알고리즘 스터디", date: "2025-07-15", comment: 1 },
  ]);
  const [user, setUser] = useState({
    name: "신짱구",
    id: "zzhang123",
    nickname: "부리부리",
    stack: ["React", "Node.js", "Python"],
    birth: "1995-08-15",
    email: "zzhang123@email.com"
  });

  const [stackInput, setStackInput] = useState(user.stack.join(", "));

  const handleLogout = () => {
    alert("로그아웃 되었습니다.");
  };
  const handleDelete = () => {
    if(window.confirm("정말로 회원탈퇴 하시겠습니까?")){
      alert("회원탈퇴 처리되었습니다.");
    }
  };

  const handleStackChange = (e) => {
    setStackInput(e.target.value);
    setUser(u => ({
      ...u,
      stack: e.target.value
        .split(/,|\n/)
        .map(s => s.trim())
        .filter(Boolean)
    }));
  };

  // 삭제 핸들러
  const handleDeletePost = async (postId) => {
    if (!window.confirm("정말로 이 글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      setMyPosts(posts => posts.filter(p => p.id !== postId));
      alert("삭제되었습니다.");
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="app">
      <Navbar />
      <main className="container mypage-main" style={{ display: 'flex', gap: 32 }}>
        {/* 좌측 메뉴 */}
        <nav className="mypage-menu">
          <ul>
            <li className={tab === 'info' ? 'active' : ''} onClick={() => setTab('info')}>회원정보</li>
            <li className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>내가 쓴 글</li>
          </ul>
        </nav>
        {/* 우측 컨텐츠 */}
        <section className="mypage-content" style={{ flex: 1 }}>
          <h2 className="mypage-title">마이페이지</h2>
          {tab === 'info' && (
            <div className="mypage-info-box">
              <div className="mypage-info-item"><b>이름</b>: {user.name}</div>
              <div className="mypage-info-item"><b>아이디</b>: {user.id}</div>
              <div className="mypage-info-item"><b>닉네임</b>: {user.nickname}</div>
              <div className="mypage-info-item">
                <b>기술스택</b>:
                <input
                  type="text"
                  value={stackInput}
                  onChange={handleStackChange}
                  placeholder="예: React, Node.js, Python"
                  style={{marginLeft: 8, minWidth: 180, padding: "4px 10px", borderRadius: 8, border: "1px solid #ddd"}}
                />
              </div>
              <div className="mypage-info-item"><b>생년월일</b>: {user.birth}</div>
              <div className="mypage-info-item"><b>이메일주소</b>: {user.email}</div>
              <div className="mypage-save-row">
                <button className="btn primary mypage-save-btn" onClick={() => alert("저장 되었습니다.")}>저장</button>
              </div>
            </div>
          )}
          {tab === 'posts' && (
            <div className="mypage-posts-box">
              <ul className="mypage-posts-list">
                {myPosts.map(post => (
                  <li key={post.id} className="mypage-posts-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      to={`/posts/${post.id}`}
                      className="mypage-posts-link"
                      state={{ fromMyPage: true }}
                    >
                      <div className="mypage-posts-title">{post.title}</div>
                      <div className="mypage-posts-meta">{post.date} · 댓글 {post.comment}</div>
                    </Link>
                    <button className="mypage-posts-delete-btn" onClick={() => handleDeletePost(post.id)}>삭제하기</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-inner mypage-footer-right">
          <button className="btn ghost mypage-btn" onClick={handleLogout}>로그아웃</button>
          <button className="btn dark mypage-btn" onClick={handleDelete}>회원탈퇴</button>
        </div>
      </footer>
    </div>
  );
}
