module.exports = (app) => {
  const controller = app.controllers.userController;

  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User account management operations
   */

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: Retrieve all users
   *     description: Get a list of all registered users in the system
   *     tags: [User]
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/users").get(controller.listUsers);

  /**
   * @swagger
   * /api/v1/users/{store_id}:
   *   get:
   *     summary: Get users by store
   *     description: List all users associated with a specific store
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: store_id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the store
   *     responses:
   *       200:
   *         description: List of users for the specified store
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/users/:store_id").get(controller.listUsersByStore);

  /**
   * @swagger
   * /api/v1/user/{id}:
   *   get:
   *     summary: Get user by ID
   *     description: Retrieve detailed information about a specific user
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the user
   *     responses:
   *       200:
   *         description: Detailed user information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/user/:id").get(controller.findUser);

  /**
   * @swagger
   * /api/v1/user:
   *   post:
   *     summary: Create user
   *     description: Register a new user in the system
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *                 description: User's full name
   *                 example: "John Doe"
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *                 example: "john@example.com"
   *               password:
   *                 type: string
   *                 format: password
   *                 description: User's password
   *               role_id:
   *                 type: integer
   *                 description: User's role
   *                 example: 1
   *               store_id:
   *                 type: integer
   *                 description: ID of the store the user belongs to
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/user").post(controller.createUser);

  /**
   * @swagger
   * /api/v1/user/{id}:
   *   patch:
   *     summary: Update user
   *     description: Update an existing user's information
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the user to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: User's full name
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email address
   *               role_id:
   *                 type: integer
   *                 description: User's role
   *               store_id:
   *                 type: integer
   *                 description: ID of the store the user belongs to
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/user/:id").patch(controller.updateUser);

  /**
   * @swagger
   * /api/v1/user/password/{id}:
   *   patch:
   *     summary: Update user password
   *     description: Change a user's password
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *                 format: password
   *                 description: Current password
   *               newPassword:
   *                 type: string
   *                 format: password
   *                 description: New password
   *     responses:
   *       200:
   *         description: Password updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Password updated successfully
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/user/password/:id").patch(controller.updateUserPassword);

  /**
   * @swagger
   * /api/v1/user/{id}:
   *   delete:
   *     summary: Delete user
   *     description: Remove a user from the system
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the user to delete
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User deleted successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/user/:id").delete(controller.deleteUser);
};
