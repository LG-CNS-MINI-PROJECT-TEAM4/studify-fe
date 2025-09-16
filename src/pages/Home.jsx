import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
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
    if (postPos === "ALL") return true;
    return Array.isArray(postPos) ? postPos.includes(selected) : postPos === selected;
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

        <div className="grid">
          {filtered.map((e) => (
            <PostCard
              key={e.id}
              e={e}
              commentCount={commentCounts[e.id] || 0}
            />
          ))}
        </div>
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
