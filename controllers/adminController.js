const db = require('../connections/mysqlDb');
const bcrypt = require('bcrypt');
const { validationResult, matchedData } = require('express-validator');

exports.dashboard = (req,res) => {
  // res.render('admin/datatable');
  res.redirect('/adm/settings');
}

exports.updateSetting = (req, res) => {
    const setting = [req.body.phone, req.body.email, req.body.address, 1];
    const sql = 'UPDATE settings SET phone = ?, email = ?, address = ? WHERE id = ?';
    db.query(sql, setting, (err, result) => {
        if (err) { 
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        req.flash('success', 'Data updated Successfully');
        res.redirect('/adm/settings');
    });
};

exports.getSettings = (req, res) => {
    db.query('SELECT * FROM settings', (err, rows) => {
        if (err) { 
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }  
       
        res.render("admin/settings", { data: rows, message: req.flash() ,title:"Settings"  ,  currentRoute: req.path }); 
    });
};


//-------------------------------------------------------------------------
//------------------------------------------------------------------------- CATEGORY
exports.categoryaddview = (req, res) => {  
      res.render("admin/category", { message: req.flash() ,errors: {}, title:"Add Category", currentRoute: req.path  , urlIs : "/adm/category"});  
};


exports.categoryadd = (req, res) => { 
  const errors= validationResult(req); 
  if (!errors.isEmpty()) { 
    const errorMessages = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {}); 
    res.render("admin/category", {data:req.body, message: req.flash() , errors: errorMessages ,title:"Add Category", currentRoute: req.path  , urlIs : "/adm/category"});
  }else{
    const { sort, title } = req.body; // Assuming sortNo and title are sent in the request body
    const data = [sort, title];
    const sql = 'INSERT INTO category (sort, title) VALUES (?, ?)'; 
    db.query(sql, data, (err, result) => {
      if (err) { 
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }  
      req.flash('success', 'Category added successfully');
      res.redirect('/adm/categoryall');
    });
  }    
};
 
exports.categoryall = (req, res) => {
  db.query('SELECT * FROM category', (err, rows) => {
      if (err) { 
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }     
      res.render("admin/categoryall", { data: rows, message: req.flash() , title:"Categories"  ,  currentRoute: req.path , newTextUrl: "/adm/category", newText: "Category" }); 
  });
};

exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id; 

  const sql = 'DELETE FROM category WHERE id = ?';
  db.query(sql, categoryId, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    req.flash('success', 'Category deleted successfully');
    res.redirect('/adm/categoryall');
  });
};

exports.editCategory = (req, res) => {
  const categoryId = req.params.id; 
  const sql = 'SELECT * FROM category WHERE id = ?';
  db.query(sql, categoryId, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }  
    res.render('admin/category', { data: rows[0] , urlIs : "/adm/updatecategory",currentRoute: req.path , title:"Update Category" , message: req.flash() });
   
  });
};

exports.updateCategory = (req, res) => {
  const errors= validationResult(req); 
  if (!errors.isEmpty()) { 
    const errorMessages = errors.array().reduce((acc, error) => {
      acc[error.path] = error.msg;
      return acc;
    }, {}); 
    res.render("admin/category", {data:req.body, message: req.flash() , errors: errorMessages ,title:"Update Category", currentRoute: req.path  , urlIs : "/adm/updatecategory"});
  }else{

  const { id, sort, title } = req.body; // Assuming sort, title, and id are sent in the request body
  const sql = 'UPDATE category SET sort = ?, title = ? WHERE id = ?';
  const data = [sort, title, id];

  db.query(sql, data, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    req.flash('success', 'Category updated successfully');
    res.redirect('/adm/categoryall');
  });
  }
};

  //-------------------------------------------------------------------------
  //------------------------------------------------------------------------- SUBCATEGORY
  exports.editOrShowsubcategory = (req, res) => {
    const eidtid = req.params.id; 
    if (eidtid) { 
      db.query('SELECT * FROM subcategory WHERE id = ?', eidtid, (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
  
        // Fetch categories from the database
        db.query('SELECT * FROM category', (catErr, categories) => {
          if (catErr) { 
            return res.status(500).send('Internal Server Error');
          } 
          res.render("admin/subcategory", { 
            data: data[0],
            message: req.flash(), 
            categories: categories, // Pass categories to the view
            title: "Update subcategory",
            currentRoute: req.path,
            urlIs: "/adm/subcategory"
          });
        });
      });
    } else { 
      db.query('SELECT * FROM category', (err, categories) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        } 
        console.log(categories);
        res.render("admin/subcategory", {
          data:[],
          message: req.flash(), 
          categories: categories, // Pass categories to the view
          title: "Add subcategory",
          currentRoute: req.path,
          urlIs: "/adm/subcategory"
        });
      });
    } 
  };
  
 
