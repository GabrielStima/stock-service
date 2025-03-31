module.exports = (app) => {
  const controller = app.controllers.stockController;

  /**
   * @swagger
   * tags:
   *   name: Stock
   *   description: Stock routes
   */
  /**
   * @swagger
   * /stocks:
   *   get:
   *     description: List all stock registers
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/stocks").get(controller.listStocks);

  /**
   * @swagger
   * /stocks/product/:product_id:
   *   get:
   *     description: List all stock registers by Product ID
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app
    .route("/api/v1/stocks/product/:product_id")
    .get(controller.listStocksByProductId);

  /**
   * @swagger
   * /stocks/store/:store_id:
   *   get:
   *     description: List all stock registers by Store ID
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app
    .route("/api/v1/stocks/store/:store_id")
    .get(controller.listStocksByStoreId);

  /**
   * @swagger
   * /stock/:id:
   *   get:
   *     description: Find a stock register by ID
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/stock/:id").get(controller.findStock);

  /**
   * @swagger
   * /stock:
   *   post:
   *     description: Create a stock register
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/stock").post(controller.createStock);

  /**
   * @swagger
   * /stock/:id:
   *   patch:
   *     description: Update a stock register
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/stock/:id").patch(controller.updateStock);

  /**
   * @swagger
   * /stock/:id:
   *   delete:
   *     description: Delete a stock register
   *     tags: [Stock]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/stock/:id").delete(controller.deleteStock);
};
