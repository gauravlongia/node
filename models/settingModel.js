// userModel.js

const db = require('../connections/mysqlDb');

function getSettings(callback) {
    const query = 'SELECT * FROM settings where id = 1';
    db.query(query, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, rows);
    });
}

function updateSettings(updatedSettings, callback) {
    const query = 'UPDATE settings SET ? WHERE id = 1'; // Assuming 'id' is used for the update condition

    db.query(query, updatedSettings, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result.affectedRows > 0); // Assuming affectedRows indicates success
    });
}

module.exports = {
    getSettings,
    updateSettings
};
