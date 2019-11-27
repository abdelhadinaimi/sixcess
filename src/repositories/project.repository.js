const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const {errorGeneralMessages} = require('../util/constants');
const dateformat = require('dateformat');

const dateFormatString = 'dd/mm/yyyy';

module.exports.createProject = project => new Promise((resolve, reject) => {
  const newProject = new Project();
  if (project.id)
    newProject._id = project.id;
  newProject.title = project.title;
  console.log("due_before= " + project.dueDate);
  if (project.dueDate && project.dueDate.length > 0) {
    const [day, month, year] = project.dueDate.split('/');
    newProject.dueDate = new Date(year, month - 1, day);
  }
  console.log("due_after= " + newProject.dueDate);
  if (project.description && project.description.length > 0) {
    newProject.description = project.description;
  }
  newProject.projectOwner = project.projectOwner;
  newProject.collaborators = [{
    _id: project.projectOwner,
    activated: true,
    userType: 'po',
    addedBy: project.projectOwner
  }];
  newProject.issues = [];

  newProject
    .save()
    .then(() => resolve(true))
    .catch(err => reject(err));
});

module.exports.updateProject = (project, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(project.id) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.modificationNotAllowed});

  return Project
    .findOne({_id: project.id, projectOwner: userId})
    .then(projectToUpdate => {
      if (!projectToUpdate) return resolve({success: false, error: errorGeneralMessages.modificationNotAllowed});

      projectToUpdate.title = project.title;
      if (project.dueDate && project.dueDate.length > 0) {
        const [day, month, year] = project.dueDate.split('/');
        projectToUpdate.dueDate = new Date(year, month - 1, day);
      } else {
        projectToUpdate.dueDate = null;
      }
      if (project.description && project.description.length > 0)
        projectToUpdate.description = project.description;
      else
        projectToUpdate.description = null;

      return projectToUpdate.save()
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err))
});

