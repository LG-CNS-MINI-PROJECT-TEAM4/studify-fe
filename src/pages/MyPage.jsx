import Navbar from "../components/Navbar";
import "../styles/Footer.css";
import "../styles/MyPage.css";

import { useState } from "react";

export default function MyPage() {
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

			return (
				<div className="app">
					<Navbar />
					<main className="container mypage-main">
						<h2 className="mypage-title">마이페이지</h2>
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
