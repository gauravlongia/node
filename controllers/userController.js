// controllers/mainController.js
const index = (req, res) => {
    res.render('front/index', { class: '' });
};
const about = (req, res) => {
    res.render('front/about', { class:  'sub_page'  });
};
const classView = (req, res) => {
    res.render('front/class', { class : 'sub_page' });
};
const blog = (req, res) => {
    res.render('front/blog', { class:  'sub_page'  });
};


module.exports = {
    index, about, classView, blog,
};