exports.subcategoryall = (req, res) => { 
  db.query('SELECT subcategory.*, category.title AS categoryTitle FROM subcategory JOIN category ON subcategory.categoryId = category.id', (err, rows) => {
    if (err) { 
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }     
    res.render("admin/subcategoryall", { 
      data: rows, 
      message: req.flash() ,
      title:"Sub Categories"  ,
      currentRoute: req.path , 
      newTextUrl: "/adm/subcategory",
      newText: "subcategory" 
    }); 
});
};

exports.deletesubcategory = (req, res) => {
const subcategoryId = req.params.id; 

const sql = 'DELETE FROM subcategory WHERE id = ?';
db.query(sql, subcategoryId, (err, result) => {
  if (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
  req.flash('success', 'subcategory deleted successfully');
  res.redirect('/adm/subcategoryall');
});
};
 

exports.addOrUpdateSubcategory = (req, res) => { 
console.log(req.body);
  const { id, sort, title, categoryId } = req.body;

  if (id) {
    // Update existing subcategory
    const sql = 'UPDATE subcategory SET sortNo = ?, title = ? , categoryId = ? WHERE id = ?';
    const data = [sort, title, categoryId,  id];
    db.query(sql, data, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      req.flash('success', 'Subcategory updated successfully');
      res.redirect('/adm/subcategoryall');
    });
  } else { 
    const sql = 'INSERT INTO subcategory (sortNo, title, categoryId) VALUES (?, ?, ?)';
    const data = [sort, title, categoryId];

    db.query(sql, data, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      req.flash('success', 'Subcategory added successfully');
      res.redirect('/adm/subcategoryall');
    });
  }
};




  //-------------------------------------------------------------------------
  //------------------------------------------------------------------------- Blogs
  
  exports.editOrShowblog = (req, res) => {
    const blogId = req.params.id;
    
    db.query('SELECT * FROM category', (categoryErr, categories) => {
      if (categoryErr) {
        console.error(categoryErr);
        return res.status(500).send('Internal Server Error');
      }
  
      db.query('SELECT * FROM subcategory', (subcategoryErr, subcategories) => {
        if (subcategoryErr) {
          console.error(subcategoryErr);
          return res.status(500).send('Internal Server Error');
        }
  
        if (blogId) {
          db.query('SELECT * FROM blog WHERE id = ?', blogId, (blogErr, blogData) => {
            if (blogErr) {
              console.error(blogErr);
              return res.status(500).send('Internal Server Error');
            }
  
            res.render("admin/blogadd", { 
              data: blogData[0],
              message: req.flash(),
              categories: categories,
              subcategories: subcategories,
              title: "Update Blog",
              currentRoute: req.path,
              urlIs: "/adm/blog"
            });
          });
        } else {
          res.render("admin/blogadd", { 
            data: {},
            message: req.flash(),
            categories: categories,
            subcategories: subcategories,
            title: "Add Blog",
            currentRoute: req.path,
            urlIs: "/adm/blog"
          });
        }
      });
    });
  };
  
  exports.addOrUpdateblog = (req, res) => {
    const {
      id,
      sort,
      title,
      description,
      categoryId,
      subcategoryId,
      oldimage,
      oldauthorimage,
      authorimage,
      authorname,
      timetorread,
      redirectlink
    } = req.body; 

  console.log(req.files);
const imagePath = req.files['image'] ? req.files['image'][0].filename : oldimage;
const authorImagePath = req.files['authorimage'] ? req.files['authorimage'][0].filename : oldauthorimage;

 

  
    if (id) { 
      // Update existing blog
      const sql = 'UPDATE blog SET sortNo = ?, title = ?, categoryId = ?, subcategoryId = ?, description = ?, image = ?, authorimage = ?, authorname = ?, timetorread = ?, redirectlink = ? WHERE id = ?';
      const data = [sort, title, categoryId, subcategoryId, description, imagePath, authorImagePath, authorname, timetorread, redirectlink, id];
      db.query(sql, data, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        req.flash('success', 'Blog updated successfully');
        res.redirect('/adm/blogall');
      });
    } else {
      // Add new blog
      const sql = 'INSERT INTO blog (sortNo, title, categoryId, subcategoryId, description, image, authorimage, authorname, timetorread, redirectlink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const data = [sort, title, categoryId, subcategoryId, description, imagePath, authorImagePath, authorname, timetorread, redirectlink];
  
      db.query(sql, data, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        req.flash('success', 'Blog added successfully');
        res.redirect('/adm/blogall');
      });
    }
  };
  

  exports.blogall = (req, res) => { 
    db.query('SELECT blog.*, category.title AS categoryTitle, subcategory.title AS subcategoryTitle FROM blog LEFT JOIN category ON blog.categoryId = category.id LEFT JOIN subcategory ON blog.subcategoryId = subcategory.id', (err, rows) => {
      if (err) { 
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }     
      res.render("admin/blogall", { 
        data: rows, 
        message: req.flash(),
        title: "Blog Entries",
        currentRoute: req.path,
        newTextUrl: "/adm/blog",
        newText: "blog"
      }); 
    });
  };
  

