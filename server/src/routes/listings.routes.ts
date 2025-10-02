/**
 * 列表路由
 */
import { Router } from 'express'
import { listingsController } from '../controllers/listings.controller.js'

const router = Router()

// GET /api/listings/search - 搜索汽车
router.get('/search', listingsController.search.bind(listingsController))

// GET /api/listings/recent - 获取最新列表
router.get('/recent', listingsController.getRecent.bind(listingsController))

// GET /api/listings/categories - 获取分类
router.get('/categories', listingsController.getCategories.bind(listingsController))

// GET /api/listings/:id - 获取商品详情
router.get('/:id', listingsController.getDetails.bind(listingsController))

export default router
