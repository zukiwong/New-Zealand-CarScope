/**
 * 路由入口
 */
import { Router } from 'express'
import marketRoutes from './market.routes.js'
import listingsRoutes from './listings.routes.js'

const router = Router()

// 挂载路由
router.use('/market', marketRoutes)
router.use('/listings', listingsRoutes)

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NZ CarScope API is running',
    timestamp: new Date().toISOString(),
  })
})

export default router
