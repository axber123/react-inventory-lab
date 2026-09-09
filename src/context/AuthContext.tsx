import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

/* ============================================================
 * 【本文件知识点】Context：把数据"广播"给所有后代组件
 *
 * 问题：React 里数据默认只能父传子（用 props）。
 *      Header 离顶层很远，想拿"当前登录用户"就得一层层往下传，
 *      中间明明不用的组件也被迫帮忙转发 —— 很麻烦。
 *
 * 解决：Context = 广播电台。Provider 包住谁，谁的所有后代
 *      都能直接"收听"这份数据，不用一层层传。
 *
 * 三步用法（就是本文件的写法）：
 *   ① createContext(...) 创建"频道"
 *   ② <AuthContext.Provider value={数据}> 包住组件树开始广播
 *   ③ 后代组件里 useContext(AuthContext) 收听
 *
 * 【TS 知识】AuthContextValue 里的 | （竖线）读作"或者"：
 *      user: AuthUser | null  = 要么是用户对象，要么是 null（没登录）
 *   这叫联合类型，写代码时 TS 会逼你先判断是不是 null 再用。
 * ============================================================ */

/** 登录用户长什么样（教学项目只存名字；真实项目还有 token、角色等） */
type AuthUser = { name: string };

/** 广播的数据内容：用户信息 + 登录/退出两个操作 */
type AuthContextValue = {
  user: AuthUser | null;
  login: (name: string) => void; // void = 这个函数不返回任何东西
  logout: () => void;
};

// ① 创建频道。参数 null = 组件上方没有 Provider 时拿到的默认值
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * ② Provider 组件：包在 App 最外层。
 * 注意：Context 本身不存数据！数据依然存在下面这个 useState 里，
 * Context 只负责"把 useState 里的数据发出去"。
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  /* 【TS + React 知识】useState<AuthUser | null>(...)：
   * 尖括号里写"这个 state 装什么类型的数据"。
   *
   * 初始值给了一个函数：它只在第一次渲染时执行一次（惰性初始化），
   * 用来从 sessionStorage（浏览器自带的小仓库，关掉标签页就清空）
   * 恢复登录状态，这样刷新页面后还是登录的。 */
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem("user");
    // JSON.stringify 存的时候把对象变文本，JSON.parse 取回来变回对象
    return saved ? JSON.parse(saved) : null;
  });

  /** 登录。教学项目里任意名字就算登录成功；真实项目这里要调后端接口验密码 */
  function login(name: string) {
    const nextUser: AuthUser = { name };
    setUser(nextUser);
    sessionStorage.setItem("user", JSON.stringify(nextUser));
  }

  /** 退出登录 */
  function logout() {
    setUser(null);
    sessionStorage.removeItem("user");
  }

  /* 【易错点】value={{ user, login, logout }} 这种写法每次渲染都造一个
   * "新对象"，所有收听的组件都会跟着重新渲染（哪怕数据没变）。
   * useMemo = "user 没变就接着用上次的旧对象"，避免没必要的更新。 */
  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ③ 自定义 Hook：组件里 useAuth() 一行收听。
 *
 * 【为什么有一行 eslint-disable？】ESLint 有一条规则要求
 * "一个文件只导出组件"（这是为了代码保存后浏览器局部快速更新），
 * 但 Provider 和配套 Hook 放同一个文件更容易看懂，
 * 真实项目普遍在这里开例外，所以主动禁用这一条。 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  // 获取上下文 userContext(自定义的Context对象)
  const context = useContext(AuthContext);

  // 防呆检查：如果某个组件忘了被 <AuthProvider> 包住，context 会是 null。
  // 提前抛出一个看得懂的报错，好过后面出现一堆莫名其妙的问题。
  // 【TS 知识】经过这个 if，TS 就确定下面的 context 不是 null 了
  //（这叫"类型收窄"），后面用 user、login 都不会报错。
  if (!context) {
    throw new Error("useAuth 必须在 <AuthProvider> 内部使用");
  }

  return context;
}
