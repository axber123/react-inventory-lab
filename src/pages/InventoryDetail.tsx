import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInventory } from "../api/inventoryApi";
import type { Inventory } from "../types";

/* ============================================================
 * 【本文件知识点】动态路由参数 + "跟着参数变化"的请求
 *
 * 1. 路由表里注册的是 /inventory/:id，:id 是占位符。
 *    访问 /inventory/100003 时，useParams() 返回 { id: "100003" }。
 *
 * 2. 为什么详情页要自己发请求？
 *    用户可能直接刷新这个页面、从收藏夹进来、或把链接发给别人 ——
 *    那时"列表页的数据"根本没加载过，从列表里找是找不到的。
 *    所以详情页永远自己请求一次，这是真实项目的标准做法。
 *
 * 3. useEffect 的依赖数组写 [id] 的意义：
 *    组件出现时请求一次；如果 id 变了（比如页面内跳到另一个物料），
 *    会自动再请求一次。effect 跟着依赖走。
 * ============================================================ */

function InventoryDetail() {
  const { id } = useParams(); // 从地址里取出 :id 的值

  // 详情页自己的三件套。
  // 【TS 知识】useState<Inventory | null>(null)：
  //   "要么是一条物料，要么还没拿到（null）"，所以叫联合类型。
  //   TS 会逼你先判断再使用，防止"拿 null 去显示"的崩溃。
  const [item, setItem] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // 稍后用 navigate(-1) 做后退

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        setError(null); // 换一个物料查询时，先清掉上一次的报错
        const data = await getInventory(id!);
        // id! 末尾的感叹号 = "我保证 id 此时不是 undefined"。
        // 因为 id 来自路由 :id，走到这里必然有值。（TS 小知识，了解即可）
        setItem(data);
      } catch (err) {
        // 【TS 知识】catch 里的 err 是 unknown（JS 允许 throw 任何东西），
        // 要先用 instanceof 确认它是 Error 才能取 message
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]); // 依赖数组里放 id：id 一变就重新请求

  // ---- 三种界面状态：加载中 / 出错 / 正常 ----
  if (loading) {
    return <p className="state-hint">正在加载物料详情...</p>;
  }

  if (error) {
    return (
      <div className="page">
        <p className="state-hint state-hint--error">加载失败：{error}</p>
        <button
          className="btn btn--ghost"
          onClick={() => navigate("/inventory")}
        >
          返回库存列表
        </button>
      </div>
    );
  }

  /* 【TS 知识】上面已经排除了"加载中"和"出错"，
   * 逻辑上 item 此时一定有值，但 TS 的类型收窄只看代码顺序，
   * 不知道请求一定成功，所以这里补一个兜底判断：
   * 既让 TS 放心（后面能直接用 item. 不用 item?.），也更保险。 */
  if (!item) {
    return null; // 渲染"什么都不渲染"
  }

  return (
    <div className="page">
      <h1 className="page__title">库存详情</h1>

      <div className="detail-card">
        {/* id 来自地址栏，item 来自接口 —— 两个数据源在这里汇合 */}
        <div className="detail-card__row">
          <span className="detail-card__label">物料编号</span>
          <span className="detail-card__value">{id}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">物料名称</span>
          <span className="detail-card__value">{item.name}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">当前数量</span>
          <span className="detail-card__value">{item.quantity}</span>
        </div>

        <div className="detail-card__row">
          <span className="detail-card__label">库存状态</span>
          <span className="detail-card__value">
            {/* 三元表达式 = if/else 的单行版：条件 ? 成立时 : 不成立时 */}
            {item.quantity === 0 ? (
              <span className="stock-tag stock-tag--danger">缺货</span>
            ) : item.quantity < 10 ? (
              <span className="stock-tag stock-tag--warning">低库存</span>
            ) : (
              <span className="stock-tag stock-tag--ok">充足</span>
            )}
          </span>
        </div>
      </div>

      {/* navigate(-1) = 后退一页，回到你来的地方 */}
      <button className="btn btn--ghost" onClick={() => navigate(-1)}>
        ← 返回
      </button>
    </div>
  );
}

export default InventoryDetail;
