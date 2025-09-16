
import "../styles/Search.css";

export default function Search({
  q, setQ, type, setType, position, setPosition, TYPES, POSITIONS
}) {
  return (
    <div className="search">
      <div className="container">
        <div className="search-banner">
          <h1 className="search-title">
            <span style={{ fontWeight: 'bold', fontFamily: 'cookierunfont, sans-serif' }}>
              IT 팀원 찾기는 스터디파이에서
            </span>
          </h1>
        </div>

        <div className="search-row">
          <div className="search-box">
            <span className="search-ico">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="(예: 백엔드 )"
            />
            <button className="btn dark">검색</button>
          </div>
          {/* filters 영역은 Home.jsx로 이동 */}
        </div>

      </div>
    </div>
  );
}
