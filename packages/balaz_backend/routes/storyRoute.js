/* eslint-disable camelcase */
const express = require('express');
const mongoose = require('mongoose');
const Story = require('../models/story');
const Sprint = require('../models/sprint');

const {
  filterActiveStories,
  filterBacklogStories,
} = require('../services/storyService');

const router = express.Router();

/**
 * @route Post /create
 * @desc Create new story
 * @param data contain of user_id, sprint_title, project_id, title, description, progress
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/create', async (req, res) => {
  const data = req.body;
  const { user_id } = data;
  const { sprint_title } = data;
  const { project_id } = data;
  const { title } = data;
  const { description } = data;
  const progress = 0;
  const created_at = new Date();
  const updated_at = new Date();
  const changed = null;

  if (!(user_id && project_id)) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }
  const sprint = await Sprint.find({
    title: sprint_title,
    project_id,
  }).exec();
  let sprint_id;
  if (sprint.length > 0) {
    // eslint-disable-next-line no-underscore-dangle
    sprint_id = sprint[0]._id;
  }

  if (!(title && description && sprint)) {
    return res
      .status(400)
      .send({ error: 'Fields are not formatted properly!' });
  }
  // creating a new mongoose doc from user data
  const story = new Story({
    _id: new mongoose.Types.ObjectId(),
    user_id,
    sprint_title,
    sprint_id,
    project_id,
    title,
    description,
    progress,
    created_at,
    updated_at,
    changed,
  });

  story
    .save()
    // eslint-disable-next-line prettier/prettier
    .then((doc) => {
      return res.status(200).send({ doc, massage: 'Story created!' });
    });
});

/**
 * @route Get /projectId
 * @desc Return story for specific project#
 * @param projectID id of project
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.get('/:projectId', async (req, res) => {
  const project_Id = req.params.projectId;
  const stories = await filterActiveStories(project_Id);
  return res.status(200).json(stories);
});

/**
 * @route Get /projectId
 * @desc Return story for specific backlog project
 * @param projectID id of project
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.get('/backlog/:projectId', async (req, res) => {
  const project_Id = req.params.projectId;
  const stories = await filterBacklogStories(project_Id);
  return res.status(200).json(stories);
});

/**
 * @route Get /sprint/:sprintId
 * @desc Return stories for specific sprint
 * @param sprintId id of sprint
 * @acces public
 */
router.get('/sprint/:sprintId', async (req, res, next) => {
  const { sprintId } = req.params;
  try {
    Story.find({ sprint_id: sprintId })
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
 * @route Delete /delete/:storyId
 * @desc Deletes specific story
 * @param storyId id of story
 * @acces public
 */
router.delete('/delete/:storyId', async (req, res, next) => {
  const { storyId } = req.params;
  try {
    const result = await Story.deleteOne({ _id: storyId });
    if (result.acknowledged && result.deletedCount === 1) {
      res.status(200).json({ massage: 'Successfully deleted!' });
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
 * @desc Update story info
 * @acces public
 */
router.put('/update', async (req, res, next) => {
  const data = req.body;
  const story = await Story.findOne({ _id: data.story_id });
  const { title, description } = data;
  let { sprint_title } = data;

  if (data.sprint_title === '') {
    sprint_title = story.sprint_title;
  }

  try {
    await Story.findByIdAndUpdate(
      { _id: data.story_id },
      {
        title,
        description,
        sprint_title,
        updated_at: new Date(),
      }
    ).then((doc) => {
      return res.status(200).send({ doc, message: 'Update successful!' });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
