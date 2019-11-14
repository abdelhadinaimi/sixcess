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
  if (project.dueDate && project.dueDate.length > 0) {
    const [day, month, year] = project.dueDate.split('/');
    newProject.dueDate = new Date(year, month - 1, day);
  }
  if (project.description && project.description.length > 0) {
    newProject.description = project.description;
  }
  newProject.projectOwner = project.projectOwner;
  newProject.collaborators = [{
    _id: project.projectOwner,
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

module.exports.deleteProject = (projectId, userId) => new Promise(resolve => {
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
    .catch(err => resolve({success: false, errors: {error: err}}));
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
    .find({'collaborators._id': contributorId}, 'title description createdAt dueDate collaborators projectOwner')
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

/** ISSUES */

module.exports.getProjectIssues = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title issues')
    .then(project => {
      if (!project) return resolve(undefined);
      const proj = {id: projectId, title: project.title, issues: project.issues};
      return resolve(proj);
    })
    .catch(err => reject(err));
});

module.exports.createIssue = (projectId, issue, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.notAllowed});

  return Project.findIfUserType(projectId, userId,['po','pm'])
    .then(project => {
      if (!project) {
        return resolve({success: false, error: errorGeneralMessages.notAllowed});
      }

      project.issues.push(issue);
      return project.save()
      .then(() => resolve({success: true}))
      .catch(()=> resolve({success: false, error:"Erreur interne"}));
    })
    .catch(err => reject(err));
});

module.exports.updateIssue = (projectId, issue, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return resolve(errorMessage);
  }
  const set = {};
  for (const field in issue) {
    if (field !== '_id') {
      set[`issues.$.${field}`] = issue[field];
    }
  }
  return Project.findOneAndUpdate({
    _id: projectId,
    collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po", "pm"]}}},
    "issues._id": issue._id
  }, {$set: set})
    .then(project => {
      if (!project) return reject(errorMessage);
      return resolve({success: true});
    })
    .catch(err => reject(err));
});

module.exports.deleteIssue = (projectId, issueId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(issueId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}});

  return Project
    .findIfUserType(projectId, userId,['po','pm'])
    .then(project => {
      if (!project)
        return resolve({success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}});

      project.issues = project.issues.filter(issue => issue._id.toString() !== issueId.toString());

      return resolve(project.save());
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

module.exports.updateUserRole = (projectId, userId, user) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};

  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId) || userId === user._id){
    return resolve(errorMessage);
  }

  return Project.findOneAndUpdate({
    _id: projectId,
    collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po"]}}},
    "collaborators._id": user._id
  }, {$set: {"collaborators.$.userType":user.role}})
    .then(project => {
      if (!project) return reject(errorMessage);
      return resolve({success: true});
    })
    .catch(err => reject(err));
});
