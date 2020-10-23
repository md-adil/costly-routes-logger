import type { Request, Response, NextFunction } from "express";
import systemTracker from "./system-tracker";
import Storage from "./storage";
import { v4 as uuid } from "uuid";

export interface IRouteLoggerConfig {
    redisConnection: string;
    threshold: number;
    frequency: number;
    prefixSafe: string;
    prefixDanger: string;
    logger(err: Error | string): void | Promise<void>;
}

const defaultConfig: Partial<IRouteLoggerConfig> = {
    threshold: 90,
    frequency: 300,
    prefixDanger: "danger",
    prefixSafe: "safe",
    logger(err) {
        if (err instanceof Error) {
            console.log("COST-LOGGER-ERROR:", err.message);
        }
    }
};

export default function routeLogger(conf?: Partial<IRouteLoggerConfig>) {
    const config = { ...defaultConfig, ...conf } as IRouteLoggerConfig;
    const storage = new Storage(`${config.prefixSafe}:${uuid()}`, config.redisConnection);
    storage.on("error", (err) => {
        config.logger!(err);
    });
    systemTracker(config.threshold!, config.frequency).on("load", async (info) => {
        config.logger(info);
        for (const id of await storage.findAll()) {
            await storage.update(id, {
                cpu: info.cpu,
                memory: info.memory,
                completedAt: (new Date()).toJSON()
            });
            await storage.move(id, id.replace(config.prefixSafe, config.prefixDanger));
        }
    }).on("error", (err) => {
        config.logger(err);
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
