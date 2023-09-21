/* eslint-disable camelcase */
const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/project');
const ProjectError = require('../errors/ProjectError');

const router = express.Router();

const User = require('../models/user');

/**
 * @route Post /create
 * @desc Create new project
 * @param data contains of user_id, title, members, description
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/create', async (req, res) => {
  const data = req.body;
  const { user_id } = data;
  // const { slug } = data;
  const { title } = data;
  const members = [];
  const { description } = data;
  const created_at = new Date();
  const updated_at = new Date();

  const user = await User.findOne({
    _id: user_id,
  });
  if (!user) {
    return res.status(400).json({
      message: 'User does not exist',
    });
  }

  if (!user_id) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }

  if (!(title && description)) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }
  // creating a new mongoose doc from user data
  const project = new Project({
    _id: new mongoose.Types.ObjectId(),
    user_id,
    // slug,
    title,
    members,
    description,
    created_at,
    updated_at,
  });

  project
    .save()
    // eslint-disable-next-line prettier/prettier
    .then((doc) => {
      return res.status(200).send({ doc, massage: 'Succesfully registrated!' });
    });
});

router.get('/allProjects', async (req, res, next) => {
  try {
    Project.find()
      .exec()
      .then((projects) => {
        if (projects) {
          return res.status(200).json(projects);
        }
        return res
          .status(404)
          .json({ message: 'No record of Project does exist.' });
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error,
        });
      });
  } catch (error) {
    next(error);
  }
});

/**
 * @route Post /all
 * @desc Return all existing projects for user
 * @param data contains of user_id, email
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.post('/all', async (req, res, next) => {
  const data = req.body;
  const { user_id } = data;
  const { email } = data;
  const projects = [];

  const user = await User.findOne({
    _id: user_id,
  });
  if (!user) {
    return res.status(400).json({
      message: 'User does not exist',
    });
  }

  if (!user_id) {
    return res.status(400).send({ error: 'Ids are not formatted properly!' });
  }
  try {
    await Project.find({ user_id })
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          // eslint-disable-next-line array-callback-return
          docs.map((project) => {
            projects.push(project);
          });
        } else {
          res.status(404).json({
            message: 'No entries found',
          });
        }
      });

    await Project.find({ members: email })
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          // eslint-disable-next-line array-callback-return
          docs.map((project) => {
            projects.push(project);
          });
        } else {
          res.status(404).json({
            message: 'No entries found',
          });
        }
      });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

/**
 * @route Get /user/:userId
 * @desc Returns specific user of project
 * @param userId id of user
 * @acces public
 */
router.get('/user/:userId', async (req, res, next) => {
  const id = req.params.userId;
  try {
    Project.find({ user_id: id })
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
 * @route Get /:projectId
 * @desc Return specific project
 * @param projectId id of project
 * @acces public
 */
router.get('/:projectId', async (req, res, next) => {
  const id = req.params.projectId;
  try {
    Project.find({ _id: id })
      .exec()
      .then((docs) => {
        if (docs.length >= 0) {
          res.status(200).json(docs[0]);
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
 * @route Get /backlog/:userId
 * @desc Returns back projects for user
 * @param userId id of user
 * @acces public
 */
router.get('/backlog/:userId', async (req, res, next) => {
  const id = req.params.userId;
  try {
    Project.find({ user_id: id })
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
 * @route Put /update
 * @desc Updates project info
 * @param data contain id, title, description
 * @acces public
 */
router.put('/update', async (req, res, next) => {
  const data = req.body;
  const { id, title, description } = data;

  try {
    await Project.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        updated_at: new Date(),
      }
    ).then((doc) => {
      return res.status(200).send({ doc, message: 'Update successful!' });
    });
  } catch (error) {
    next(error);
  }
});
/**
 * @route Put /member
 * @desc Adding member to project
 * @acces public
 */
// eslint-disable-next-line consistent-return
router.put('/member', async (req, res) => {
  const data = req.body;
  const { projectId, email } = data;
  const project = await Project.findById({ _id: projectId }).then();

  if (project === undefined) {
    throw new ProjectError(`Project ${projectId} has not been found!`);
  }

  const filteredEmail = email.match(
    new RegExp(/[A-Za-z0-9]+@[A-Za-z0-9]+.[A-Za-z0-9]+/)
  );

  let alreadyExists = false;
  try {
    project.members.map((item) => {
      if (item === filteredEmail[0]) {
        alreadyExists = true;
      }
      return alreadyExists;
    });

    if (!alreadyExists) {
      await Project.updateOne(
        { _id: projectId },
        {
          $push: { members: filteredEmail[0] },
          updated_at: new Date(),
        }
      ).then((doc) => {
        if (doc) {
          return res
            .status(200)
            .send({ doc, message: 'User successfully added!' });
        }
        return res.status(404).json({
          message: 'No entries found',
        });
      });
    } else {
      return res.status(404).json({
        message: 'User is already in project!',
      });
    }
  } catch (error) {
    throw new ProjectError('User was not included into project!');
  }
});
/**
 * @route Put /member/delete
 * @desc Delets member of projects
 * @acces public
 */
router.put('/member/delete', async (req, res) => {
  const data = req.body;
  const { projectId, email } = data;

  try {
    await Project.updateOne(
      { _id: projectId },
      {
        $pull: { members: email },
        updated_at: new Date(),
      }
    ).then((doc) => {
      if (doc) {
        return res
          .status(200)
          .send({ doc, message: 'User successfully added!' });
      }
      return res.status(404).json({
        message: 'No entries found',
      });
    });
  } catch (error) {
    throw new ProjectError('User was not included into project!');
  }
});
/**
 * @route Delete /delete/:projectId
 * @desc Deletes specific project
 * @param projectId id of project
 * @acces public
 */
router.delete('/delete/:projectId', async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const result = await Project.deleteOne({ _id: projectId });
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

module.exports = router;
