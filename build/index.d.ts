import type { Request, Response, NextFunction } from "express";
export interface IRouteLoggerConfig {
    redisConnection: string;
    threshold: number;
    frequency: number;
    prefixSafe: string;
    prefixDanger: string;
    logger(err: Error | string): void | Promise<void>;
}
export default function routeLogger(conf?: Partial<IRouteLoggerConfig>): (req: Request, res: Response, next: NextFunction) => Promise<void>;
