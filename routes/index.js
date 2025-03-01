var express = require('express');
var router = express.Router();

const Habit = require('../models/habit');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/habits', async function(req, res, next) {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/habits', async function(req, res, next) {
  try {
    const { title, description } = req.body;
    const habit = await Habit.create({ title, description });
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})
router.delete('/habits/:id', async function(req, res) {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
})

module.exports = router;
