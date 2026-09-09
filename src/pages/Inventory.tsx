import { useEffect, useMemo, useRef, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import InventoryItem from "../components/InventoryItem";

/* ============================================================
 * 【本文件知识点】本项目知识点最密集的页面：搜索 + 列表
 *
 * 1. "算出来的数据"不要存进 state！
 *      搜索结果 searchResult 完全可以由 (全部数据 + 搜索词)
 *      现场算出来。如果另外存一份，原始数据一变就忘了同步它，
 *      就会出现两个不一样、互相矛盾的列表。
 *    记住：能算出来的，就不存。
 *
 * 2. useRef：一个"装东西的盒子"，往里放/取东西
 *    （ref.current = ...）不会引起界面更新。
 *    最常见用途：拿到某个标签的真实 DOM 元素来操作它。
 *    （对比：改 state 会引起界面更新 —— 这是两者的根本区别）
 *
 * 3. 列表渲染的 key：map 循环生成的每一项都要给一个
 *    唯一且稳定的 key，React 靠它知道"哪几项变了/删了/加了"。
 *    要用数据自己的编号，不要用循环序号（删中间一项就乱了）。
 * ============================================================ */

function Inventory() {
  // 自定义 Hook：一次拿回数据和增减库存的函数
  const { inventories, loading, error, addInventory, subtractInventory } =
    useInventory();

  const [keyword, setKeyword] = useState(""); // 输入框里正在打的内容
  const [searchKeyword, setSearchKeyword] = useState(""); // 点了"查询"才生效的词

  /* useRef 初体验：
   * 1. const ref = useRef<HTMLInputElement>(null) —— 造盒子，先装 null
   * 2. <input ref={searchInputRef} /> —— 把盒子挂到标签上，
   *    之后 ref.current 就是这个 <input> 的真实 DOM 元素
   * 3. useEffect 里 ref.current?.focus() 让它获得光标 */
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 页面出现后自动聚焦搜索框（空依赖 = 只执行一次）
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // 搜索结果：每次由 inventories + searchKeyword 现场算出来。
  // useMemo 缓存一下，这两个不变就不重算。
  const searchResult = useMemo(
    () =>
      inventories.filter(
        (item) =>
          // toLowerCase 统一转小写：搜索不分大小写；编号和名称都能搜
          item.matnr.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.name.toLowerCase().includes(searchKeyword.toLowerCase()),
      ),
    [inventories, searchKeyword],
  );

  // 库存总量：reduce 求和（写法见 Dashboard 的注释）
  const totalQuantity = inventories.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (loading) {
    return <p className="state-hint">正在加载库存...</p>;
  }

  if (error) {
    return <p className="state-hint state-hint--error">错误：{error}</p>;
  }

  return (
    <div className="page">
      <h1 className="page__title">库存管理</h1>

      {/* 工具栏：搜索框 + 统计 */}
      <div className="toolbar">
        <div className="toolbar__search">
          <input
            ref={searchInputRef} // 挂上盒子
            className="field__input"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索物料编号 / 名称"
            type="search" // 浏览器会自带一个清除小叉
          />
          <button
            className="btn btn--primary"
            onClick={() => setSearchKeyword(keyword)} // 把"正在打的词"提交成"搜索词"
          >
            查询
          </button>
        </div>

        <p className="toolbar__total">
          共 <strong>{inventories.length}</strong> 种物料 · 总量{" "}
          <strong>{totalQuantity}</strong> 件
        </p>
      </div>

      {/* 搜不到时显示提示，而不是一片空白（空状态处理） */}
      {searchResult.length === 0 ? (
        <p className="state-hint">
          没有找到与「{searchKeyword}」匹配的物料，换个关键词试试～
        </p>
      ) : (
        <div className="item-list">
          {/* 列表渲染：map 把数组每一项变成一段 JSX */}
          {searchResult.map((item) => (
            <InventoryItem
              key={item.matnr} // 唯一编号当 key，React 靠它认条目
              item={item}
              // 箭头函数包一层，把"点的是哪个物料"告诉 Hook
              //（为什么不直接写 addInventory(item.matnr)？见 InventoryItem 注释）
              onAdd={() => addInventory(item.matnr)}
              onSubtract={() => subtractInventory(item.matnr)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Inventory;
