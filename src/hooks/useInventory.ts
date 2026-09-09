import { useEffect, useState } from "react";
import { getInventories } from "../api/inventoryApi";
import type { Inventory } from "../types";

/* ============================================================
 * 【本文件知识点】自定义 Hook + useState + useEffect
 *
 * 1. state（状态）：useState 声明的"会变的数据"。
 *    const [当前值, 改它的函数] = useState(初始值)
 *    改它的函数一调用，React 就自动把界面更新成新样子。
 *
 * 2. 自定义 Hook：名字以 use 开头的函数，里面可以用其他 Hook。
 *    作用 = 把"一段带数据的逻辑"打包，哪个组件需要就调用一次。
 *    ⚠️ 复用的是逻辑，不是数据！Dashboard 和 Inventory 各调一次，
 *      就各有一份自己的数据、各发一次请求。想真正全局共享要用
 *      Context（见 src/context/AuthContext.tsx）。
 *
 * 3. useEffect：组件"画完界面"后执行的额外任务，比如请求数据。
 *    React 里"画界面"指：把组件函数执行一遍、算出页面长什么样。
 * ============================================================ */

export function useInventory() {
  // 发请求页面的经典三件套：数据 / 是否加载中 / 报错信息
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ------------------------------------------------------------
   * 【知识点】useEffect 的第二个参数 = 依赖数组，决定"什么时候重新执行"：
   *   [ ]  空数组 -> 只在组件第一次出现在页面后执行一次（本例）
   *   [id] -> 第一次执行 + id 变化时再执行（见 InventoryDetail.tsx）
   *
   * ⚠️ effect 里不能直接写 await（React 限制），标准写法是：
   *    在里面定义一个 async 函数，然后调用它。
   * ------------------------------------------------------------ */
  useEffect(() => {
    async function loadInventories() {
      try {
        setLoading(true); // 1. 先进入"加载中" -> 界面显示加载提示

        const data = await getInventories(); // 2. 等接口返回数据

        setInventories(data); // 3. 存进 state -> 界面自动更新成列表
      } catch (err) {
        // 请求失败（api 层 throw 的错误会落到这）
        // 【TS 知识】strict 模式下 catch 里的 err 类型是 unknown（未知），
        // 因为 JS 允许 throw 任何东西。必须先用 instanceof 确认
        // "它是个 Error 对象"，才能放心取它的 message。
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        // finally = 成功失败都执行：无论如何退出"加载中"
        setLoading(false);
      }
    }

    loadInventories();
  }, []);

  /* ------------------------------------------------------------
   * 【知识点】改 state 的两种写法
   *   setX(新值)                 -- 新值和旧值无关
   *   setX(旧值 => 基于旧值算出的新值) -- 需要参考旧值时（本例必须用这种！）
   *
   * 为什么必须？React 是"攒一批一起改"的：连续快速点两次 +1，
   * 第二次执行时上一批可能还没改完，直接用旧值会漏算一次。
   * 用箭头函数写法，React 保证每次递给你的都是最新的那份。
   *
   * 【知识点】不能直接改原数据，必须造"新数据"（React 的硬规矩）
   *   ❌ item.quantity = item.quantity + 1   直接改旧对象
   *   ✅ { ...item, quantity: item.quantity + 1 } 造一个新对象
   *   React 靠"数据是新的"来发现需要更新界面，偷偷改旧数据它不知道。
   *   ...item 是展开运算符：把 item 里的字段抄一份到新对象里。
   * ------------------------------------------------------------ */

  /** 指定物料数量 +1 */
  function addInventory(matnr: string) {
    setInventories((prevInventories) =>
      // map：把数组每一项变换一下，返回新数组（原数组不动）
      prevInventories.map((item) =>
        item.matnr === matnr ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  }

  /** 指定物料数量 -1（不许减到负数） */
  function subtractInventory(matnr: string) {
    setInventories((prevInventories) =>
      prevInventories.map((item) =>
        item.matnr === matnr && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  }

  // 把数据和操作函数打包返回，组件拿来就用
  return {
    inventories,
    loading,
    error,
    addInventory,
    subtractInventory,
  };
}