exports.deleteblog = (req, res) => {
const blogId = req.params.id; 

const sql = 'DELETE FROM blog WHERE id = ?';
db.query(sql, blogId, (err, result) => {
  if (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
  req.flash('success', 'blog deleted successfully');
  res.redirect('/adm/blogall');
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

 

exports.login = (req, res) => { 
    console.log(req.session);
        res.render("admin/login"); 
}
exports.loginpost = (req, res) => {  
    const { email, password } = req.body; 
    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err); 
            res.render('admin/login', { error: 'Error logging in. Please try again.' });
        } else if (results.length === 0) { 
            res.render('admin/login', { error: 'Invalid username or password' });
        } else { 
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (err || !result) { 
                    res.render('admin/login', { error: 'Invalid username or password' });
                } else { 
                    req.session.userId = results[0].id; 
                    res.redirect('/adm/settings');
                }
            });
        }
    });  
};

exports.logout = (req, res) => { 
         req.session.userId = null;
        res.redirect('/adm/login'); 
}


exports.homesliderget = (req, res) => {
    db.query('SELECT id,heading FROM slider', (err, result) => {
        if (err) {  
            return res.status(500).send('Internal Server Error');
        }    
        res.render("admin/sliders", { data: result, message: req.flash() ,title:"Home Slider",  currentRoute: req.path }); 
    });
}; 

exports.homesliderpost = (req, res) => {
    const { heading } = req.body; 
    const headingString = heading.join('@@'); 
    const sql = 'UPDATE slider SET heading = ? WHERE id = ?';
    db.query(sql, [headingString, 1], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      req.flash('success', 'Data updated Successfully');
      res.redirect('/adm/slider');
    });
  };
  
  exports.deletesliderheadiing = (req, res) => {
    const { index } = req.params;
 
    const sql = 'SELECT heading FROM slider WHERE id = 1';
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.redirect('back');
      }
  
      if (result.length === 0 || !result[0].heading) {
        req.flash('error', 'Heading not found');
        res.redirect('back');
      } 
      const headings = result[0].heading.split('@@');  
  
      // Check if the index is valid
      if (index >= 0 && index < headings.length) { 
        headings.splice(index, 1);
   
        const updatedHeading = headings.join('@@');
  
        // Update the database with the modified heading string
        const updateSql = `UPDATE slider SET heading = '${updatedHeading}' WHERE id = 1`;
        db.query(updateSql, (updateErr, updateResult) => {
          if (updateErr) {
            console.error(updateErr);
            res.redirect('back');
          }
  
          req.flash('success', 'Heading deleted successfully');
          res.redirect('/adm/slider');
        });
      } else {
        req.flash('error', 'Invalid index');
        res.redirect('back');
      }
    });
  };

  //banner update
  

  exports.homeaboutview = (req, res) => {
      db.query('SELECT * FROM homeabout', (err, result) => {
        if (err) {  
          res.redirect('back');
        }    
        res.render("admin/homeabout", { data: result, message: req.flash() ,title:"About",  currentRoute: req.path }); 
        });
    };  

    exports.homeaboutsave = (req, res) => {
    const heading = req.body.heading;
    const description = req.body.description;
    const imagePath = req.file ?  req.file.path : null; // Handle optional image upload
 
    db.query('UPDATE homeabout SET heading = ?, description = ?, image = ? WHERE id = ?', [heading, description, imagePath, 1], (err, result) => {
        if (err) {
        console.error(err);
        req.flash('error', 'Error updating data');
        res.redirect('back');  
        } else {
          req.flash('success', 'Data updated successfully');
           res.redirect('/adm/updatehomeabout'); 
        }
      });
    }; 
   