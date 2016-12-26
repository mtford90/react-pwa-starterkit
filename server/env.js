const env = {...process.env}

const PORT = Number(process.env.PORT || 3001)
delete process.env.PORT

const DEV_MODE = env.NODE_ENV !== 'production'

export default {
  PORT,
  NODE_ENV:      'development',
  // Enable server side profiling by default (e.g. of renderToString)
  PROFILING:     DEV_MODE,
  SSR_PROFILING: DEV_MODE,
  ...env,
}