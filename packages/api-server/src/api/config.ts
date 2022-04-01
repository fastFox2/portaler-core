import { Router } from 'express'

import { redis } from '../utils/db'
import logger from '../utils/logger'

const router = Router()

const isProd = process.env.NODE_ENV === 'production'

router.get('/', async (req, res) => {
  try {
    const path = isProd ? req.path[0] : process.env.HOST
    const serverConfigRes = await redis.getAsync(`server:${path}`)
    const serverConfig = serverConfigRes ? JSON.parse(serverConfigRes) : false

    res.status(200).send({
      publicRead: serverConfig.isPublic,
      discordUrl: serverConfig.discordUrl,
    })
  } catch (err: any) {
    logger.error('Error fetching config', {
      error: {
        error: JSON.stringify(err),
        trace: err.stack,
      },
    })
    res.status(200).send({ publicRead: false, discordUrl: null })
  }
})

export default router
