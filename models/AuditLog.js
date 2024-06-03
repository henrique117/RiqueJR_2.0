// Imports

const Sequelize = require('sequelize')
const database = require('../db/dbConnection')

// This is the table 'AuditLog' of the DataBase

const AuditLog = database.define('auditlog', {

    actionsCounter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    },

    userSenderID: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    userSenderName: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    userReceiverID: {
        type: Sequelize.STRING,
    },

    userReceiverName: {
        type: Sequelize.STRING,
    },

    action: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    quantity: {
        type: Sequelize.STRING,
    },

}, {
    updatedAt: false,
})

module.exports = AuditLog