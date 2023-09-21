/* eslint-disable consistent-return */
const Sprint = require('../models/sprint');

/**
 * @create Filter sprints
 * @desc Filtering all active sprints for project
 * @param {String} Project_id id of the project
 * @return {Array} Array of filtered sprint objects
 */
// eslint-disable-next-line camelcase
module.exports.filterActiveSprints = async (project_Id) => {
  const sprints = [];
  const filteredSprints = [];

  try {
    await Sprint.find({ project_id: project_Id }).then((item) => {
      if (item.length >= 0) {
        sprints.push(item);
      }
    });
    // eslint-disable-next-line array-callback-return
    sprints[0].map((sprint) => {
      if (sprint.endDate.getTime() > new Date().getTime()) {
        filteredSprints.push(sprint);
      }
    });

    return filteredSprints;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @create Filter backlog sprints
 * @desc Filtering all non-active sprints for project
 * @param {String} Project_id id of the project
 * @return {Array} Array of filtered sprint objects
 */
// eslint-disable-next-line camelcase
module.exports.filterBacklogprints = async (project_Id) => {
  const sprints = [];
  const filteredSprints = [];

  try {
    await Sprint.find({ project_id: project_Id }).then((item) => {
      if (item.length >= 0) {
        sprints.push(item);
      }
    });
    // eslint-disable-next-line array-callback-return
    sprints[0].map((sprint) => {
      if (sprint.endDate.getTime() > new Date().getTime()) {
        filteredSprints.push(sprint);
      }
    });
    return filteredSprints;
  } catch (error) {
    throw new Error(error);
  }
};
