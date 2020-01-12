const cors = require('cors')
const bodyParser = require('body-parser')

module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors())
}