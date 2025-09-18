import { useMemo, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Filters from "../components/Filters";
import PostCard from "../components/PostCard";
import "../App.css";
import "../styles/List.css";
import "../styles/Footer.css";
import Button from "../components/Button";
import { POSITIONS, TYPES } from "../mock/posts";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("ALL");
  const [position, setPosition] = useState("ALL"); // 사용자가 고른 필터 값
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ----- 공통 정규화 유틸 -----
  const normalizePosKey = (raw) => {
    if (raw == null) return null;
    const s = String(raw).trim();

    // 한글 라벨 → 키
    const kor = { "백엔드":"BE", "프론트엔드":"FE", "디자이너":"DESIGNER", "안드로이드":"ANDROID", "웹":"WEB" };
    if (kor[s]) return kor[s];

    // 소문자 값(@JsonValue) → 키
    const valToKey = {
      be:"BE", fe:"FE", pm:"PM", designer:"DESIGNER",
      ai:"AI", android:"ANDROID", ios:"IOS", web:"WEB"
    };
    const low = s.toLowerCase();
    if (valToKey[low]) return valToKey[low];

    // 이미 키(BE/FE/...) 형태면 그대로
    const up = s.toUpperCase();
    const keys = ["BE","FE","PM","DESIGNER","AI","ANDROID","IOS","WEB","ALL"];
    if (keys.includes(up)) return up;

    return null; // 알 수 없는 값
  };

  const normalizePosList = (v) => {
    // 서버가 positions(배열) 또는 position(단일/배열) 무엇이든 수용
    const arr = Array.isArray(v) ? v
              : Array.isArray(v?.positions) ? v.positions
              : Array.isArray(v?.position) ? v.position
              : v?.positions ?? v?.position ?? v ?? [];
    const list = Array.isArray(arr) ? arr : [arr].filter(Boolean);
    const keys = list.map(normalizePosKey).filter(Boolean);
    return [...new Set(keys)]; // 중복 제거
  };

  const matchPosition = (postPos, selected) => {
    const sel = normalizePosKey(selected) || "ALL";
    if (sel === "ALL") return true;
    const keys = normalizePosList(postPos);
    return keys.includes(sel);
  };

  const isClosed = (p) => {
    if (p?.isClosed) return true;
    if (!p?.deadline) return false;
    const s = String(p.deadline).trim();
    const norm = s.replace(/\./g, "-");
    const d = /^\d{4}-\d{2}-\d{2}$/.test(norm) ? new Date(norm) : new Date(norm);
    if (isNaN(d)) return false;
    d.setHours(23, 59, 59, 999);
    return Date.now() > d.getTime();
  };

  // ----- API 호출 -----
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/studify/api/v1/post/posts");

        const normalized = (data ?? []).map((p) => {
          const posKeys = normalizePosList(p.positions ?? p.position);
          return {
            ...p,
            id: p.postId,
            type: p.category?.toUpperCase(), // STUDY / PROJECT
            // positions를 일관되게 key 배열로 들고다니자
            positions: posKeys,             // ← 통일 필드
            language: Array.isArray(p.techStack) ? p.techStack.join(", ") : (p.techStack ?? ""),
            isClosed: p.status === "CLOSED",
            author: p.authorId ?? "익명",
            commentCount: p.commentCount ?? 0,
          };
        });

        setPosts(normalized);
      } catch (e) {
        setErr(e?.response?.data?.message ?? "목록 조회 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ----- 필터링 -----
  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    return posts.filter((p) => {
      const byType = type === "ALL" || p.type === type;
      const byPos = matchPosition(p.positions, position);
      const byQ = !qLower || String(p.title ?? "").toLowerCase().includes(qLower);
      const openOnly = !showOpenOnly || !isClosed(p);
      return byType && byPos && byQ && openOnly;
    });
  }, [posts, q, type, position, showOpenOnly]);

  // ----- 페이징 -----
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedPosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => { setPage(1); }, [q, type, position, showOpenOnly]);
  useEffect(() => { if (page > totalPages) setPage(totalPages || 1); }, [totalPages, page]);

  if (loading) return <div style={{ padding: 24 }}>로딩 중…</div>;
  if (err) return <div style={{ padding: 24, color: "red" }}>{err}</div>;

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
        POSITIONS={POSITIONS} // 여기의 value를 "BE/FE/..." 또는 "be/fe/..."로 둬도 정상 동작
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
            aria-pressed={showOpenOnly}
            aria-label="모집중만 토글"
            title={showOpenOnly ? "모집중만 보기 해제" : "모집중만 보기"}
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
              e={{
                ...e,
                // PostCard가 position을 기대한다면 positions를 함께 내려주거나, 대표 포지션을 파생
                position: e.positions,
                isClosed: isClosed(e),
              }}
              commentCount={e.commentCount}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '32px 0' }}>
            <button onClick={() => goPage(page - 1)} disabled={page === 1}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd',
                background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              &lt;
            </button>
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
                aria-current={page === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #ddd',
                background: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
              &gt;
            </button>
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
