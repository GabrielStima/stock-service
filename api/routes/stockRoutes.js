module.exports = (app) => {
  const controller = app.controllers.stockController;

  /**
   * @swagger
   * tags:
   *   name: Stock
   *   description: Stock inventory management operations
   */

  /**
   * @swagger
   * /api/v1/stocks:
   *   get:
   *     summary: Retrieve all stock items
   *     description: Returns a list of all stock items across all stores with product and store details
   *     tags: [Stock]
   *     responses:
   *       200:
   *         description: A list of stock items
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Stock'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/stocks").get(controller.listStocks);

  /**
   * @swagger
   * /api/v1/stocks/product/{product_id}:
   *   get:
   *     summary: Get stock by product ID
   *     description: Retrieves all stock entries for a specific product across all stores
   *     tags: [Stock]
   *     parameters:
   *       - in: path
   *         name: product_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the product
   *     responses:
   *       200:
   *         description: List of stock items for the specified product
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Stock'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app
    .route("/api/v1/stocks/product/:product_id")
    .get(controller.listStocksByProductId);

  /**
   * @swagger
   * /api/v1/stocks/store/{store_id}:
   *   get:
   *     summary: Get stock by store ID
   *     description: Retrieves all stock entries for a specific store
   *     tags: [Stock]
   *     parameters:
   *       - in: path
   *         name: store_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the store
   *     responses:
   *       200:
   *         description: List of stock items for the specified store
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Stock'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app
    .route("/api/v1/stocks/store/:store_id")
    .get(controller.listStocksByStoreId);

  /**
   * @swagger
   * /api/v1/stock/{id}:
   *   get:
   *     summary: Get stock by ID
   *     description: Retrieves a specific stock entry by its ID
   *     tags: [Stock]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the stock item
   *     responses:
   *       200:
   *         description: Detailed stock item information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Stock'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/stock/:id").get(controller.findStock);

  /**
   * @swagger
   * /api/v1/stock:
   *   post:
   *     summary: Create stock entry
   *     description: Creates a new stock entry for a product at a specific store
   *     tags: [Stock]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - product_id
   *               - quantity
   *             properties:
   *               product_id:
   *                 type: integer
   *                 description: ID of the product
   *               store_id:
   *                 type: integer
   *                 description: ID of the store
   *               quantity:
   *                 type: integer
   *                 description: Stock quantity
   *     responses:
   *       201:
   *         description: Stock created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Stock'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/stock").post(controller.createStock);

  /**
   * @swagger
   * /api/v1/stock/{id}:
   *   patch:
   *     summary: Update stock
   *     description: Updates an existing stock entry
   *     tags: [Stock]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the stock item to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               product_id:
   *                 type: integer
   *                 description: ID of the product
   *               store_id:
   *                 type: integer
   *                 description: ID of the store
   *               quantity:
   *                 type: integer
   *                 description: Stock quantity
   *     responses:
   *       200:
   *         description: Stock updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Stock updated successfully
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/stock/:id").patch(controller.updateStock);

  /**
   * @swagger
   * /api/v1/stock/{id}:
   *   delete:
   *     summary: Delete stock
   *     description: Deletes a stock entry
   *     tags: [Stock]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the stock item to delete
   *     responses:
   *       200:
   *         description: Stock deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Stock deleted successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/stock/:id").delete(controller.deleteStock);
};
