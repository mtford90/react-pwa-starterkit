require('electrode-react-ssr-caching') // Must come first

import express from 'express'
import webpack from 'webpack'
import bodyParser from 'body-parser'
import cors from 'cors'
import ServerSideRenderRouter from './routers/ServerSideRenderRouter'
import favicon from 'serve-favicon'
import env from './env'

const {PORT, NODE_ENV} =  env
const app              = express();

if (NODE_ENV !== 'production') {
  console.log('NOT IN PRODUCTION SO USING WEBPACK HOT RELOAD')

  const config   = require('./../webpack.config.js')
  const compiler = webpack(config);

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath
  })

  const webpackHotMiddleware = require('webpack-hot-middleware')(compiler)

  app.use(devMiddleware);
  app.use(webpackHotMiddleware);
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/static', express.static(__dirname + '/static'))
app.use('/dist', express.static(__dirname + '/dist'))
app.use(cors())
app.use(favicon(__dirname + '/../static/favicon.ico'));
app.use(ServerSideRenderRouter)

app.listen(PORT, function (err) {
  if (err) {
    return console.error(err);
  }

  console.log(`Listening at http://localhost:${PORT}/`);
})

module.exports = app