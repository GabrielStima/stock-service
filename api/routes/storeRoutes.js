module.exports = (app) => {
  const controller = app.controllers.storeController;

  /**
   * @swagger
   * tags:
   *   name: Store
   *   description: Store management operations
   */

  /**
   * @swagger
   * /api/v1/stores:
   *   get:
   *     summary: Retrieve all stores
   *     description: Get a list of all available stores in the system
   *     tags: [Store]
   *     responses:
   *       200:
   *         description: A list of stores
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Store'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/stores").get(controller.listStores);

  /**
   * @swagger
   * /api/v1/store/{id}:
   *   get:
   *     summary: Get store by ID
   *     description: Retrieve detailed information about a specific store
   *     tags: [Store]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the store
   *     responses:
   *       200:
   *         description: Detailed store information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Store'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/store/:id").get(controller.findStore);

  /**
   * @swagger
   * /api/v1/store:
   *   post:
   *     summary: Create store
   *     description: Add a new store to the system
   *     tags: [Store]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 description: Store name
   *                 example: "Downtown Store"
   *               address:
   *                 type: string
   *                 description: Store physical address
   *                 example: "123 Main St, Anytown, USA"
   *     responses:
   *       201:
   *         description: Store created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Store'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/store").post(controller.createStore);

  /**
   * @swagger
   * /api/v1/store/{id}:
   *   patch:
   *     summary: Update store
   *     description: Update an existing store's information
   *     tags: [Store]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the store to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Store name
   *               address:
   *                 type: string
   *                 description: Store physical address
   *     responses:
   *       200:
   *         description: Store updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Store updated successfully
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/store/:id").patch(controller.updateStore);

  /**
   * @swagger
   * /api/v1/store/{id}:
   *   delete:
   *     summary: Delete store
   *     description: Remove a store from the system
   *     tags: [Store]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the store to delete
   *     responses:
   *       200:
   *         description: Store deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Store deleted successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/store/:id").delete(controller.deleteStore);
};
