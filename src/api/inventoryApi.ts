import type { Inventory } from "../types";

/* ============================================================
 * 【本文件知识点】API 层：所有"找服务器要数据"的代码都放这里
 *
 * 为什么单独一个文件？页面组件只管"显示"，
 * 取数据的细节（地址、怎么处理错误）收拢到这。
 * 以后接口地址变了、要换请求库，只改这一个文件。
 *
 * 【TS 知识】函数名后面的 Promise<Inventory[]> 是返回值类型：
 *   Inventory[]  读作 "物料数组"（[] 表示数组，里面每项都是 Inventory）
 *   Promise<...> 读作 "将来才会给你 ..."（因为网络请求要等待）
 *   写错了编辑器会画红线，比如你想把它当单个对象用的时候。
 * ============================================================ */

/** 获取全部库存物料列表 */
export async function getInventories(): Promise<Inventory[]> {
  // fetch 是浏览器自带的请求函数；await = "等它做完再往下走"
  const response = await fetch("/api/inventory");

  // ⚠️ fetch 的著名陷阱：服务器返回 404/500 时它不算失败、照样往下走！
  // 必须自己检查 response.ok（状态码 200~299 才是 true）
  if (!response.ok) {
    throw new Error("获取库存列表失败");
  }

  // 把响应内容按 JSON 解析成 JS 对象（也要等待，所以再 await 一次）
  return response.json();
}

/** 按物料编号查一条物料。
 * 详情页必须用它单独请求：用户可能直接打开 /inventory/100001，
 * 那时列表数据还没加载过，"从列表里找"会找不到。 */
export async function getInventory(matnr: string): Promise<Inventory> {
  const response = await fetch(`/api/inventory/${matnr}`);

  if (!response.ok) {
    throw new Error(`获取物料 ${matnr} 详情失败`);
  }

  return response.json();
}
