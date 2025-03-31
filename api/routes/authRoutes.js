module.exports = (app) => {
  const controller = app.controllers.authController;

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication routes
   */
  /**
   * @swagger
   * /login:
   *   post:
   *     description: Login to the application
   *     tags: [Auth]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/auth/login").post(controller.login);

  /**
   * @swagger
   * /validate:
   *   get:
   *     description: Validate the token
   *     tags: [Auth]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/auth/validate").get(controller.validateToken);
};
