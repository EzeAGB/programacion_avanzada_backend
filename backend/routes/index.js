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
router.patch('/habits/markasdone/:id', async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    habit.lastDone = new Date();
    if (timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24) {
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt) + 1;
      habit.lastUpdate = new Date();
      await habit.save();
      res.status(200).json({'message': 'Habit marked as done'});
    } else {
      habit.days = 1;
      habit.lastUpdate = new Date();
      await habit.save();
      res.status(200).json({'message': 'Habit restarted'});
    }
  } catch (err) {
    res.status(500).json({ 'message' : 'Habit not found' });
  }
})

const timeDifferenceInHours = (date1, date2) => {
  const diffMs = Math.abs(date1 - date2);
  return diffMs / (1000 * 60 * 60);
}
const timeDifferenceInDays = (date1, date2) => {
  return Math.floor(timeDifferenceInHours(date1, date2) / 24);
}
module.exports = router;
