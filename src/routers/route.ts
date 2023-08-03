import Controller from '@/controllers/controller'
import { Router } from 'express'

const router = Router()
const { getApi, getApibyId, getIndex } = new Controller()

router.get('/', getIndex)
router.get('/api', getApi)
router.get('/api/:id', getApibyId)

export default router
