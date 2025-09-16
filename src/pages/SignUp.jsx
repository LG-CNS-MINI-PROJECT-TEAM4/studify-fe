import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";
import Button from "../components/Button";
import Navbar from "../components/Navbar";



export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    passwd: "",
    confirm: "",
    nickname: "",
    birth: "",
  });
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault(); 
    if (!form.email || !form.passwd || !form.confirm) {
      setErr("필수 항목을 입력해 주세요.");
      return;
    }
    if (form.passwd !== form.confirm) {
      setErr("비밀번호가 일치하지 않습니다.");
      return;
    }
    
  };

  return (
        <div className="app">
          <Navbar />
    <div className="signup">
      <div className="container">
        <h1>회원가입</h1>

        <form className="signup-form" onSubmit={onSubmit} noValidate>
          <label>
            이메일
            <input
              name="email"
              type="email"
              placeholder="lgcns@gmail.com"
              value={form.email}
              onChange={onChange}
              autoComplete="username"
            />
          </label>

          <label>
            비밀번호
            <input
              name="passwd"
              type="password"
              value={form.passwd}
              onChange={onChange}
              autoComplete="new-password"
            />
          </label>

          <label>
            비밀번호 확인
            <input
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={onChange}
              autoComplete="new-password"
            />
          </label>


          <label>
            생년월일
            <input
              name="birth"
              type="date"
              value={form.birth}
              onChange={onChange}
              autoComplete="bday"
            />
          </label>

          <label>
            닉네임
            <input
              name="nickname"
              placeholder="예: dev_hani"
              value={form.nickname}
              onChange={onChange}
              autoComplete="nickname"
            />
          </label>

          {err && <div className="error" role="alert">{err}</div>}

          <div className="signup-form__submit">
            <Button variant="primary" type="submit">가입하기</Button>
          </div>
        </form>

        <div className="signup-extra">
          {/* <Link to="/signin">← 로그인으로</Link>
          <Link to="/">홈으로</Link> */}
        </div>
      </div>
    </div>
    </div>
  );
}
