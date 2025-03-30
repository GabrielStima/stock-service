module.exports = (app) => {
  const controller = app.controllers.stockController;

  app.route("/api/v1/stocks").get(controller.listStocks);

  app
    .route("/api/v1/stocks/product/:product_id")
    .get(controller.listStocksByProductId);

  app
    .route("/api/v1/stocks/store/:store_id")
    .get(controller.listStocksByStoreId);

  app.route("/api/v1/stock/:id").get(controller.findStock);

  app.route("/api/v1/stock").post(controller.createStock);

  app.route("/api/v1/stock/:id").patch(controller.updateStock);

  app.route("/api/v1/stock/:id").delete(controller.deleteStock);
};
