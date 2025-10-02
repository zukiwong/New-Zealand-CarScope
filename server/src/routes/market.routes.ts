/**
 * 市场数据路由
 */
import { Router } from 'express'
import { marketController } from '../controllers/market.controller.js'

const router = Router()

// GET /api/market/overview - 获取市场概览
router.get('/overview', marketController.getOverview.bind(marketController))

// GET /api/market/brands - 获取品牌统计
router.get('/brands', marketController.getBrandStats.bind(marketController))

// GET /api/market/brands/:make/models - 获取车型统计
router.get('/brands/:make/models', marketController.getModelStats.bind(marketController))

// GET /api/market/regions - 获取区域统计
router.get('/regions', marketController.getRegionStats.bind(marketController))

// GET /api/market/insights - 获取市场洞察数据
router.get('/insights', marketController.getInsights.bind(marketController))

export default router
