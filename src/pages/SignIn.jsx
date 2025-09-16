import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SignIn.css";
import Button from "../components/Button";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", passwd: "" });
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();                 
    if (!form.email || !form.passwd) {
      setErr("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setErr("백엔드 연결해야댐");
  };

  return (
    <div className="signin">
      <div className="container signin-card">
        <h1>로그인</h1>

        <form className="signin-form" onSubmit={onSubmit} noValidate>
          <label>
            이메일
            <input
              name="email"
              type="email"
              placeholder="rudals831@gmail.com"
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
              placeholder="••••••••"
              value={form.passwd}
              onChange={onChange}
              autoComplete="current-password"
            />
          </label>

          {err && <div className="error" role="alert">{err}</div>}

          <Button variant="primary" type="submit">로그인</Button>
        </form>

        <div className="signin-extra">
          <Link to="/">← 홈으로</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
}
