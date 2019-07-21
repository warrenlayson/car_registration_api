const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Middleware
const auth = require('../middleware/auth');

/**
 * @route   GET api/auth
 * @desc    Get logged in user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

/**
 * @route   POST api/auth
 * @desc    Login user
 * @access  public
 */
router.post(
  '/',
  [
    check('email', 'Email is required')
      .not()
      .isEmpty()
      .isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(409).json({ msg: "User doesn't exist" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(409).json({ msg: "Password doesn't match" });

      // If it does math

      // Object to send in the token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;
