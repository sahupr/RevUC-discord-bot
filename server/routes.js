const express = require('express')
const sendUpdate = require('../discord/daily-update')

const router = express.Router()

router.post(`/dailyUpdate`, async (req, res) => {
  try {
    const data = req.body
    await sendUpdate(data)
    res.send(`Daily update sent to discord!`)
  } catch(err) {
    console.error(err)
    res.status(500).send(`Error sending daily update to discord`)
  }
})

module.exports = router
