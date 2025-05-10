import { Router } from 'express'
import { add, fetchAllNotes } from '../controllers/taskController.js'


const router = Router()

router.post('/notes', add)
router.get('/notes', fetchAllNotes)

export default router
