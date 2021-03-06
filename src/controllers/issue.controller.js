const issueRepo = require("../repositories/issue.repository");
const projectRepo = require("../repositories/project.repository");

const {errorGeneralMessages} = require("../util/constants");
const titlesIssue = require('../util/constants').global.titles.issue;
const {routes} = require('../util/constants').global;
const viewsIssue = require('../util/constants').global.views.issue;

module.exports.getProjectIssues = (req, res) => {
  const userId = req.session.user._id;
  const {projectId} = req.params;
  const {issueId} = req.params;

  return issueRepo
    .getProjectIssues(projectId, userId)
    .then(project => {
      if (project) {
        const isPo = (project.projectOwner.toString() === userId.toString());
        const isPm = (project.collaborators.findIndex(collaborator =>
          (collaborator._id.toString() === userId.toString() && collaborator.userType === "pm")) >= 0);

        return res.render(viewsIssue.issues, {
          pageTitle: titlesIssue.issues,
          activeIssue: issueId,
          url: 'iss',
          isPo: isPo,
          isPm: isPm,
          project
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getAdd = (req, res) => {
  const {projectId} = req.params;

  return projectRepo
    .hasAuthorizationOnProject(projectId, req.session.user._id, ["po", "pm"])
    .then(result => {
      if (result) {
        return res.render(viewsIssue.addEdit, {
          pageTitle: titlesIssue.add,
          errors: [],
          values: undefined,
          projectId: projectId,
          url: 'iss',
          editing: false,
          project: {id: projectId}
        });
      } else {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.issue.issues(projectId));
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.postIssue = (req, res) => {
  const issue = {
    userType: req.body.userType,
    userGoal: req.body.userGoal,
    userReason: req.body.userReason,
    difficulty: req.body.difficulty,
    storyId: req.body.storyId,
    priority: req.body.priority,
    testLink: req.body.testLink
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsIssue.addEdit, {
      pageTitle: titlesIssue.add,
      errors: req.validation.errors,
      values: issue,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'iss',
      editing: false
    });
  }

  return issueRepo.createIssue(req.params.projectId, issue, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.project.project(req.params.projectId));
      }

      req.flash("toast", "Issue créée avec succès !");
      return res.status(201).redirect(routes.issue.issues(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.getEdit = (req, res) => {
  const {issueId} = req.params;

  issueRepo
    .getProjectIssues(req.params.projectId, req.session.user._id)
    .then(project => {
      if (!project) {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }

      const issue = project.issues.find(issue => issue._id.toString() === issueId.toString());

      if (!issue) {
        req.flash("toast", errorGeneralMessages.accessNotAuthorized);
        return res.status(403).redirect(routes.index);
      }

      return res.render(viewsIssue.addEdit, {
        pageTitle: titlesIssue.edit,
        errors: [],
        values: issue,
        projectId: req.params.projectId,
        url: 'iss',
        editing: true,
        project
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.putEdit = (req, res) => {
  const issue = {
    _id: req.params.issueId,
    userReason: req.body.userReason,
    userType: req.body.userType,
    userGoal: req.body.userGoal,
    storyId: req.body.storyId,
    difficulty: req.body.difficulty,
    priority: req.body.priority,
    testLink: req.body.testLink
  };

  if (!req.validation.success) {
    return res.status(422).render(viewsIssue.addEdit, {
      pageTitle: titlesIssue.edit,
      errors: req.validation.errors,
      values: issue,
      projectId: req.params.projectId,
      project: {id: req.params.projectId},
      url: 'iss',
      editing: true
    });
  }
  return issueRepo
    .updateIssue(req.params.projectId, issue, req.session.user._id)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.error);
        return res.status(403).redirect(routes.issue.issues(req.params.projectId));
      }

      req.flash("toast", "Issue mise à jour !");
      return res.status(201).redirect(routes.issue.issues(req.params.projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};

module.exports.deleteIssue = (req, res) => {
  const {projectId} = req.params;
  const {issueId} = req.params;
  const userId = req.session.user._id;

  issueRepo
    .deleteIssue(projectId, issueId, userId)
    .then(result => {
      if (!result.success) {
        req.flash("toast", result.errors.error);
        return res.status(403).redirect(routes.index);
      }
      req.flash("toast", "Issue supprimée avec succès !");
      return res.status(200).redirect(routes.issue.issues(projectId));
    })
    .catch(err => {
      console.log(err);
      return res.status(500).redirect(routes.error["500"]);
    });
};
