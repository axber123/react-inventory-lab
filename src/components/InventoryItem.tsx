import { Link } from "react-router-dom";
import type { Inventory } from "../types";

/* ============================================================
 * 【本文件知识点】"展示组件" + 事件从子组件传回父组件
 *
 * 这个组件自己不存任何数据：
 *   - 显示什么（item）由父组件通过 props 给它
 *   - 用户点了按钮（+1/-1）怎么办？调用 props 里的 onAdd/onSubtract，
 *     实际干活的函数写在父组件里
 *
 * 记住这个模式：【数据从父到子，事件从子到父】
 * 这就是 React 的"单向数据流"。
 *
 * 【易错点】父组件传事件必须包一层箭头函数：
 *   ✅ onAdd={() => addInventory(item.matnr)}
 *   ❌ onAdd={addInventory(item.matnr)}
 * 后者在"画页面"时就会立刻执行 addInventory（不是等点击）！
 * 因为 JSX 花括号里的代码是当场执行的；
 * 箭头函数只是"定义了这么个函数"传下去，点击时才执行。
 * ============================================================ */

/** 组件需要外部提供什么。props 类型单独定义是常见习惯，可读性好 */
type InventoryItemProps = {
  item: Inventory; // 要展示的物料
  onAdd: () => void; // 点 + 时通知谁
  onSubtract: () => void; // 点 - 时通知谁
};

/** 按数量算出库存状态的文字和样式（把 if/else 收拢成一个小函数） */
function getStockLevel(quantity: number) {
  if (quantity === 0) return { label: "缺货", className: "stock-tag--danger" };
  if (quantity < 10) return { label: "低库存", className: "stock-tag--warning" };
  return { label: "充足", className: "stock-tag--ok" };
}

function InventoryItem({ item, onAdd, onSubtract }: InventoryItemProps) {
  const stock = getStockLevel(item.quantity);

  return (
    <div className="item-row">
      {/* Link 跳详情页：模板字符串拼出 /inventory/100001 这样的地址 */}
      <Link to={`/inventory/${item.matnr}`} className="item-row__code">
        {item.matnr}
      </Link>

      <Link to={`/inventory/${item.matnr}`} className="item-row__name">
        {item.name}
      </Link>

      {/* 状态徽章：class 名是上面函数算出来的 */}
      <span className={`stock-tag ${stock.className}`}>{stock.label}</span>

      <div className="item-row__qty">
        <button
          className="btn btn--step"
          onClick={onSubtract}
          // 数量为 0 时禁用减号（disabled 是布尔属性）
          disabled={item.quantity === 0}
          aria-label={`减少 ${item.name} 库存`}
        >
          −
        </button>

        {/* key={item.quantity}：数字一变，这个元素就重建一次，
            从而触发 CSS 里的 pop 弹跳动画（小技巧） */}
        <span key={item.quantity} className="item-row__num">
          {item.quantity}
        </span>

        <button
          className="btn btn--step"
          onClick={onAdd}
          aria-label={`增加 ${item.name} 库存`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default InventoryItem;
