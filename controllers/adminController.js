const db = require('../connections/mysqlDb');
   
exports.updateSetting = (req, res) => {  
    const setting = [req.body.phone, req.body.email,  req.body.address, 1];
    const sql = 'UPDATE settings SET phone = ?, email = ? , address = ?  WHERE id = ?'; 
    db.query(sql, setting, (err, result) => {
        if (err) throw err;
        req.flash('success', 'Data updated Successfully'); 
        res.redirect('/admin/settings');
    }); 
};
exports.getSettings = (req, res) => {
    db.query('SELECT * FROM settings', (err, rows) => {
        if (err) throw err;
        const flashMessage = req.flash('success'); 
        console.log(req.flash() ,  "here"); 
      
        res.render('admin/settings', { data: rows, message: req.flash() });
    });
};
 


// exports.createSetting = (req, res) => {
//     const setting = [req.body.settingName, req.body.settingValue];
//     const sql = 'INSERT INTO settings (settingName, settingValue) VALUES (?, ?)';

//     db.query(sql, setting, (err, result) => {
//         if (err) throw err;
//         res.send('Setting created...');
//     });
// };

// exports.deleteSetting = (req, res) => {
//     const id = req.params.id;
//     db.query('DELETE FROM settings WHERE id = ?', id, (err, result) => {
//         if (err) throw err;
//         res.send('Setting deleted...');
//     });
// };

 