const express = require('express')
const sendUpdate = require('../discord/daily-update')

const router = express.Router()

router.post(`/dailyUpdate`, async (req) => {
  const data = req.body
  await sendUpdate(data)
})

module.exports = router
