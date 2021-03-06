/**
 * release repository module
 * @module repositories/release
 */

const mongoose = require('mongoose');
const dateformat = require('dateformat');
const Project = mongoose.model('Project');
const { errorGeneralMessages } = require('../util/constants');

const dateFormatString = 'dd/mm/yyyy';

/**
 * returns a list of releases of a project given its id
 * @param {string} projectId - the id a project
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.getProjectReleases = (projectId, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(undefined);

  return Project
    .findOne({_id: projectId, 'collaborators._id': userId}, 'title active releases projectOwner collaborators')
    .then(project => {
      if (!project) return resolve(undefined);
      project = project.toJSON();
      const proj = {
        id: projectId,
        active: project.active,
        title: project.title,
        releases: project.releases,
        projectOwner: project.projectOwner,
        collaborators: project.collaborators
      };
      proj.releases = proj.releases.map(r =>
        Object.assign({}, r, { releaseDate: dateformat(r.releaseDate, dateFormatString) })
      );
      return resolve(proj);
    })
    .catch(err => reject(err));
});

/**
 * add a release into a project
 * @param {string} projectId - the id of the project to add the release in
 * @param {Object} release - the release to add
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.createRelease = (projectId, release, userId) => new Promise((resolve, reject) => {
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve({success: false, error: errorGeneralMessages.notAllowed});

  return Project.findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project) {
        return resolve({success: false, error: errorGeneralMessages.notAllowed});
      }

      project.releases.push(release);
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});

/**
 * updates a release in a project
 * @param {string} projectId - the id of the project to update the release in
 * @param {Object} release - the release to update
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.updateRelease = (projectId, release, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, error: errorGeneralMessages.modificationNotAllowed};

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return resolve(errorMessage);
  }
  const set = {};
  for (const field in release) {
    if (field !== '_id') {
      set[`releases.$.${field}`] = release[field];
    }
  }
  return Project.findOneAndUpdate({
    _id: projectId,
    collaborators: {$elemMatch: {_id: userId, userType: {$in: ["po", "pm"]}}},
    "releases._id": release._id
  }, {$set: set})
    .then(project => {
      if (!project) return resolve(errorMessage);
      return resolve({success: true});
    })
    .catch(err => reject(err));
});

/**
 * removes a release from a project given its id
 * @param {string} projectId - the id of the project to remove the release from
 * @param {string} releaseId - the id of the release to remove
 * @param {string} userId - the id of the user who did the operation
 * @returns {Promise<Object>} an object represeting the result of this operation
 */
module.exports.deleteRelease = (projectId, releaseId, userId) => new Promise((resolve, reject) => {
  const errorMessage = {success: false, errors: {error: errorGeneralMessages.deleteNotAllowed}};
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(releaseId) || !mongoose.Types.ObjectId.isValid(userId))
    return resolve(errorMessage);

  return Project
    .findIfUserType(projectId, userId, ['po', 'pm'])
    .then(project => {
      if (!project)
        return resolve(errorMessage);

      project.releases = project.releases.filter(release => release._id.toString() !== releaseId.toString());
      return project.save();
    })
    .then(() => resolve({success: true}))
    .catch(err => reject(err));
});
