module.exports = (app) => {
  const controller = app.controllers.authController;

  app.route("/api/v1/auth/login").post(controller.login);

  app.route("/api/v1/auth/validate").get(controller.validateToken);
};
