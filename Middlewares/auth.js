
 
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) { 
      next();
    } else { 
      res.redirect('/adm/login');
    }
  };

  module.exports =  { isAuthenticated, };