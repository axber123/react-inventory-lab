import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { Inventory } from './src/types'

/* ============================================================
 * 【本文件知识点】这个文件是 Vite 的配置文件，为什么里面有"假接口"？
 *
 * 页面要请求数据（fetch('/api/inventory')），但学习阶段没有后端服务。
 * 如果没人接这个请求，返回的是 HTML 而不是数据，页面必然报错 ——
 * 这就是本项目最初的 bug。
 *
 * 解决：在 Vite 的开发服务器上写一段代码"冒充"后端接口（前端 mock）。
 * Vite 的插件机制允许我们这么做，不需要装任何额外的库。
 *
 * 真实项目里删掉这个插件，换成代理转发给真后端：
 *
 *   server: {
 *     proxy: { '/api': 'http://localhost:8080' }
 *   }
 * ============================================================ */

/** 模拟的"数据库"：存在内存里的一份物料库存 */
const inventories: Inventory[] = [
  { matnr: '100001', name: '不锈钢螺栓 M8×30', quantity: 120 },
  { matnr: '100002', name: '不锈钢螺母 M8', quantity: 300 },
  { matnr: '100003', name: '轴承 6204-2RS', quantity: 45 },
  // quantity: 8  —— 故意造一条"低库存"，演示黄色预警样式
  { matnr: '100004', name: '同步带 HTD-5M', quantity: 8 },
  { matnr: '100005', name: '伺服电机 750W', quantity: 12 },
  // quantity: 0  —— 故意造一条"缺货"，演示红色样式
  { matnr: '100006', name: 'PLC 模块 CPU224', quantity: 0 },
  { matnr: '100007', name: '亚克力板 3mm', quantity: 66 },
  { matnr: '100008', name: '铝型材 2040', quantity: 24 },
]

/** 一个 Vite 插件 = 一个返回配置对象的函数 */
function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-plugin',

    // 这个钩子能拿到 Vite 的开发服务器，往上面挂一段"拦截请求"的代码。
    // 挂载在 /api 路径下：浏览器请求 /api/inventory 时，
    // 变量 url 里拿到的是去掉 /api 前缀后的 /inventory
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = req.url ?? ''

        // 不是来找 /inventory 的请求？放行给后面的人处理
        if (!url.startsWith('/inventory')) {
          next()
          return
        }

        // 去掉 ？后面的查询参数，只留路径
        const pathname = url.split('?')[0]

        // 延迟 600ms 模拟真实网络的等待时间，
        // 这样页面上的"加载中..."才能被肉眼看清楚
        await new Promise((resolve) => setTimeout(resolve, 600))

        // 统一的小工具：给浏览器回一段 JSON 数据
        const sendJson = (status: number, data: unknown) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(data))
        }

        // ---------- 接口 1：GET /api/inventory  返回全部物料 ----------
        if (pathname === '/inventory') {
          sendJson(200, inventories)
          return
        }

        // ---------- 接口 2：GET /api/inventory/100001  返回单个物料 ----------
        // 正则从路径里截出编号：/inventory/100001 -> "100001"
        const match = pathname.match(/^\/inventory\/([^/]+)$/)
        if (match) {
          const item = inventories.find((inv) => inv.matnr === match[1])
          if (item) {
            sendJson(200, item)
          } else {
            // 找不到就回 404，前端会走到"报错"的分支
            sendJson(404, { message: `物料 ${match[1]} 不存在` })
          }
          return
        }

        // 其他请求一律 404
        sendJson(404, { message: '接口不存在' })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
})
