import { useRef } from "react";

function Demo() {
  // 创建一个初始值为 0 的 ref
  const clickCountRef = useRef(0);

  function handleClick() {
    // 直接修改 .current 属性，组件不会重新渲染
    clickCountRef.current = clickCountRef.current + 1;
    console.log("你点击了", clickCountRef.current, "次");
  }

  return <button onClick={handleClick}>点击我</button>;
}

export default Demo;
