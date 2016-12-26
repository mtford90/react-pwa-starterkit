/**
 * Render the react app on the server first (including fetching data)
 *
 * This means we can render much more quickly on mobile devices
 */

import SSRCaching from "electrode-react-ssr-caching" // This must come first!

import React from 'react'
import {Provider} from 'react-redux'
import Router from 'express'
import {getStore} from '../../src/redux/store'
import _routes from '../../src/routes'
import {match, RouterContext} from 'react-router'
import ReactDOMServer from 'react-dom/server'
import env from '../env'
import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap support
injectTapEventPlugin();

const router = Router()

let isInitialised = false

function renderApp (store, props = {}) {
  const appBody = ReactDOMServer.renderToString(
    <Provider store={store}>
      <RouterContext {...props} />
    </Provider>
  )
  return appBody
}

/**
 * Wraps renderToString in various profiling tools, logging to console
 *
 * @param store
 * @param props
 * @returns {*}
 */
function profileRenderApp (store, props = {}) {
  // Prime v8 before doing any profiling
  if (!isInitialised) {
    for (let i = 0; i < 10; i++) {
      renderApp(store, props)
    }

    isInitialised = true
  }

  SSRCaching.clearProfileData();
  SSRCaching.enableProfiling();
  const before    = Date.now()
  const appBody   = renderApp(store, props)
  const after     = Date.now()
  const timeTaken = after - before
  console.log(`renderToString took ${timeTaken}ms`)
  SSRCaching.enableProfiling(false);
  console.log('SSRCaching profile:', JSON.stringify(SSRCaching.profileData, null, 2));
  return appBody
}

router.get('*', (req, res, next) => {
  const location = req.url
  const routes   = _routes()

  match({routes, location}, (err, redirectLocation, renderProps) => {
    if (err) return next(err)

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    }

    if (!renderProps) {
      return next(new Error(`No render props when attempting to render ${req.url}`))
    }

    const components = renderProps.components

    // If the component being shown is our 404 component, then set appropriate status
    if (components.some((c) => c && c.displayName === 'error-404')) {
      res.status(404)
    }

    const Comp = components[components.length - 1].WrappedComponent

    const fetchData = (Comp && Comp.fetchData) || (() => Promise.resolve())

    const {location, params, history} = renderProps

    const store = getStore()

    fetchData({store, location, params, history})
      .then(() => {
        const _renderApp = env.PROFILING ? profileRenderApp : renderApp
        const appBody    = _renderApp(store, renderProps)

        const state = store.getState()
        const html  = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React PWA</title>
  <link rel="manifest" href="/manifest.json">

  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="PWA">
</head>
<body>
  <div id="root">${appBody}</div>
  <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(state)}
  </script>
  <script src="/dist/bundle.js"></script>
</body>
</html>`
        res.send(html)
      })
      .catch((err) => next(err))

  })
})

export default router