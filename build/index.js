"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const system_tracker_1 = __importDefault(require("./system-tracker"));
const storage_1 = __importDefault(require("./storage"));
const uuid_1 = require("uuid");
function routeLogger(config) {
    const storage = new storage_1.default(`${config.prefixSafe}:${uuid_1.v4}`, config.redisConnection);
    storage.on("error", (err) => {
        if (config.logger) {
            config.logger(err);
        }
    });
    system_tracker_1.default(config.threshold, config.frequency).on("load", async (info) => {
        for (const id of await storage.findAll()) {
            await storage.update(id, { cpu: info.cpu, memory: info.memory });
            await storage.move(id, id.replace(config.prefixSafe, config.prefixDanger));
        }
    }).on("error", (err) => {
        if (config.logger) {
            config.logger(err);
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxzRUFBNkM7QUFDN0Msd0RBQWdDO0FBQ2hDLCtCQUFrQztBQVdsQyxTQUF3QixXQUFXLENBQUMsTUFBMEI7SUFDMUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxTQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDcEYsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUN4QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCx3QkFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQ3hFLEtBQUssTUFBTSxFQUFFLElBQUksTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDdEMsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNqRSxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUM5RTtJQUNMLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNuQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDZixNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtRQUM3RCxNQUFNLEVBQUUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDekIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ2IsU0FBUyxFQUFFLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRTtTQUNuQyxDQUFDLENBQUM7UUFDSCxJQUFJLEVBQUUsQ0FBQztRQUNQLEdBQUcsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtZQUNsQixPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQTVCRCw4QkE0QkMifQ==