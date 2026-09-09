import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

/* ============================================================
 * 【本文件知识点】应用入口：React 从这里"点火"
 *
 * 1. index.html 里只有一个空的 <div id="root"> 和一行脚本引用，
 *    这行脚本就是本文件：React 接管 #root 这个 div，
 *    以后里面的所有内容由 React 负责画和更新。
 *
 * 2. <StrictMode> 严格模式（只在开发环境生效，上线后自动消失）：
 *    它会故意把每个组件渲染两遍、把 useEffect 执行两遍，
 *    用来帮你检查代码写得规不规范。
 *    ⚠️ 所以开发时接口会被请求两次 —— 这不是 bug！
 *
 * 3. 启动链条：index.html -> main.tsx(点火) -> App.tsx(路由)
 *    -> 对应页面 -> 页面里的 Hook 和子组件……
 * ============================================================ */

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
