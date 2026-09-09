import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/* ============================================================
 * 【本文件知识点】受控表单 + 页面跳转
 *
 * 1. 受控表单："输入框的值交给 React state 保管"。
 *      value={username}                   界面显示 state 的值
 *      onChange={... setUsername(...)}    每敲一个字就存回 state
 *    这样输入框的内容永远和 state 一致，随时能拿来校验、提交。
 *
 * 2. <Link> vs navigate()：
 *      <Link>       写在页面里让用户点的
 *      navigate()   在代码里主动跳（比如"登录成功后跳走"）
 *    navigate(-1) = 后退一页，等于浏览器的返回键。
 *
 * 3. 登录后跳回"用户本来想去的页面"：
 *      RequireAuth 拦人时用 state={{ from: location }} 记了笔记，
 *      这里 location.state?.from?.pathname 把笔记读出来。
 *    【JS 知识】?. 叫可选链：前一级是 null/undefined 就直接返回
 *      undefined，不会报错。
 * ============================================================ */

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // 校验不通过时的提示文字

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // 用户被守卫拦下前的目的地；没被拦过（自己点进来的）就去首页看板
  const from = location.state?.from?.pathname || "/dashboard";

  /* 提交表单。
   * ⚠️ 浏览器对 <form> 有默认行为（整页刷新），单页应用必须
   * e.preventDefault() 挡掉它，改由我们的代码接管。 */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // trim() 去掉首尾空格，防止"全是空格"也通过校验
    if (!username.trim() || !password.trim()) {
      setErrorMsg("用户名和密码不能为空");
      return;
    }

    login(username.trim());

    // 跳回原目标页。replace：不留历史记录，后退不会回到登录页
    navigate(from, { replace: true });
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-card__head">
          <span className="login-card__logo">📦</span>
          <h1>库存管理系统</h1>
          <p>React 学习项目 · 请登录</p>
        </div>

        {/* 受控输入框：label 包裹 + value + onChange 三件套 */}
        <label className="field">
          <span>用户名</span>
          <input
            className="field__input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="任意用户名"
          />
        </label>

        <label className="field">
          <span>密码</span>
          {/* event 的类型标注成 ChangeEvent<HTMLInputElement>
              = "输入框内容变化事件"。其实不标注 TS 也能自动推断，
              这里标出来只是给你看 TS 的写法。 */}
          <input
            className="field__input"
            type="password"
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setPassword(event.target.value)
            }
            placeholder="任意密码"
          />
        </label>

        {/* 校验失败才有错误提示（&& 短路渲染） */}
        {errorMsg && <p className="login-card__error">⚠ {errorMsg}</p>}

        <button type="submit" className="btn btn--primary login-card__submit">
          登 录
        </button>

        <p
          className="login-card__tip"
          style={{ marginTop: "8px", cursor: "pointer" }}
        >
          <span
            onClick={() => alert("联系管理员")}
            style={{ textDecoration: "underline" }}
          >
            忘记密码？
          </span>
        </p>

        <p className="login-card__tip">演示提示：任意非空用户名/密码即可进入</p>
      </form>
    </div>
  );
}

export default Login;
