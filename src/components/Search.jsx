import Select from "./Select";
import "../styles/Search.css";

export default function Search({
  q, setQ, type, setType, position, setPosition, TYPES, POSITIONS
}) {
  return (
    <div className="search">
      <div className="container">
        <h1 className="search-title">
          STUDYFY <span className="accent">스터디 · 프로젝트</span>
        </h1>     

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

          <div className="filters">
            <Select label="구분" options={TYPES} value={type} onChange={setType} />
            <Select label="포지션" options={POSITIONS} value={position} onChange={setPosition} />
          </div>
        </div>

      </div>
    </div>
  );
}
