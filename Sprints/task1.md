# Tâches pour le Sprint 1

| ID | Description (*Definition of Done*) | Dépendance(s) | US liée(s) | Coût (j/h) | Affectée à | État |
| :-: | -- | :-: | :-: | :-: | :-: | :-: |
| T_INIT | Initialiser le projet Node.js, configurer docker-compose pour lancer le projet et une base de données (DB) Mongo, le projet est exposé sur le port 8080, et la DB sur le port 27017. On doit pouvoir faire “docker-compose up” et le projet doit être accessible sur notre machine. Créer deux fichiers de configuration **development.env** et **production.env**. Créer le fichier d’entrée **app.js** et initialiser le serveur Express et lancer le serveur sur le port 8080, créer le fichier **database.config.js** dans le répertoire */config/*, qui va initialiser une connexion à la base de données Mongo en utilisant Mongoose, en utilisant les données du fichier de configuration.  | - | - | 0.5 | Abdelhadi | DONE |
| T_USR_Cf | Créer le fichier **auth.config.js** dans le répertoire */config/* qui va initialiser et exposer des méthodes comme *authUser(userId)* pour authentifier un utilisateur et logout(userId) pour déconnecter un utilisateur. | - | US#02,03 | coût | X | TODO |
| T_IND_V | Créer le fichier **index-not-connected.ejs** dans le répertoire */views/index/* qui correspond à la page “Accueil”, affichée lorsqu’un utilisateur arrive sur l’URL */* et qu’il n’est pas connecté.<br /> Cette page importe le header **menu-connected.ejs** de */views/partials/*.<br /> En dessous de ce header, on trouve deux boutons. Le premier est “Se Connecter” qui redirige vers l’URL */login* et le second “S’inscrire” qui redirige vers l’URL */register*. | - | US#01,02 | 0,5 | X | TODO |
| T_INDd_RgC | Créer la route **/** dans le fichier **/routes/index.routes.js**, méthode GET. Créer la fonction *getIndex()* dans le contrôleur **/controllers/index.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/index/index-not-connected.ejs** si on n’est pas connecté. En se rendant sur l’URL **/**, en n’étant pas connecté, la page permettant de se connecter ou de s’inscrire doit s’afficher. Si l’utilisateur est connecté, dessiner la vue **/views/index/index-connected.ejs** en appelant la fonction *ProjectController.getProjects(userId)* pour afficher les projets de cette utilisateur.| - | US#01 | 1 | X | TODO |
| T_REG_V | Créer le fichier **register.ejs** dans le répertoire */views/user/*, qui correspond à la page “Inscription”, affichée lorsqu’un utilisateur arrive sur l’URL */register*.<br /> Cette page contient un formulaire composé des champs “Adresse mail” (format valide d’une adresse mail, 256 char max, name : “email”), “Nom d’utilisateur” (unique, 20 char max, name : “username”) et “Mot de Passe” (composé d’au moins une majuscule, une minuscule et un chiffre, 8 char min et 32 max, name : “password”), ainsi que de deux boutons “S’inscrire” et “Annuler”.<br /> En cliquant sur "S’inscrire", on appelle la route */register* en méthode POST. Il est impossible de cliquer si tous les champs ne sont pas remplis.<br /> En cliquant sur "Annuler", on redirige l’utilisateur vers l’URL */*. | - | US#01 | 1 | X | TODO |
| T_REG_RgC | Créer la route **/register** dans le fichier **/routes/user.routes.js**, méthode GET. Créer la fonction *getRegisterUser()* dans le contrôleur **/controllers/user.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/user/register.ejs**. En se rendant sur l’URL */register* la page d’inscription doit s’afficher. | - | US#01 | 1 | X | TODO |
| T_REG_RpoC | Créer la route **/register** dans le fichier **/routes/user.routes.js**, méthode POST. Puis créer la fonction *postRegisterUser()* dans le contrôleur “*/controllers/user.controller.js*”, accepte un formulaire qui contient “email” (adresse mail au format valide), “username” (même validation que dans la vue) et “password” (même validation que dans la vue), appelle la méthode *createUser(user)* de l’objet */repositories/user.repository.js*, et fait un catch des erreurs. S’il y a une erreur, on fait un render du formulaire et on affiche les erreurs dans le formulaire ; sinon, on affiche “Utilisateur créé !”. | - | US#01 | coût | X | TODO |
| T_USR_Mod | Créer le fichier **user.model.js** dans le répertoire */models/*. Ce fichier contient la définition de la classe User, qui stocke les informations pour un utilisateur. La classe User est composée de : <br>\* id: integer, primary key, require, auto-increment<br>\* username: string, 20 char max, require<br>\* email: string, 256 char max, require<br>\* password : string, 8 char min et 32 max, require<br>\* projects : Array\<projectId\>| - | - | coût | X | TODO |
| T_LIN_V | Créer le fichier **login.ejs** dans le répertoire */views/user/*, qui correspond à la page “Connexion”, affichée lorsqu’un utilisateur arrive sur l’URL */login*.<br /> Cette page contient un formulaire composé des champs “Adresse mail” (format valide d’une adresse mail, 256 char max) et “Mot de Passe” (8 char min et 32 max), ainsi que de deux boutons “Se connecter” et “Annuler”.<br /> En cliquant sur "Se connecter", on appelle la route */login* en méthode POST. Il est impossible de cliquer si tous les champs ne sont pas remplis.<br /> En cliquant sur "Annuler", on redirige l’utilisateur vers l’URL */*. | - | US#02 | 1 | X | TODO |
| T_LIN_RpoC | Créer la route **/login** dans le fichier **/routes/user.routes.js**, méthode POST, créer la fonction *postLoginUser()* dans le contrôleur **/controllers/user.controller.js**, accepte un formulaire qui contient “email” (adresse mail au format valide) et “password” (même validation que dans la vue), appelle la fonction *checkLogin(username, password)* du fichier **/repositories/user.repository.js** puis appel la fonction *authUser(userId)* du fichier **/config/auth.config.js**, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#01 | coût | X | TODO |
| T_LIN_RgC | Créer la route **/login** dans le fichier **/routes/user.routes.js**, méthode GET, créer la fonction *getLoginUser()* dans le contrôleur **/controllers/user.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/user/login.ejs** si on n’est pas connecté | - | US#01 | coût | X | TODO |
| T_LOU_RgC | Créer la route **/logout** dans le fichier **/routes/user.routes.js**, méthode GET, créer la fonction *getLogoutUser()* dans le contrôleur **/controllers/user.controller.js**, lier la route au contrôleur. Puis dans le contrôleur appelle la fonction *logoutUser(userId)* du fichier **/config/auth.config.js** puis dessiner la vue **/views/user/index-not-connected.ejs** | - | US#03 | coût | X | TODO |
| T_UI1_V | Créer le fichier **menu-connected.ejs** dans le répertoire */views/partials/* qui correspond au menu de l’application. Il s’agit d’un header contenant à gauche le logo de l’application et son nom, et à droite un bouton dont le texte correspond au nom de l’utilisateur, affichant le menu déroulant {{{menu}}} lorsqu’on clique dessus.  | - | - | coût | X | TODO |
| T_INDc_V | Créer le fichier **index-connected.ejs** dans le répertoire */views/index/* qui correspond à la page “Accueil”, affichée lorsqu’un utilisateur arrive sur l’URL */* et qu’il est connecté.<br /> Cette page importe le header **menu-connected.ejs** de */views/partials/*.<br /> En dessous de ce header, on trouve un titre “Mes projets” suivi d’un bouton “Créer un projet”. Cliquer sur ce bouton redirige vers l’URL */new-project*.<br /> En dessous de ces éléments, on trouve une liste des projets de l’utilisateur, avec pour chaque entrée de cette liste les attributs “Titre” (128 char max), “Date de début” (format jj/mm/aaaa), “Date de fin” (format jj/mm/aaaa), “Pourcentage de complétion” et “Nombre de collaborateurs”. Chacune de ces entrées est cliquable et redirige vers l’URL */projects/:projectId*. | - | US#05,06,07 | coût | X | TODO |
| T_PRJ_Mod | Créer le fichier **project.model.js** dans le répertoire */models/*. Ce fichier contient la définition de la classe Project, qui stocke les informations pour un projet. (definition : https://gist.github.com/abdelhadinaimi/654914936fd8d7a23a9af17f3a0a272a)| - | - | coût | X | TODO |
| T_PRJ_Add_V | Créer le fichier **new-project.ejs** dans le répertoire */views/project* qui correspond à la page “Nouveau Projet”, affichée lorsqu’un utilisateur arrive sur l’URL */project/add*. Cette page contient un formulaire composé des champs “Titre” (128 char max, obligatoire, name: projectTitle), “Description” (3000 char max, optionnel, name: projectDesc) et “Date de rendu” (format jj/mm/aaaa, optionnel, name: projectReturnDate), ainsi que de deux boutons “Créer un projet” et “Annuler”.<br /> En cliquant sur "Créer un projet", on appelle la route */project/add* méthode POST. Il est impossible de cliquer si tous les champs obligatoires ne sont pas remplis.<br /> En cliquant sur "Annuler", on redirige l’utilisateur vers l’URL */*. | - | US#06 | coût | X | TODO |
| T_PRJ_Add_RpoC | Créer la route **/project/add** dans le fichier **/routes/project.routes.js**, méthode POST, créer la fonction *postAddProject()* dans le contrôleur **/controllers/project.controller.js**, accepte un formulaire qui contient “projectTitle”, “projectDesc”, “projectReturnDate” (même validation que dans la vue), appelle la fonction *createProject(project)* du fichier **/repositories/projects.repository.js**, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#06 | coût | X | TODO |
| T_PRJ_Add_RgC | Créer la route **/project/add** dans le fichier **/routes/project.routes.js**, méthode GET, créer la fonction *getAddProject()* dans le contrôleur **/controllers/project.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/project/new-project.ejs** | - | US#06 | coût | X | TODO |
| T_UI2_V | Créer le fichier **project-header.ejs** dans le répertoire */views/project/* qui correspond au header inclus dans chaque page dont l’URL commence par */project*. Ce header contient le logo de l’application, les onglets “Accueil”, “Issues”, “Tâches”, “Sprints”, “Releases”, “Tests” et “Documentation”, ainsi qu’un bouton dont le texte correspond au nom de l’utilisateur, affichant le menu déroulant {{{menu}}} lorsqu’on clique dessus. Les onglets cités précédemment redirigent respectivement l’utilisateur vers les URL */*, */issues*, */tasks*, */sprints*, */releases*, */tests*, */doc*, précédées de l’URL */projects/:projectId*, lorsqu’il clique dessus. | - | US#18 | coût | X | TODO |
| T_PRJ_V | Créer le fichier **project.ejs** dans le répertoire */views/project/* qui correspond à la page “Accueil Projet” du projet d’id *projectId*, affichée lorsqu’un utilisateur arrive sur l’URL */projects/:projectId*.<br />Cette page importe le header **project-header.ejs** de */views/project/*.<br /> En dessous de ce header, on trouve un titre dont le texte correspond au titre du projet, puis un bouton “Paramètres”, qui redirige vers l’URL */project/:projectId/settings* lorsqu’on clique dessus.<br />En dessous de ces éléments, on trouve un paragraphe contenant les dates de début et de fin du projet, un paragraphe contenant la description du projet et la liste de ses contributeurs. | - | US#08,09,18 | coût | X | TODO |
| T_PRJ_RgC | Créer la route **/project/:projectId** dans le fichier **/routes/project.routes.js**, méthode GET, créer la fonction *getProject()* dans le contrôleur **/controllers/project.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/project/project.ejs** | - | US#07 | coût | X | TODO |
| T_PRJ_SET_V | Créer le fichier **settings.ejs** dans le répertoire */views/project/* qui correspond à la page “Paramètres Projet” du projet d’id *projectId*, affichée lorsqu’un utilisateur arrive sur l’URL */project/settings/:projectId*.<br />Cette page importe le header **project-header.ejs** de */views/project/*.<br /> En dessous de ce header, on trouve un titre dont le texte correspond au titre du projet, suivi de deux boutons. Le premier est “Modifier les informations”, qui ouvre un modal à partir duquel on peut modifier les informations du projet (cf. T#XY). Le second est “Supprimer le projet”, qui ouvre une fenêtre pop-up contenant le texte “Êtes-vous bien sûr de vouloir supprimer ce projet ? Cette action est irréversible.” et deux boutons “Confirmer la suppression” et “Annuler”. <br>En cliquant sur le premier bouton de cette pop-up, le projet est supprimé. En cliquant sur le second, la pop-up se ferme. | - | US#08,09 | coût | X | TODO |
| T_PRJ_SET_RgC | Créer la route **/project/:projectId/settings** dans le fichier **/routes/project.routes.js**, méthode GET, créer la fonction *getProjectSettings()* dans le contrôleur **/controllers/project.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/project/settings.ejs** | - | US#08,09 | coût | X | TODO |
| T_PRJ_DLT_RdC | Créer la route **/project/:projectId** dans le fichier **/routes/project.routes.js**, méthode DELETE. Puis créer la fonction *deleteProject()* dans le contrôleur “*/controllers/project.controller.js*”, appelle la fonction *deleteProject(projectId)* du fichier **/repositories/projects.repository.js**,vérifie si cette utilisateur est le PO du projet, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#09 | coût | X | TODO |
| T_PRJ_SET_UPD_V | Modifier le fichier **settings.ejs** du répertoire */views/project/* pour ajouter un  modal contenant un formulaire composé des champs “Titre” (128 char max), “Description” (3000 char max) et “Date de rendu” (format jj/mm/aaaa), ainsi que de deux boutons “Enregistrer les modifications” et “Annuler”.<br /> En cliquant sur le premier bouton, on appelle la route */project/:projectId/* en méthode PUT. <br /> En cliquant sur "Annuler", on ferme le modal. | T#XX | US#08 | coût | X | TODO |
| T_PRJ_UPD_RpuC | Créer la route **/project/:projectId/** dans le fichier **/routes/project.routes.js**, méthode PUT. Puis créer la fonction *updateProject()* dans le contrôleur “*/controllers/project.controller.js*”accepte un formulaire qui contient “projectTitle”, “projectDesc”, “projectReturnDate” (même validation que dans la vue), appelle la fonction *updateProject(projectId,project)* du fichier **/repositories/projects.repository.js**, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#08 | coût | X | TODO |
| T_ISS_V | Créer le fichier **issues.ejs** dans le répertoire */views/project/* qui correspond à la page “Issues” du projet d’id *projectId*, affichée lorsqu’un utilisateur arrive sur l’URL */project/:projectId/issues/*.<br />Cette page importe le header **project-header.ejs** de */views/project/*.<br /> En dessous de ce header, on trouve un titre “Issues”, puis un bouton “Créer une issue”, qui ouvre un modal à partir duquel on peut entrer les informations nécessaires à la création d’une issue (cf. T#BY).<br />En dessous de ces éléments, on trouve une collapsible list des issues du projet, avec pour chaque entrée de la liste les attributs “Identifiant” (20 char max), “Description” (128 char max), “Niveau de priorité” (Faible/Moyen/Élevé), “Coût” et “Pourcentage de complétion”. En cliquant sur une entrée, on la fait se dérouler.<br> Une entrée déroulée doit contenir les éléments suivants :<br />\* un paragraphe User Story (affichant complètement le contenu des champs “En tant que”, “Je souhaite” et “Afin de” du formulaire décrit en tâche T#BY) ;<br />\* la liste des tâches liées à cette issue ;<br />\* l’identifiant du sprint à laquelle cette tâche est affectée.. | - | US#15 | coût | X | TODO |
| T_ISS_RgC | Créer la route **/project/:projectId/issues** dans le fichier **/routes/issues.routes.js**, méthode GET, créer la fonction *getProjectIssues()* dans le contrôleur **/controllers/issues.controller.js**. Lier la route au contrôleur. Puis dans le contrôleur dessiner la vue **/views/project/issues.ejs** | - | US#15 | coût | X | TODO |
| T_ISS_ADD_V | Modifier le fichier **issues.ejs** du répertoire */views/project/* pour ajouter un  modal contenant un formulaire composé des champs “En tant que”, “Je souhaite”, “Afin de” (1000 char max pour chacun, obligatoire), “Identifiant” (unique, 20 char max, optionnel) “Niveau de priorité” (Faible/Moyen/Élevé, optionnel), “Coût” (min. 1, obligatoire), “Test” (sous forme d’URL, 2000 char max, optionnel) ainsi que de deux boutons “Créer une issue” et “Annuler”.<br /> En cliquant sur le premier bouton, on appelle la route */project/:projectId/issues/* en méthode POST. <br /> En cliquant sur "Annuler", on ferme le modal. | - | US#15 | coût | X | TODO |
| T_ISS_ADD_RpoC | Créer la route **/project/:projectId/issues/** dans le fichier **/routes/issues.routes.js**, méthode POST, créer la fonction *postIssue()* dans le contrôleur **/controllers/project.controller.js**, accepte un formulaire qui contient “userType”, “userGoal”, “userReason”,”storyId”,”priority”,”cost”,”testLink” (même validation que dans la vue), appelle la fonction *createIssue(projectId,issue)* du fichier **/repositories/projects.repository.js**, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#15 | coût | X | TODO |
| T_ISS_UPD_V | Modifier le fichier **issues.ejs** du répertoire */views/project/* pour ajouter un bouton “Modifier” à chaque entrée de la liste des issues créée en tâche T#BX.<br />En cliquant sur ce bouton, un modal s’ouvre ; il contient un formulaire comprenant exactement les mêmes champs que celui décrit à la tâche T#BY, ainsi que deux boutons “Modifier les informations” et “Annuler”.<br /> Cliquer sur le bouton “Modifier les informations” appelle la route */projects/:projectId/issues/:issueId* méthode PUT, tandis que cliquer sur “Annuler” ferme le modal. | T#BX | US#16 | coût | X | TODO |
| T_ISS_UPD_RpuC | Créer la route **/project/:projectId/issues/:issueId** dans le fichier **/routes/issues.routes.js**, méthode PUT, créer la fonction *updateIssue()* dans le contrôleur **/controllers/issue.controller.js**, accepte un formulaire qui contient “userType”, “userGoal”, “userReason”,”storyId”,”priority”,”cost”,”testLink” (même validation que dans la vue), appelle la fonction *updateIssue(projectId,issue)* du fichier **/repositories/projects.repository.js**, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#16 | coût | X | TODO |
| T_ISS_DLT_V | Modifier le fichier **issues.ejs** du répertoire */views/project/* pour ajouter un bouton “Supprimer” à chaque entrée de la liste des issues créée en tâche T#BX.<br />En cliquant sur ce bouton, une fenêtre pop-up s’ouvre contenant le texte “Êtes-vous bien sûr de vouloir supprimer ce projet ? Cette action est irréversible.” et deux boutons “Confirmer la suppression” et “Annuler”.<br />En cliquant sur le premier bouton de cette pop-up, le projet est supprimé. En cliquant sur le second, la pop-up se ferme. | T#BX | US#17 | coût | X | TODO |
| T_ISS_DLT_RdC | Créer la route **/project/:projectId/issues/:issueId** dans le fichier **/routes/issues.routes.js**, méthode DELETE. Puis créer la fonction *deleteIssue()* dans le contrôleur “*/controllers/project.controller.js*”, appelle la fonction *deleteIssue(projectId,issueId)* du fichier **/repositories/projects.repository.js**,vérifie si cette utilisateur est le PO/CP du projet, si une erreur se passe, affiche l’erreur dans le formulaire. | - | US#17 | coût | X | TODO |
