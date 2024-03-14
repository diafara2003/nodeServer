import { NextFunction, Router, Response, Request } from "express";
import { Controller } from "./controllers/controller";

export class AppRoutes {

    static get routes(): Router {

        const router = Router();
        const controller = new Controller();

        router.all('*', controller.getAll);

        return router;
    }
}