module.exports = (app) => {
  const controller = app.controllers.productController;

  /**
   * @swagger
   * tags:
   *   name: Product
   *   description: Product routes
   */
  /**
   * @swagger
   * /products:
   *   get:
   *     description: List all products
   *     tags: [Product]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/products").get(controller.listProducts);

  /**
   * @swagger
   * /products/:id:
   *   get:
   *     description: Find a product by ID
   *     tags: [Product]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/product/:id").get(controller.findProduct);

  /**
   * @swagger
   * /product:
   *   post:
   *     description: Create a new product
   *     tags: [Product]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/product").post(controller.createProduct);

  /**
   * @swagger
   * /product/:id:
   *   patch:
   *     description: Update a product
   *     tags: [Product]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/product/:id").patch(controller.updateProduct);

  /**
   * @swagger
   * /product/:id:
   *   delete:
   *     description: Delete a product
   *     tags: [Product]
   *     produces:
   *       - application/json
   */
  app.route("/api/v1/product/:id").delete(controller.deleteProduct);
};
