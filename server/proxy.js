let axios = require('axios')
module.exports = {
  setup: ({ app }) => {
    app.post('/api/v1/proxy-url', async (req, res) => {
      try {
        let resp = await axios.get(`${req.body.url}`)
        res.json(resp.data)
      } catch (e) {
        res.status(500).json({
          error: 'failed'
        })
      }
    })
  }
}