import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignIn.css";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function SignIn() {

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };


  const login = () => api.post("/api/auth/login", form);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) {
      setErr("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await login();

      const { accessToken, refreshToken } = res?.data || {};
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      localStorage.setItem("userEmail", form.email);

      navigate("/");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) setErr("이메일 또는 비밀번호가 올바르지 않습니다.");
      else setErr("로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      console.error("[login error]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
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
                name="password"                
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
              />
            </label>

            {err && <div className="error" role="alert">{err}</div>}

            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="signin-extra">
            <Link to="/">← 홈으로</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
