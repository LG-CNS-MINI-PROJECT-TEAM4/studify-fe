import { useMemo, useState, useEffect } from "react";
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
  const [showOpenOnly, setShowOpenOnly] = useState(false); 

  const matchPosition = (postPos, selected) => {
    if (selected === "ALL") return true;
    const arr = Array.isArray(postPos) ? postPos : [postPos];
    const toKey = (v) =>
      String(v).trim().toUpperCase()
        .replace("프론트엔드", "FRONTEND")
        .replace("백엔드", "BACKEND")
        .replace("디자이너", "DESIGNER")
        .replace("PM", "PM");
    return arr.map(toKey).includes(toKey(selected));
  };

  
  const isClosed = (p) => {
    if (p?.isClosed) return true;
    if (!p?.deadline) return false;
    const s = String(p.deadline).trim();
    const norm = s.replace(/\./g, "-");
    const d = /^\d{4}-\d{2}-\d{2}$/.test(norm) ? new Date(norm) : new Date(norm);
    if (isNaN(d)) return false;
    d.setHours(23, 59, 59, 999); 
    return new Date() > d;
  };

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return POSTS.filter((p) => {
      const byType = type === "ALL" || p.type === type;
      const byPos = matchPosition(p.position, position);
      const byQ = !qLower || p.title.toLowerCase().includes(qLower);
      const openOnly = !showOpenOnly || !isClosed(p); 
      return byType && byPos && byQ && openOnly;
    });
  }, [q, type, position, showOpenOnly]);


  const [commentCounts, setCommentCounts] = useState(
    POSTS.reduce((acc, post) => {
      acc[post.id] = post.commentCount || 0;
      return acc;
    }, {})
  );

  const handleCommentAdd = (postId) => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };


  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedPosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => {
    setPage(1);
  }, [q, type, position, showOpenOnly]);


  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages]);

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
        <div className="list-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>게시글 목록</h2>
          <button
            onClick={() => setShowOpenOnly(v => !v)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: showOpenOnly ? "#7c3aed" : "#fff",
              color: showOpenOnly ? "#fff" : "#222",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {showOpenOnly ? "모집중만" : "전체 보기"}
          </button>
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
              e={{ ...e, isClosed: isClosed(e) }} 
              commentCount={commentCounts[e.id] || 0}
            />
          ))}
        </div>

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
