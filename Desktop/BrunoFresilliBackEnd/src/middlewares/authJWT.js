const authorize = (role) => (req, res, next) => {
    if (req.user.role === role) return next();
  
    res.redirect("/unauthorized"); 
  };
  


module.exports = authorize;
