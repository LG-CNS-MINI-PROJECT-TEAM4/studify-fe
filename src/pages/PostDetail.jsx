import { useParams, Link } from "react-router-dom";
import { POSTS } from "../mock/posts";
import "./../styles/PostDetail.css";
import { useState } from "react";
import Navbar from "../components/Navbar"; // Navbar import 추가

export default function PostDetail({ commentCounts, onCommentAdd }) {
  const { id } = useParams();
  const post = POSTS.find(p => String(p.id) === id);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(
    Array(commentCounts?.[post?.id] || 0).fill("").map((_, i) => `댓글 ${i + 1}`)
  );

  if (!post) {
    return (
      <div className="container" style={{padding: 24}}>
        <h2>게시물 XX</h2>
        <Link to="/">← 홈으로</Link>
      </div>
    );
  }

  const content = post.content?.trim()
    ? post.content
    : Array(10).fill("").join("\n");

  const handleComment = (e) => setComment(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, comment.trim()]);
      setComment("");
      onCommentAdd && onCommentAdd(post.id); // Home의 댓글 수 갱신
    }
  };

  return (
    <>
      <Navbar /> {/* 페이지 최상단에 Navbar 배치 */}
      <div className="post-detail-main-container">
        <div className="post-detail-header">
          <div></div>
          <div>
            <h1>{post.title}</h1>
            <p>
              {post.author} · {post.postDate}
            </p>
          </div>

        </div>
        <div className="post-detail-info-row">
          <div className="post-detail-label-row">
            <span className="post-detail-label">모집 구분</span>
            <span className="post-detail-info-value">{post.type}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">진행 방식</span>
            <span className="post-detail-info-value">{post.method}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">모집 인원</span>
            <span className="post-detail-info-value">{post.recruitCount}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">시작 예정</span>
            <span className="post-detail-info-value">{post.deadline}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">연락 방법</span>
            <span className="post-detail-info-value">{post.contact}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">예상 기간</span>
            <span className="post-detail-info-value">{post.period}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">모집 분야</span>
            <span className="post-detail-info-value">{Array.isArray(post.position) ? post.position.join(", ") : post.position}</span>
          </div>
          <div className="post-detail-label-row">
            <span className="post-detail-label">기술 스택</span>
            <span className="post-detail-info-value">{post.language}</span>
          </div>
        </div>
        <hr className="post-detail-hr" />
        <h2 className="post-detail-section-title">프로젝트 소개</h2>
        <pre className="post-detail-content">
          {content}
        </pre>
        <div className="post-detail-comment-wrap">
          <h3 className="post-detail-comment-title">
            댓글 <span>{comments.length}</span>
          </h3>
          <form className="post-detail-comment-form" onSubmit={handleSubmit}>
            <div className="post-detail-comment-user">
              <img src="/icon-user-hand.png" alt="user" className="post-detail-comment-icon" />
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
              <div key={i} className="post-detail-comment-item">{c}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
