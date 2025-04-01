module.exports = (app) => {
  const controller = app.controllers.authController;

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: User authentication and authorization
   */

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticate a user and get a JWT token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: User's email
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 format: password
   *                 description: User's password
   *                 example: '********'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Sucess Message
   *                 token:
   *                   type: string
   *                   description: JWT token for API authentication
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Invalid data
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   */
  app.route("/api/v1/auth/login").post(controller.login);

  /**
   * @swagger
   * /api/v1/auth/validate:
   *   get:
   *     summary: Validate token
   *     description: Validate a JWT token and get user information
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Valid token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 valid:
   *                   type: boolean
   *                   example: true
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/auth/validate").get(controller.validateToken);
};
