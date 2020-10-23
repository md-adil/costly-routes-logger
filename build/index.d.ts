import type { Request, Response, NextFunction } from "express";
interface IRouteLoggerConfig {
    redisConnection: string;
    threshold: number;
    frequency: number;
    prefixSafe: string;
    prefixDanger: string;
    logger?: (err: Error) => void | Promise<void>;
}
export default function routeLogger(config: IRouteLoggerConfig): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export {};
