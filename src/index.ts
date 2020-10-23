import type { Request, Response, NextFunction } from "express";
import systemTracker from "./system-tracker";
import Storage from "./storage";
import { v4 as uuid } from "uuid";

interface IRouteLoggerConfig {
    redisConnection: string;
    threshold: number;
    frequency: number;
    prefixSafe: string;
    prefixDanger: string;
    logger?: (err: Error) => void | Promise<void>;
}

export default function routeLogger(config: IRouteLoggerConfig) {
    const storage = new Storage(`${config.prefixSafe}:${uuid}`, config.redisConnection);
    storage.on("error", (err) => {
        if (config.logger) {
            config.logger(err);
        }
    });
    systemTracker(config.threshold, config.frequency).on("load", async (info) => {
        for (const id of await storage.findAll()) {
            await storage.update(id, { cpu: info.cpu, memory: info.memory });
            await storage.move(id, id.replace(config.prefixSafe, config.prefixDanger));
        }
    }).on("error", (err) => {
        if (config.logger) {
            config.logger(err);
        }
    });
    
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = await storage.set({
            path: req.url,
            createdAt: (new Date()).toJSON()
        });
        next();
        res.on("finish", () => {
            storage.remove(id);
        });
    }
}
