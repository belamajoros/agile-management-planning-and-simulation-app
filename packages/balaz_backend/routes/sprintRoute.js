/* eslint-disable camelcase */
const express = require('express');
const mongoose = require('mongoose');
const Sprint = require('../models/sprint');

const {
  filterActiveSprints,
  filterBacklogprints,
} = require('../services/sprintService');

const router = express.Router();

/**
 * @route Post /create
 * @desc Create new sprint
 * @param data contains of user_id, project_id, title, status, startDate, endDate
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/create', async (req, res) => {
  const data = req.body;
  const { user_id } = data;
  const { project_id } = data;
  const { title } = data;
  const status = 'New sprint';
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const created_at = new Date();
  const updated_at = new Date();
  const changed = null;

  if (!(user_id && project_id)) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }

  if (!(title && status)) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }
  // creating a new mongoose doc from user data
  const sprint = new Sprint({
    _id: new mongoose.Types.ObjectId(),
    user_id,
    project_id,
    title,
    status,
    startDate,
    endDate,
    created_at,
    updated_at,
    changed,
  });

  sprint
    .save()
    // eslint-disable-next-line prettier/prettier
    .then((doc) => {
      return res
        .status(200)
        .send({ doc, massage: 'Sprint succesfully created!' });
    });
});

/**
 * @route Get /sprint/projectID
 * @desc returns all activeSprints
 * @acces public
 */
router.get('/:projectId', async (req, res) => {
  const project_Id = req.params.projectId;
  const sprints = await filterActiveSprints(project_Id);
  return res.status(200).json(sprints);
});

/**
 * @route Get /backlog/:projectId
 * @desc Return sprint for specific backlog project
 * @acces public
 */
router.get('/backlog/:projectId', async (req, res) => {
  const project_Id = req.params.projectId;
  const sprints = await filterBacklogprints(project_Id);
  return res.status(200).json(sprints);
});

/**
 * @route Get /project/:projectId
 * @desc Return all sprints of specific project
 * @param projectId id of project
 * @acces public
 */
router.get('/project/:projectId', async (req, res, next) => {
  const project_Id = req.params.projectId;
  try {
    Sprint.find({ project_id: project_Id })
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
 * @route delete /delete/:sprintId
 * @desc Delete specific sprint
 * @param printId id of sprint
 * @acces public
 */
router.delete('/delete/:sprintId', async (req, res, next) => {
  const { sprintId } = req.params;
  try {
    const result = await Sprint.deleteOne({ _id: sprintId });
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
 * @desc Update sprint inf
 * @param data contains id, title, status
 * @acces public
 */
router.put('/update', async (req, res, next) => {
  const data = req.body;
  const { id, title, status } = data;

  try {
    await Sprint.findByIdAndUpdate(
      { _id: id },
      {
        title,
        status,
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
