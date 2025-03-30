module.exports = (app) => {
  const controller = app.controllers.userController;

  app.route("/api/v1/users").get(controller.listUsers);

  app.route("/api/v1/users/:store_id").get(controller.listUsersByStore);

  app.route("/api/v1/user/:id").get(controller.findUser);

  app.route("/api/v1/user").post(controller.createUser);

  app.route("/api/v1/user/:id").patch(controller.updateUser);

  app.route("/api/v1/user/password/:id").patch(controller.updateUserPassword);

  app.route("/api/v1/user/:id").delete(controller.deleteUser);
};
