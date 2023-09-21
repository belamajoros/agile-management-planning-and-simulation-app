/* eslint-disable camelcase */
const express = require('express');
const mongoose = require('mongoose');

const Task = require('../models/task');
const Story = require('../models/story');
const { predictionRole } = require('../services/predictionService');
const {
  getUsersWithSpecificRole,
  assignUser,
} = require('../services/taskService');

const router = express.Router();

/**
 * @route Post /create
 * @desc Create new task using AI for story
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/create', async (req, res) => {
  const data = req.body;
  const { story_id } = data;
  const { title } = data;
  const { points } = data;
  const done = false;
  const created_at = new Date();
  const updated_at = new Date();
  const { position_in_story } = data;
  const { project_id } = data;
  const role = await predictionRole(title);
  const users = await getUsersWithSpecificRole(role, project_id);
  const assigned_user = await assignUser(users);

  if (!story_id) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }

  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    story_id,
    title,
    points,
    done,
    created_at,
    updated_at,
    position_in_story,
    assigned_user,
  });

  task
    .save()
    // eslint-disable-next-line prettier/prettier
    .then((doc) => {
      return res.status(200).send({ doc, message: 'Task created!' });
    });
});

/**
 * @route Get //:storyId
 * @desc Returns specific story
 * @param storyId id of story
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.get('/:storyId', async (req, res, next) => {
  const story_id = req.params.storyId;
  try {
    Task.find({ story_id })
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          res.status(200).json(docs);
        } else {
          res.status(404).json({
            message: 'No entries found',
          });
        }
      });
  } catch (error) {
    next(error);
  }
});

/**
 * @route Get /backlog/tasks
 * @desc Return all backlog tasks
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.get('/backlog/tasks', async (req, res, next) => {
  try {
    Task.find({})
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          res.status(200).json(docs);
        } else {
          res.status(404).json({
            message: 'No entries found',
          });
        }
      });
  } catch (error) {
    next(error);
  }
});

/**
 * @route Delete /delete/:taskId
 * @desc Deletes specific task
 * @param taskId id of task
 * @acces public
 */
router.delete('/delete/:taskId', async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const result = await Task.deleteOne({ _id: taskId });
    if (result.acknowledged && result.deletedCount === 1) {
      res.status(200).json({ message: 'Successfully deleted!' });
    } else {
      res.status(404).json({
        message: 'No entries found',
      });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route Put /update
 * @desc Update of specific task
 * @param data contain title, points, done, id, story_id
 * @acces public
 */
router.put('/update', async (req, res, next) => {
  const data = req.body;
  const { title, points, done, id, story_id, assigned_user } = data;
  console.log(assigned_user);
  try {
    await Task.findByIdAndUpdate(
      { _id: id },
      {
        title,
        points,
        done,
        updated_at: new Date(),
        assigned_user,
      }
    ).then((doc) => {
      return res.status(200).send({ doc, message: 'Update successful!' });
    });
  } catch (error) {
    next(error);
  }
  const tasks = await Task.find({
    story_id,
    done: true,
  });

  let progressPoints = 0;
  tasks.map((item) => {
    progressPoints += item.points;
    return item;
  });

  try {
    await Story.findByIdAndUpdate(
      { _id: data.story_id },
      {
        progress: progressPoints,
        updated_at: new Date(),
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
