//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const path = require('path')

// Add your routes here

// Serve prompt files as plain text
router.get('/prompts/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'prompts', req.params.filename)
  res.sendFile(filePath)
})

