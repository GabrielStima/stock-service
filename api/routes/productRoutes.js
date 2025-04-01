module.exports = (app) => {
  const controller = app.controllers.productController;

  /**
   * @swagger
   * tags:
   *   name: Product
   *   description: Product management operations
   */

  /**
   * @swagger
   * /api/v1/products:
   *   get:
   *     summary: Retrieve all products
   *     description: Get a list of all available products in the system
   *     tags: [Product]
   *     responses:
   *       200:
   *         description: A list of products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/products").get(controller.listProducts);

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   get:
   *     summary: Get product by ID
   *     description: Retrieve detailed information about a specific product
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the product
   *     responses:
   *       200:
   *         description: Detailed product information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/product/:id").get(controller.findProduct);

  /**
   * @swagger
   * /api/v1/product:
   *   post:
   *     summary: Create product
   *     description: Add a new product to the system
   *     tags: [Product]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *             properties:
   *               name:
   *                 type: string
   *                 description: Product name
   *               description:
   *                 type: string
   *                 description: Product description
   *               price:
   *                 type: number
   *                 format: float
   *                 description: Product price
   *     responses:
   *       201:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/product").post(controller.createProduct);

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   patch:
   *     summary: Update product
   *     description: Update an existing product's information
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the product to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Product name
   *               description:
   *                 type: string
   *                 description: Product description
   *               price:
   *                 type: number
   *                 format: float
   *                 description: Product price
   *     responses:
   *       200:
   *         description: Product updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Product updated successfully
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/product/:id").patch(controller.updateProduct);

  /**
   * @swagger
   * /api/v1/product/{id}:
   *   delete:
   *     summary: Delete product
   *     description: Remove a product from the system
   *     tags: [Product]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the product to delete
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Product deleted successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/product/:id").delete(controller.deleteProduct);
};
