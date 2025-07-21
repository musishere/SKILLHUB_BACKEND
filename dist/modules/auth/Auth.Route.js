"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const Auth_Controller_1 = require("./Auth.Controller");
async function authRoutes(app) {
    app.post("/signup", Auth_Controller_1.registerController);
    app.post("/login", Auth_Controller_1.loginController);
}
