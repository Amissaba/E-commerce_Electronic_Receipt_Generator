require('dotenv').config()

const shared = {
  "host": "127.0.0.1",
  "dialect": "mysql",
}
module.exports = {
  "development": {
    ...shared,
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_development",
    "port": process.env.DB_PORT
    
  },
  "test": {
    ...shared,
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || null,
    "database": process.env.DB_NAME || "database_development",
    "port": process.env.DB_PORT
  },
  "production": {
    ...shared,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD ,
    "database": process.env.DB_NAME ,
    "port": process.env.DB_PORT
  }
}
