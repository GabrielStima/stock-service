module.exports = (app) => {
  const controller = app.controllers.storeController;

  /**
   * @swagger
   * tags:
   *   name: Store
   *   description: Store routes
   */
  /**
   * @swagger
   * /stores:
   *   get:
   *     description: List all Stores
   *     tags: [Store]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/stores").get(controller.listStores);

  /**
   * @swagger
   * /store/:id:
   *   get:
   *     description: Find a Stores by ID
   *     tags: [Store]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/store/:id").get(controller.findStore);

  /**
   * @swagger
   * /store:
   *   post:
   *     description: Create a new Store
   *     tags: [Store]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/store").post(controller.createStore);

  /**
   * @swagger
   * /store/:id:
   *   patch:
   *     description: Update a new Store
   *     tags: [Store]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/store/:id").patch(controller.updateStore);

  /**
   * @swagger
   * /store/:id:
   *   delete:
   *     description: Delete a new Store
   *     tags: [Store]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/store/:id").delete(controller.deleteStore);
};
