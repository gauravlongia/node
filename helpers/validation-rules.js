const { check } = require('express-validator');

exports.category = [
  // Sort Number validation
  check('sort')
    .notEmpty().withMessage('Sort Number is required')
    .isNumeric().withMessage('Sort Number must be a number'),

  // Title validation
  check('title')
    .notEmpty().withMessage('Title is required')
    .matches(/^[a-zA-Z ]*$/).withMessage('Only characters and spaces are allowed in Title'),
];

exports.subcategory = [
  // Sort Number validation
  check('sort')
    .notEmpty().withMessage('Sort Number is required')
    .isNumeric().withMessage('Sort Number must be a number'),
 
  check('categoryid')
    .notEmpty().withMessage('Title is required')
    .matches(/^[a-zA-Z ]*$/).withMessage('Only characters and spaces are allowed in Title'),
  check('categoryid')
    .notEmpty().withMessage('Category is required') 
];
