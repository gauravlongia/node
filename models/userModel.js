// userModel.js

const db = require('../connections/mysqlDb'); // Import the database connection

function getUsers(callback) {
    const query = 'SELECT * FROM users';
    db.query(query, (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err, null);
        }
        callback(null, rows);
        // db.end();
    });
}

module.exports = {
    getUsers
};
