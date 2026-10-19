import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRound, PackageCheck, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormValues } from "@/lib/validation";

function Login() {
  const [submitError, setSubmitError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "admin",
      password: "123456",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError("");

    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "登录失败");
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-card__head">
          <span className="login-card__logo">
            <PackageCheck aria-hidden="true" size={38} />
          </span>
          <h1>库存管理系统</h1>
          <p>React Portfolio SPA · Mock Auth</p>
        </div>

        <label className="field">
          <span>用户名</span>
          <span className="field__control">
            <UserRound aria-hidden="true" size={16} />
            <input
              className="field__input"
              type="text"
              placeholder="admin"
              {...register("username")}
            />
          </span>
          {errors.username && (
            <small className="field__error">{errors.username.message}</small>
          )}
        </label>

        <label className="field">
          <span>密码</span>
          <span className="field__control">
            <KeyRound aria-hidden="true" size={16} />
            <input
              className="field__input"
              type="password"
              placeholder="至少 6 位"
              {...register("password")}
            />
          </span>
          {errors.password && (
            <small className="field__error">{errors.password.message}</small>
          )}
        </label>

        {submitError && <p className="login-card__error">{submitError}</p>}

        <button
          type="submit"
          className="btn btn--primary login-card__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "登录中..." : "登录"}
        </button>

        <p className="login-card__tip">
          演示账号：用户名任意非空，密码至少 6 位；输入 admin 会显示管理员角色。
        </p>
      </form>
    </div>
  );
}

export default Login;
