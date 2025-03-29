module.exports = (app) => {
  const controller = app.controllers.productController;

  app.route("/api/v1/products").get(controller.listProducts);

  app.route("/api/v1/product/:id").get(controller.findProduct);

  app.route("/api/v1/product").post(controller.createProduct);

  app.route("/api/v1/product/:id").patch(controller.updateProduct);

  app.route("/api/v1/product/:id").delete(controller.deleteProduct);
};
