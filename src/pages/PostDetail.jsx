import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { closePost, updatePost } from "../api/post";
import "./../styles/PostDetail.css";

export default function PostDetail({ commentCounts, onCommentAdd }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // API로 받아온 post 데이터
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  // 모집글 상세 조회 API 호출
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await axios.get(`/studify/api/v1/post/detail/${id}`);
        setPost(res.data);
        setComments(res.data.comments || []);
        setIsClosed(res.data.status === "closed");
      } catch (e) {
        setPost(null);
      }
    }
    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <div className="container" style={{ padding: 24 }}>
        <h2>게시물을 찾을 수 없습니다.</h2>
        <Link to="/">← 홈으로</Link>
      </div>
    );
  }

  const handleComment = (e) => setComment(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, { content: comment.trim(), author: { nickname: "나" } }]);
      setComment("");
      onCommentAdd && onCommentAdd(post.postId);
    }
  };

  // 마감 처리
  const handleClose = async () => {
    if (!window.confirm("정말로 모집을 마감하시겠습니까?")) return;
    try {
      await closePost(post.postId);
      setIsClosed(true);
      alert("모집이 마감되었습니다.");
      // 새로고침 또는 상태 갱신
      setPost((prev) => ({ ...prev, status: "closed" }));
    } catch (e) {
      alert("마감에 실패했습니다.");
    }
  };

  const handleEdit = async () => {
    if (!window.confirm("정말로 이 글을 수정하시겠습니까?")) return;
    try {
      // 예시: post 객체의 수정할 필드만 변경해서 전달 (실제 구현에 맞게 수정 필요)
      const updated = {
        ...post,
        title: post.title + " (수정됨)", // 예시: 제목에 (수정됨) 추가
        // content, category, recruitmentCount 등 필요한 필드 포함
      };
      await updatePost(post.postId, updated);
      alert("수정되었습니다.");
      // 상태 갱신
      setPost(updated);
    } catch (e) {
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="post-detail-main-container">
        <div className="post-detail-header">
          <div></div>
          <div>
            <h1>{post.title}</h1>
            <p>
              {post.authorId ? `작성자 ID: ${post.authorId}` : ""} · {post.createdAt?.slice(0, 10)}
            </p>
          </div>
        </div>
        <div className="post-detail-info-row">
          <div className="post-detail-label-row">
            <span className="post-detail-label">모집 구분</span>
            <span className="post-detail-info-value">{post.category}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">진행 방식</span>
            <span className="post-detail-info-value">{post.meetingType}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">모집 인원</span>
            <span className="post-detail-info-value">{post.recruitmentCount}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">시작 예정</span>
            <span className="post-detail-info-value">{post.deadline?.slice(0, 10)}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">예상 기간</span>
            <span className="post-detail-info-value">{post.duration}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">모집 분야</span>
            <span className="post-detail-info-value">{Array.isArray(post.position) ? post.position.join(", ") : post.position}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">기술 스택</span>
            <span className="post-detail-info-value">{Array.isArray(post.techStack) ? post.techStack.join(", ") : post.techStack}</span>
          </div>
        </div>
        <hr className="post-detail-hr" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <h2 className="post-detail-section-title" style={{ marginBottom: 0 }}>프로젝트 소개</h2>
          <button className="post-detail-apply-btn" disabled={isClosed}>신청하기</button>
        </div>
        <pre className="post-detail-content">
          {post.content}
        </pre>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
          <button
            className="post-detail-edit-btn"
            disabled={!location.state?.fromMyPage}
            onClick={handleEdit}
          >
            수정하기
          </button>
          <button
            className="post-detail-edit-btn"
            style={{ background: "#e5e7eb", color: "#222" }}
            disabled={!location.state?.fromMyPage || isClosed}
            onClick={handleClose}
          >
            모집 마감
          </button>
        </div>
        <div className="post-detail-comment-wrap">
          <h3 className="post-detail-comment-title">
            댓글 <span>{comments.length}</span>
          </h3>
          <form className="post-detail-comment-form" onSubmit={handleSubmit}>
            <div className="post-detail-comment-user">
              <img src="/icon-user.png" alt="user" className="post-detail-comment-icon" />
            </div>
            <textarea
              className="post-detail-comment-input"
              placeholder="댓글을 입력하세요."
              value={comment}
              onChange={handleComment}
              rows={3}
            />
            <button className="post-detail-comment-btn" type="submit">
              댓글 등록
            </button>
          </form>
          <div className="post-detail-comment-list">
            {comments.map((c, i) => (
              <div key={i} className="post-detail-comment-item">
                <b>{c.author?.nickname || "익명"}</b>: {c.content || c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}