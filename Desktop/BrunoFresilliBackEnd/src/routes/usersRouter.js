const User = require ('../dao/models/user.js');
const passport = require ('passport')
const authorize = require('../middlewares/authJWT.js');
const { Router } = require('express');

const router = Router();


router.patch('/premium/:uid',passport.authenticate("jwt", { session: false }),
authorize("admin"), async (req, res) => {
  try {
      const user = await User.findById(req.params.uid);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.role = user.role === 'premium' ? 'user' : 'premium';
      await user.save();
      res.status(200).json({ message: 'User role updated', user });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


module.exports = router;