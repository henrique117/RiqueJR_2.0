// dotenv
const dotenv = require('dotenv')
dotenv.config()
const { DATABASE, USER, DB_PASSWORD } = process.env

const Sequelize = require('sequelize')
const sequelize = new Sequelize( DATABASE, USER, DB_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306
})

module.exports = sequelize