module.exports.deleteProject = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}});

  return Project
    .findOne({_id: projectId, projectOwner: userId})
    .then(project => {
      if (!project)
        return resolve({success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}});

      return project.delete();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

module.exports.getProjectById = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId})
    .populate('collaborators._id')
    .populate('collaborators.addedBy')
    .then(project => {
      if (!project) return resolve(undefined);

      const proj = {
        id: projectId,
        title: project.title,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      };

      if (project.issues.length !== 0) {
        const labels = [];
        const associateNbIssueToDate = [];
        const endDate = project.dueDate ? project.dueDate : new Date();
        const nbDays = Math.round((endDate.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 2;
        for (let i = 0; i < nbDays; i++) {
          const date = new Date(project.createdAt.valueOf());
          date.setDate(project.createdAt.getDate() + i);
          const dateStr = dateformat(date, dateFormatString);
          labels.push(dateStr);
          associateNbIssueToDate[dateStr] = 0;
        }
        let totalDifficulty = 0;
        project.issues.forEach(issue => totalDifficulty += issue.difficulty);
        const ratioPerDay = totalDifficulty / (nbDays - 1);
        const idealDifficulty = [];
        for (let i = totalDifficulty; i >= 0; i -= ratioPerDay)
          idealDifficulty.push(Math.round(i * 100) / 100);
        project.issues.forEach(issue => {
          const tasksIssue = project.tasks.filter(task =>
            !!task.linkedIssues.find(linkedIssue => linkedIssue._id.toString() === issue._id.toString()));
          if (tasksIssue.length === 0) return;
          if (tasksIssue.filter(task => task.state !== 'DONE').length === 0) {
            const dates = [];
            tasksIssue.forEach(task => dates.push(task.doneAt));
            const maxDate = Math.max.apply(null, dates);
            const maxDateStr = dateformat(maxDate, dateFormatString);
            associateNbIssueToDate[maxDateStr] += issue.difficulty;
          }
        });
        const realDifficulty = [];
        labels.forEach(label => {
          totalDifficulty -= associateNbIssueToDate[label];
          realDifficulty.push(totalDifficulty);
        });

        proj.burndown = {
          labels: labels,
          datasets: [{
            label: 'Difficulté Restante Idéale',
            borderColor: 'rgb(39, 99, 255)',
            backgroundColor: 'rgb(0, 0, 0, 0)',
            data: idealDifficulty
          }, {
            label: 'Difficulté Restante Réelle',
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(0, 0, 0, 0)',
            data: realDifficulty
          }]
        };

        proj.burndown = JSON.stringify(proj.burndown);
      }

      if (project.description)
        proj.description = project.description;
      if (project.createdAt)
        proj.createdAt = dateformat(project.createdAt, dateFormatString);
      if (project.dueDate)
        proj.dueDate = dateformat(project.dueDate, dateFormatString);

      return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.getProjectsByContributorId = contributorId => new Promise((resolve, reject) => {
  return Project
    .find({
      collaborators: {
        $elemMatch: {
          _id: contributorId,
          activated: true
        }
      }
    }, 'title description createdAt dueDate collaborators projectOwner')
    .then(projects => {
      projects = projects.map(project => {
        const newProject = {id: project._id, title: project.title};
        newProject.contributorNb = project.collaborators.length;
        newProject.beginDate = dateformat(project.createdAt, dateFormatString);
        if (project.description)
          newProject.description = project.description;
        if (project.dueDate)
          newProject.endDate = dateformat(project.dueDate, dateFormatString);
        if (project.projectOwner.toString() === contributorId.toString()) {
          newProject.deleteEdit = true;
        }

        return newProject;
      });

      return resolve(projects);
    })
    .catch(err => reject(err));
});

module.exports.isContributorFromProject = (projectId, contributorId) => new Promise((resolve, reject) => {
  Project
    .findOne({_id: projectId, 'collaborators._id': contributorId})
    .then(project => {
      if (project)
        return resolve(true);
      return resolve(false);
    })
    .catch(err => reject(err));
});

module.exports.hasAuthorizationOnProject = (projectId, contributorId, authorization) => new Promise((resolve, reject) => {
  Project
    .findIfUserType(projectId, contributorId, authorization)
    .then(project => project ? resolve(true) : resolve(false))
    .catch(err => reject(err));
});

module.exports.addContributorToProject = (projectId, contributorId, addId) => new Promise((resolve, reject) => {
  Project
    .findIfUserType(projectId, addId, ['po', 'pm'])
    .then(project => {
      if (!project)
        return resolve(false);

      project.collaborators.push({
        _id: contributorId,
        userType: 'user',
        addedBy: addId
      });
      return project.save();
    })
    .then(() => resolve(true))
    .catch(err => reject(err));
});

module.exports.removeContributorToProject = (projectId, userId, remId) => new Promise((resolve, reject) => {
  Project
    .findIfUserType(projectId, remId, ['po', 'pm', userId === remId ? 'user' : ''])
    .then(project => {
      if (!project)
        return resolve(false);

      project.collaborators = project.collaborators.filter(collaborator => collaborator._id.toString() !== userId.toString());
      return project.save();
    })
    .then(() => resolve(true))
    .catch(err => reject(err));
});

module.exports.acceptInvitation = (projectId, contributorId) => new Promise((resolve, reject) => {
  Project
    .findOne({_id: projectId, collaborators: {$elemMatch: {_id: contributorId, activated: false}}})
    .then(project => {
      if (!project)
        return resolve(false);

      const user = project.collaborators.find(collaborator => (collaborator._id.toString() === contributorId));
      user.activated = true;

      return project.save();
    })
    .then(() => resolve(true))
    .catch(err => reject(err));
});

module.exports.updateUserRole = (projectId, userId, user) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};

  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId) || userId === user._id) {
    return resolve(errorMessage);
  }

  return Project.findOneAndUpdate({
    _id: projectId,
    collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po"]}}},
    "collaborators._id": user._id
  }, {$set: {"collaborators.$.userType": user.role}})
    .then(project => {
      if (!project) return reject(errorMessage);
      return resolve({success: true});
    })
    .catch(err => reject(err));
});
