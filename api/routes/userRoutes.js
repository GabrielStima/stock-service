module.exports = (app) => {
  const controller = app.controllers.userController;

  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User routes
   */
  /**
   * @swagger
   * /users:
   *   get:
   *     description: List all Users
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/users").get(controller.listUsers);

  /**
   * @swagger
   * /users/:store_id:
   *   get:
   *     description: List all Users by Store ID
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/users/:store_id").get(controller.listUsersByStore);

  /**
   * @swagger
   * /user/:id:
   *   get:
   *     description: Find an Users by ID
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/user/:id").get(controller.findUser);

  /**
   * @swagger
   * /user:
   *   post:
   *     description: Create an User
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/user").post(controller.createUser);

  /**
   * @swagger
   * /user/:id:
   *   patch:
   *     description: Update an User
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/user/:id").patch(controller.updateUser);

  /**
   * @swagger
   * /user/password/:id:
   *   patch:
   *     description: Update an User password
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/user/password/:id").patch(controller.updateUserPassword);

  /**
   * @swagger
   * /user/:id:
   *   delete:
   *     description: Delete an User
   *     tags: [User]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/user/:id").delete(controller.deleteUser);
};
