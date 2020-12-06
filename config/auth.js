module.exports = {
    isAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
  
      res.redirect("/users/login");
    }
  };

  // router.get('/home', isAuthenticated, (req,res) => {
//     // if a callback is specified, the rendered HTML string has to be sent explicitly
//      res.render('index', function (err, html) {
//      res.send(html);
//   });
// });
// router.post('/profile', (req,res) => {
// });
