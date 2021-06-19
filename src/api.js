const cors = require('cors')
const express = require('express')

let fetch
try {
  fetch = require('node-fetch') // eslint-disable-line global-require
} catch (Exception) {
  fetch = window.fetch.bind(window)
}

const port = 8000

const api = async () => {
  // start express and couch db server
  const app = express()

  app.use(express.json({ limit: '8mb' }))
  app.use(cors())
  app.use('/', express.static('dist'))

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  app.get('/proxy', async function(req, res) {
    let uri
    try {
      uri = req.query.uri
    } catch (e) {
      res.status(400).send(`Missing Uri`)
      return
    }
    try {
      const result = await fetch(uri)
      const json = await result.json()
      res.json(json)
    } catch (e) {
      console.log(e)
      res.status(400).send(`Failed Fetch.`)
    }
  })

  app.listen(port, function() {
    console.log(`Server started on Port ${port}`)
  })
}

api().catch(e => console.log(e))
