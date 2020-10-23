"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const pidusage_1 = __importDefault(require("pidusage"));
function systemTracker(threashold, frequency = 300) {
    const events = new events_1.EventEmitter();
    let readyToTrigger = true;
    setInterval(async () => {
        try {
            const state = await pidusage_1.default(process.pid);
            if (state.cpu > threashold) {
                if (readyToTrigger) {
                    events.emit("load", state);
                    readyToTrigger = false;
                }
            }
            else {
                readyToTrigger = true;
            }
        }
        catch (err) {
            events.emit("error", err);
        }
    }, 300);
    return events;
}
exports.default = systemTracker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3lzdGVtLXRyYWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3lzdGVtLXRyYWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBc0M7QUFDdEMsd0RBQWdDO0FBQ2hDLFNBQXdCLGFBQWEsQ0FBQyxVQUFrQixFQUFFLFlBQW9CLEdBQUc7SUFDN0UsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7SUFDbEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzFCLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUNuQixJQUFJO1lBQ0EsTUFBTSxLQUFLLEdBQUcsTUFBTSxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsVUFBVSxFQUFFO2dCQUN4QixJQUFJLGNBQWMsRUFBRTtvQkFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzNCLGNBQWMsR0FBRyxLQUFLLENBQUM7aUJBQzFCO2FBQ0o7aUJBQU07Z0JBQ0gsY0FBYyxHQUFHLElBQUksQ0FBQzthQUN6QjtTQUNKO1FBQUMsT0FBTSxHQUFHLEVBQUU7WUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNQLE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFuQkQsZ0NBbUJDIn0=