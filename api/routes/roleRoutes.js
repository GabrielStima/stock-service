module.exports = (app) => {
  const controller = app.controllers.roleController;

  /**
   * @swagger
   * tags:
   *   name: Role
   *   description: Role management operations
   */

  /**
   * @swagger
   * /api/v1/roles:
   *   get:
   *     summary: Retrieve all roles
   *     description: Get a list of all available roles in the system
   *     tags: [Role]
   *     responses:
   *       200:
   *         description: A list of roles
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Role'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/roles").get(controller.listRoles);

  /**
   * @swagger
   * /api/v1/role/{id}:
   *   get:
   *     summary: Get role by ID
   *     description: Retrieve detailed information about a specific role
   *     tags: [Role]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the role
   *     responses:
   *       200:
   *         description: Detailed role information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/role/:id").get(controller.findRole);

  /**
   * @swagger
   * /api/v1/role:
   *   post:
   *     summary: Create role
   *     description: Add a new role to the system
   *     tags: [Role]
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
   *                 description: Role name
   *     responses:
   *       201:
   *         description: Role created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Role'
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   */
  app.route("/api/v1/role").post(controller.createRole);

  /**
   * @swagger
   * /api/v1/role/{id}:
   *   patch:
   *     summary: Update role
   *     description: Update an existing role's information
   *     tags: [Role]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the role to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Role name
   *     responses:
   *       200:
   *         description: Role updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Role updated successfully
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/role/:id").patch(controller.updateRole);

  /**
   * @swagger
   * /api/v1/role/{id}:
   *   delete:
   *     summary: Delete role
   *     description: Remove a role from the system
   *     tags: [Role]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Numeric ID of the role to delete
   *     responses:
   *       200:
   *         description: Role deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Role deleted successfully
   *       401:
   *         $ref: '#/components/responses/UnauthorizedError'
   *       404:
   *         $ref: '#/components/responses/NotFoundError'
   */
  app.route("/api/v1/role/:id").delete(controller.deleteRole);
};
