
module.exports = function(app) { 
    app.locals.truncate = function(str, limit) {
      return str.length > limit ? str.substring(0, limit) + '...' : str;
    };
    app.locals.extractPlainText = function(htmlString) { 
        return htmlString ? htmlString.replace(/<[^>]*>?/gm, '') : '';
      };
  };