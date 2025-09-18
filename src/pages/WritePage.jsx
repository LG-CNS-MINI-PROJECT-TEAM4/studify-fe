// src/pages/WritePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Write.css";
import { TYPES, POSITIONS, POSTS } from "../mock/posts";
import Select from "react-select";
import Navbar from "../components/Navbar";
import { createPost } from "../api/post";


export default function WritePage() {
  const nav = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    type: "STUDY",
    position: [],
    deadline: "",
    contact: "",
    kakaoLink: "",
    content: "",
    recruitCount: "",
    method: "",
    period: "",
    language: ""
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // 수정 모드: 기존 글 값 채우기
  useEffect(() => {
    if (!isEdit) return;
    const post = POSTS.find(p => String(p.id) === String(id));
    if (!post) return;

    const positions = Array.isArray(post.position)
      ? post.position
      : post.position ? [post.position] : [];

    setForm({
      title: post.title ?? "",
      type: post.type ?? "STUDY",
      position: positions,
      deadline: post.deadline ?? "",
      contact: post.contact ?? "",
      kakaoLink: post.kakaoLink ?? "",
      content: post.content ?? "",
      recruitCount: post.recruitCount ?? "",
      method: post.method ?? "",
      period: post.period ?? "",
      language: post.language ?? ""
    });
    }, [isEdit, id]);
// 공통 입력 핸들러
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "position") return; 
    setForm(f => ({ ...f, [name]: value }));
  };

  // 포지션 클릭 토글 (Ctrl/Cmd 없이 단일 클릭으로 다중 선택)
  const togglePosition = (value) => {
    setForm((f) => {
      const set = new Set(f.position);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...f, position: Array.from(set) };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.title.trim()) {
      setErr("제목을 입력해 주세요.");
      return;
    }
    // 수정인지 처음게시글인지
    if (isEdit) {
      nav(`/posts/${id}`);
    } else {
      setSaving(true);
    try {
      const postData = {
        title: form.title,
        content: form.content,
        category: form.type === "PROJECT" ? "project" : "study",
        recruitmentCount: Number(form.recruitCount),
        techStack: form.language ? form.language.split(/,| /).map(s => s.trim()).filter(Boolean) : [],
        status: "open",
        deadline: form.deadline ? form.deadline + "T23:59:59" : null,
        meetingType: form.method,
        duration: form.period,
        position: form.position,
        authorId: 1, // 임시 사용자 ID
      };
      await createPost(postData);
      alert("등록 성공!");
      nav("/");
    }
    } catch (e) {
      setErr("등록 실패: " + (e?.response?.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  const positionOptions = POSITIONS
    .filter(p => p.key !== "ALL")
    .map(p => ({ value: p.key, label: p.label }));

  return (
    <div className="write">
      <Navbar />
      <div className="container write-card">
        <div className="write-head">
          <h1>{isEdit ? "게시글 수정" : "팀원 모집하기"}</h1>
        </div>

        <form className="write-form" onSubmit={submit} noValidate>
          <label>
            제목
            <input
              name="title"
              placeholder="예: 팀원 모집"
              value={form.title}
              onChange={onChange}
              disabled={saving}
            />
          </label>

          <div className="row2">
            <label>
              구분
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                disabled={saving}
              >
                {TYPES.filter(t => t.key !== "ALL").map(t => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </label>

            <label>
              <span>모집 분야</span>
              <Select
                classNamePrefix="react-select"
                isMulti
                options={positionOptions}
                value={positionOptions.filter(opt => form.position.includes(opt.value))}
                onChange={selected => setForm(f => ({
                  ...f,
                  position: (selected ?? []).map(opt => opt.value)
                }))}
                isDisabled={saving}
                placeholder="포지션 선택"
                closeMenuOnSelect={false}
                styles={{
                  container: base => ({ ...base, minWidth: 0 }),
                  control: base => ({ ...base, minHeight: "40px", fontSize: "14px" }),
                  multiValue: base => ({ ...base, backgroundColor: "#f3f4f6" }),
                  multiValueLabel: base => ({ ...base, color: "#374151" }),
                  multiValueRemove: base => ({
                    ...base,
                    color: "#6b7280",
                    ":hover": { backgroundColor: "#fee2e2", color: "#b91c1c" }
                  })
                }}
              />
            </label>
          </div>

          <label>
            마감일
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={onChange}
              disabled={saving}
            />
          </label>

          <label>
            연락 방법
            <input
              name="contact"
              value={form.contact}
              onChange={onChange}
              disabled={saving}
            />
          </label>

          <label>
            오카방 링크
            <input
              name="kakaoLink"
              value={form.kakaoLink}
              onChange={onChange}
              disabled={saving}
            />
          </label>

          <label>
            소개글
            <textarea
              name="content"
              value={form.content}
              onChange={onChange}
              rows={8}
              disabled={saving}
            />
          </label>

          <label>
            모집 인원
            <input
              name="recruitCount"
              value={form.recruitCount}
              onChange={onChange}
              disabled={saving}
              placeholder="예: 1명"
            />
          </label>

          <label>
            진행 방식
            <input
              name="method"
              value={form.method}
              onChange={onChange}
              disabled={saving}
              placeholder="예: 온/오프라인"
            />
          </label>

          <label>
            예상 기간
            <input
              name="period"
              value={form.period}
              onChange={onChange}
              disabled={saving}
              placeholder="예: 장기"
            />
          </label>

          <label>
            사용 언어
            <input
              name="language"
              value={form.language}
              onChange={onChange}
              disabled={saving}
              placeholder="예: Figma"
            />
          </label>

          {err && <div className="error">{err}</div>}

          <div className="actions">
            <button
              type="button"
              className="btn ghost"
              onClick={() => nav(-1)}
              disabled={saving}
            >
              취소
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? (isEdit ? "수정 중..." : "등록 중...") : (isEdit ? "저장" : "등록")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
