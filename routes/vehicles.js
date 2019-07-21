const router = require('express').Router();
const { check, validationResult } = require('express-validator');

const Vehicle = require('../models/Vehicle');

// Middleware
const auth = require('../middleware/auth');

/**
 * @route   GET api/vehicles
 * @desc    Get vehicles
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ date: -1 });

    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

/**
 * @route   POST api/vehicles
 * @desc    Create vehicle
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty(),
      check('brand', 'Brand is required')
        .not()
        .isEmpty(),
      check('model', 'Model is required')
        .not()
        .isEmpty(),
      check('plateNo', 'Plate No is required')
        .not()
        .isEmpty(),
      check('engineNo', 'Engine No is required')
        .not()
        .isEmpty(),
      check('chassisNo', 'Chassis No is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const {
      name,
      brand,
      model,
      date,
      plateNo,
      engineNo,
      chassisNo,
      dateRegistered
    } = req.body;

    try {
      let vehicle = await Vehicle.find({
        $or: [{ plateNo }, { engineNo }, { chassisNo }]
      });

      console.log(typeof vehicle);

      if (vehicle.length > 0)
        return res.status(409).json({ msg: 'Invalid Input' });

      const newVehicle = new Vehicle({
        name,
        brand,
        model,
        date,
        plateNo,
        engineNo,
        chassisNo,
        dateRegistered
      });

      vehicle = await newVehicle.save();

      res.json(vehicle);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   PUT api/vehicles/:id
 * @desc    Update vehicle
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  const {
    name,
    brand,
    model,
    date,
    plateNo,
    engineNo,
    chassisNo,
    dateRegistered
  } = req.body;
  // Gather fields that isn't empty
  const vehicleFields = {};
  if (name) vehicleFields.name = name;
  if (brand) vehicleFields.brand = brand;
  if (model) vehicleFields.model = model;
  if (date) vehicleFields.date = date;
  if (plateNo) vehicleFields.plateNo = plateNo;
  if (engineNo) vehicleFields.engineNo = engineNo;
  if (chassisNo) vehicleFields.chassisNo = chassisNo;
  if (dateRegistered) vehicleFields.dateRegistered = dateRegistered;

  try {
    let vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) return res.json(404).json({ msg: 'Vehicle not found' });

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        $set: vehicleFields
      },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route   DELETE api/vehicles/:id
 * @desc    Delete vehicle
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });

    await Vehicle.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Vehicle Removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
