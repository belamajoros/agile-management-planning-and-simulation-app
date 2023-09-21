const User = require('../models/user');
const Project = require('../models/project');
const Task = require('../models/task');

/**
 * @create Filter users
 * @desc Function is filtering all users in the team witch have correct role for the task
 * @param {String} Predictioned Role of position
 * @param {String} projectId Id of the project
 * @return {Array} Array of all suitable users
 */
module.exports.getUsersWithSpecificRole = async (
  predictionedRole,
  projectId
) => {
  try {
    const project = await Project.find({ _id: projectId }).then((response) => {
      return response[0];
    });

    let suitAbleUser = await Promise.all(
      project.members.map(async (member) => {
        const user = await User.find({
          email: member,
          position: predictionedRole,
          // eslint-disable-next-line consistent-return
        }).then((response) => {
          if (response.length !== 0) {
            return response[0].email;
          }
        });
        return user;
      })
    );
    suitAbleUser = suitAbleUser.filter((item) => {
      return item !== undefined;
    });

    return suitAbleUser;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @create Assigning user to task
 * @desc Filtering all users contained in team and then choosing the correct one
 * @param {Object} users contain all users that are included in team
 * @return {String} Email of the assigned user to the task
 */
module.exports.assignUser = async (users) => {
  try {
    const busyUsers = [];
    let assignedUser;
    // eslint-disable-next-line array-callback-return
    await users.map((email) => {
      Task.find({ assigned_user: email }).then(() => {
        return busyUsers.push(email);
      });
    });
    const suitableUsers = users.filter((val) => {
      return !busyUsers.includes(val);
    });

    if (suitableUsers.length !== 0) {
      // eslint-disable-next-line prettier/prettier
      assignedUser = suitableUsers[Math.floor(Math.random() * suitableUsers.length)];
    } else {
      assignedUser = users[Math.floor(Math.random() * users.length)];
    }
    return assignedUser;
  } catch (error) {
    throw new Error(error);
  }
};
