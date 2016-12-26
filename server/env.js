const env = {...process.env}

const PORT = Number(process.env.PORT || 3001)
delete process.env.PORT

export default {
  PORT,
  NODE_ENV:  'development',
  // Enable server side profiling by default (e.g. of renderToString)
  PROFILING: env.NODE_ENV !== 'production',
  ...env,
}