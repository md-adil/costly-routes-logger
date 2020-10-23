"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_tracker_1 = __importDefault(require("./system-tracker"));
const storage_1 = __importDefault(require("./storage"));
const uuid_1 = require("uuid");
const defaultConfig = {
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
function routeLogger(conf) {
    const config = { ...defaultConfig, ...conf };
    const storage = new storage_1.default(`${config.prefixSafe}:${uuid_1.v4()}`, config.redisConnection);
    storage.on("error", (err) => {
        config.logger(err);
    });
    system_tracker_1.default(config.threshold, config.frequency).on("load", async (info) => {
        config.logger(info);
        for (const id of await storage.findAll()) {
            await storage.update(id, { cpu: info.cpu, memory: info.memory });
            await storage.move(id, id.replace(config.prefixSafe, config.prefixDanger));
        }
    }).on("error", (err) => {
        config.logger(err);
    });
    return async (req, res, next) => {
        const id = await storage.set({
            path: req.url,
            createdAt: (new Date()).toJSON()
        });
        next();
        res.on("finish", () => {
            storage.remove(id);
        });
    };
}
exports.default = routeLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxzRUFBNkM7QUFDN0Msd0RBQWdDO0FBQ2hDLCtCQUFrQztBQVdsQyxNQUFNLGFBQWEsR0FBZ0M7SUFDL0MsU0FBUyxFQUFFLEVBQUU7SUFDYixTQUFTLEVBQUUsR0FBRztJQUNkLFlBQVksRUFBRSxRQUFRO0lBQ3RCLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLE1BQU0sQ0FBQyxHQUFHO1FBQ04sSUFBSSxHQUFHLFlBQVksS0FBSyxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2xEO0lBQ0wsQ0FBQztDQUNKLENBQUM7QUFFRixTQUF3QixXQUFXLENBQUMsSUFBa0M7SUFDbEUsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLGFBQWEsRUFBRSxHQUFHLElBQUksRUFBd0IsQ0FBQztJQUNuRSxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLFNBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDeEIsTUFBTSxDQUFDLE1BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUNILHdCQUFhLENBQUMsTUFBTSxDQUFDLFNBQVUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDekUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQixLQUFLLE1BQU0sRUFBRSxJQUFJLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3RDLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDakUsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDOUU7SUFDTCxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QixDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sS0FBSyxFQUFFLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0IsRUFBRSxFQUFFO1FBQzdELE1BQU0sRUFBRSxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUN6QixJQUFJLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDYixTQUFTLEVBQUUsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO1NBQ25DLENBQUMsQ0FBQztRQUNILElBQUksRUFBRSxDQUFDO1FBQ1AsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUE7QUFDTCxDQUFDO0FBMUJELDhCQTBCQyJ9