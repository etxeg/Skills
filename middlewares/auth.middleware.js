// middlewares/auth.middleware.js
module.exports = {
    isAuthenticated: (req, res, next) => {
      if (req.session.user) {
        return next(); // User is logged in
      }
      res.redirect('/users/login'); // Redirect to login page
    },
    isAuthenticatedAdmin: (req, res, next) => {
      if (req.session.user && req.session.user.role === 'admin') {
        return next(); // User is admin
      }
      res.status(403).send('Unauthorized: Admin access only'); // Deny access
    }
  };
  