// Imports

const Sequelize = require('sequelize')
const database = require('../db/dbConnection')

// This is the table 'Usuario' of the DataBase

const Usuario = database.define('usuario', {
    user_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
    },

    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    balance: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    daily: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
})

module.exports = Usuario