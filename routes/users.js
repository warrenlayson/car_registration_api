const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

/**
 * @route   POST api/users
 * @desc    Register a user
 * @access  Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email')
      .not()
      .isEmpty()
      .isEmail(),
    check('password', 'Please include a valid password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    // Destructure;
    const { name, email, password } = req.body;

    try {
      // Check email if already exist
      const user = await User.findOne({ email });

      // If already taken, return error
      if (user) return res.status(409).json({ msg: 'Email is already taken' });

      // Create new user
      const newUser = await new User({
        name,
        email,
        password
      });

      // Generate salt
      const salt = await bcrypt.genSalt();

      newUser.password = await bcrypt.hash(password, salt);

      await newUser.save();

      res.status(201).json(newUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;
