/* eslint-disable array-callback-return */
const { filterActiveSprints, filterBacklogprints } = require('./sprintService');
const Story = require('../models/story');

/**
 * @create Filter stories
 * @desc Filtering all active stories for project
 * @param {String} Project_id id of the project
 * @return {Array} Array of filtered story objects
 */
// eslint-disable-next-line camelcase
module.exports.filterActiveStories = async (project_Id) => {
  const stories = [];

  try {
    const sprints = await filterActiveSprints(project_Id);

    await Story.find({ project_id: project_Id })
      .exec()
      .then((item) => {
        if (item.length >= 0) {
          stories.push(item);
        }
      });

    const filteredActiveStories = [];
    stories[0].filter((story) => {
      sprints.map((sprint) => {
        if (story.sprint_title === sprint.title) {
          filteredActiveStories.push(story);
        }
      });
    });

    return filteredActiveStories;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @create Filter backlog stories
 * @desc Filtering all non-active stories for project
 * @param {String} Project_id id of the project
 * @return {Array} Array of filtered story objects
 */
// eslint-disable-next-line camelcase
module.exports.filterBacklogStories = async (project_Id) => {
  const stories = [];

  try {
    const sprints = await filterBacklogprints(project_Id);

    await Story.find({ project_id: project_Id })
      .exec()
      .then((item) => {
        if (item.length >= 0) {
          stories.push(item);
        }
      });

    const filteredBacklogStories = [];
    stories[0].filter((story) => {
      sprints.map((sprint) => {
        if (story.sprint_title === sprint.title) {
          filteredBacklogStories.push(story);
        }
      });
    });

    return filteredBacklogStories;
  } catch (error) {
    throw new Error(error);
  }
};
