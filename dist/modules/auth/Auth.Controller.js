"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = void 0;
const Auth_Service_1 = require("../../modules/auth/Auth.Service");
const Auth_Schema_1 = require("./Auth.Schema");
const zod_1 = require("zod");
const registerController = async (req, reply) => {
    try {
        const parsed = Auth_Schema_1.registerSchema.parse(req.body);
        const { user, token } = await (0, Auth_Service_1.registerUser)(parsed);
        return reply.code(201).send({ message: "User registered", token, user });
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return reply.code(400).send({
                error: "Validation failed",
                details: err.issues,
            });
        }
        return reply.code(400).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};
exports.registerController = registerController;
const loginController = async (req, reply) => {
    try {
        const parsed = Auth_Schema_1.loginSchema.parse(req.body);
        const { token, user } = await (0, Auth_Service_1.loginUser)(parsed);
        return reply.code(200).send({ message: "Login successful", token, user });
    }
    catch (err) {
        return reply.code(400).send({
            error: err instanceof Error ? err.message : "Something went wrong",
        });
    }
};
exports.loginController = loginController;
