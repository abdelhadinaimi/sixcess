/**
 * test repository module
 * @module repositories/test
 */

const mongoose = require("mongoose");
const Project = mongoose.model("Project");

/**
 * returns a list of a project tests
 * @param {string} projectId - the id a project
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.getProjectTests = (projectId, userId) =>
  new Promise((resolve, reject) => {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
      return resolve(undefined);

    return Project.findOne({ _id: projectId, "collaborators._id": userId })
      .then(project => {
        if (!project) return resolve(undefined);
        const proj = {
          id: projectId,
          title: project.title,
          projectOwner: project.projectOwner,
          collaborators: project.collaborators,
          tasksBySprint: [],
          issuesToTest: project.issues.filter(issue => !!issue.testLink),
          validationTests: []
        };
        project.sprints.forEach(sprint => {
          const tasks = [];
          project.tasks.forEach(task => {
            if (task.linkedSprint.toString() === sprint._id.toString() && task.testLink) {
              tasks.push(task);
            }
          });
          if(tasks.length != 0){
            proj.tasksBySprint.push({ tasks:tasks, sprint: { _id: sprint._id, id: sprint.id } });
          }
        });
        return resolve(proj);
      })
      .catch(err => reject(err));
  });
