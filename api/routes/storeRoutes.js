module.exports = (app) => {
  const controller = app.controllers.storeController;

  app.route("/api/v1/stores").get(controller.listStores);

  app.route("/api/v1/store/:id").get(controller.findStore);

  app.route("/api/v1/store").post(controller.createStore);

  app.route("/api/v1/store/:id").patch(controller.updateStore);

  app.route("/api/v1/store/:id").delete(controller.deleteStore);
};
