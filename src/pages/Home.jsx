import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Filters from "../components/Filters";
import PostCard from "../components/PostCard";
import "../App.css";
import "../styles/List.css";
import "../styles/Footer.css";
import Button from "../components/Button";
import { POSTS, POSITIONS, TYPES } from "../mock/posts";
import { Link } from "react-router-dom";

export default function Home() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("ALL");
  const [position, setPosition] = useState("ALL");

  const matchPosition = (postPos, selected) => {
    if (selected === "ALL") return true;
    const arr = Array.isArray(postPos) ? postPos : [postPos];
    const toKey = (v) => String(v).trim().toUpperCase()
          .replace("프론트엔드","FRONTEND")
          .replace("백엔드","BACKEND")
          .replace("디자이너","DESIGNER")
          .replace("PM","PM"); 
    return arr.map(toKey).includes(toKey(selected));
};

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return POSTS.filter((p) => {
      const byType = type === "ALL" || p.type === type;
      const byPos = matchPosition(p.position, position);
      const byQ = !qLower || p.title.toLowerCase().includes(qLower);
      return byType && byPos && byQ;
    });
  }, [q, type, position]);

  // 댓글 수를 postId별로 관리
  const [commentCounts, setCommentCounts] = useState(
    POSTS.reduce((acc, post) => {
      acc[post.id] = post.commentCount || 0;
      return acc;
    }, {})
  );

  // 댓글이 추가될 때 호출할 함수
  const handleCommentAdd = (postId) => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

  // 페이지네이션 관련 상태
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedPosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 페이지 이동 함수
  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar />

      <Search
        q={q}
        setQ={setQ}
        type={type}
        setType={setType}
        position={position}
        setPosition={setPosition}
        TYPES={TYPES}
        POSITIONS={POSITIONS}
      />

      <main className="container">
        <div className="list-head">
          <h2>게시글 목록</h2>
          <Link to="/write" className="link">글 작성</Link>
        </div>

        <Filters
          type={type}
          setType={setType}
          position={position}
          setPosition={setPosition}
          TYPES={TYPES}
          POSITIONS={POSITIONS}
        />

        <div className="grid">
          {pagedPosts.map((e) => (
            <PostCard
              key={e.id}
              e={e}
              commentCount={commentCounts[e.id] || 0}
            />
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '32px 0' }}>
            <button onClick={() => goPage(page - 1)} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goPage(i + 1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  background: page === i + 1 ? '#7c3aed' : '#fff',
                  color: page === i + 1 ? '#fff' : '#222',
                  fontWeight: page === i + 1 ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goPage(page + 1)} disabled={page === totalPages} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>&gt;</button>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-links">
            <a href="/members">만든 사람들</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
