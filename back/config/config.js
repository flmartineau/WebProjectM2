const env = process.env.NODE_ENV || 'development';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'SECRETJWTM2';
process.env.JWT_EXP = process.env.JWT_EXP || '1h';