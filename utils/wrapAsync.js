// utils/wrapAsync.js
module.exports = function wrapAsync(fn) {
  return function (req, res, next) {
    // Make sure fn returns a Promise
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
