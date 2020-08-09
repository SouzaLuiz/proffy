import { Router } from 'express'

import ClassesController from './controllers/ClassesController'
import ConnectionsController from './controllers/ConnectionsController'

const routes = Router()

routes.post('/classes', ClassesController.store)
routes.get('/classes', ClassesController.index)

routes.get('/connections', ConnectionsController.index)
routes.post('/connections', ConnectionsController.store)

export default routes
