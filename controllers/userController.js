const db = require('../connections/mysqlDb');

const pages = {
    index: (req, res) => {
        db.query('SELECT blog.*, category.title AS categoryTitle, subcategory.title AS subcategoryTitle FROM blog LEFT JOIN category ON blog.categoryId = category.id LEFT JOIN subcategory ON blog.subcategoryId = subcategory.id', (err, rows) => {
            if (err) { 
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }      
            res.render('static/index', { 
                class: '',
              blogs: rows,  
              currentRoute: req.path,  
            }); 
          });  


       
    },
    affiliatedisclaimer: (req, res) => {
        res.render('static/affiliate-disclaimer');
    },


    aicarousels: (req, res) => { 
        res.render('static/articaldetail' ,{ blog : {} });
    },

    slug:(req, res) => {
        const slug = req.params.slug; 
        const query = 'SELECT * FROM blog WHERE title = ?';
        db.query(query, [slug], (err, rows) => {
          if (err) { 
            return res.status(500).send(err.message);
          } 
          if (rows.length > 0) { 
            res.render('static/articaldetail', { blog: rows[0] });
          } else { 
            res.status(404).send('Blog not found');
          }
        }); 
    },
  

    blogs: (req, res) => { 
    db.query('SELECT blog.*, category.title AS categoryTitle, subcategory.title AS subcategoryTitle FROM blog LEFT JOIN category ON blog.categoryId = category.id LEFT JOIN subcategory ON blog.subcategoryId = subcategory.id', (err, rows) => {
      if (err) { 
          console.error(err);
          return res.status(500).send('Internal Server Error');
      }     
      res.render("static/blogs", { 
        blogs: rows,  
        currentRoute: req.path,  
      }); 
    });  
    }, 
    contact: (req, res) => {
        res.render('static/contact');
    },
    news: (req, res) => {
        res.render('static/news');
    },
    pixop: (req, res) => {
        res.render('static/pixop');
    },
    plugins: (req, res) => {
        res.render('static/plugins');
    },
    privacypolicy: (req, res) => {
        res.render('static/privacy-policy');
    },
    resource: (req, res) => {
        res.render('static/resource');
    },
    termsandconditions: (req, res) => {
        res.render('static/terms-and-conditions');
    }
};

module.exports = pages;


  