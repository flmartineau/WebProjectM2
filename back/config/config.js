const env = process.env.NODE_ENV || 'development';
const config = require('./config.json');
const envConfig = config[env];
process.env.JWT_SECRET = process.env.JWT_SECRET || 'SECRETJWTM2';
process.env.JWT_EXP = process.env.JWT_EXP || '1h';

Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);
