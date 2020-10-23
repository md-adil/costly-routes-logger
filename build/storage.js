"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const events_1 = require("events");
const uuid_1 = require("uuid");
class Storage extends events_1.EventEmitter {
    constructor(prefix, connection) {
        super();
        this.prefix = prefix;
        this.client = redis_1.default.createClient(connection);
        this.client.on("error", (err) => {
            this.emit("error", err);
        });
    }
    closeConnection() {
        this.client.quit();
    }
    async set(data) {
        const id = `${this.prefix}:${uuid_1.v4()}`;
        await this.update(id, data);
        return id;
    }
    objectToArray(data) {
        const values = [];
        for (const k in data) {
            if (!data.hasOwnProperty(k)) {
                continue;
            }
            values.push(k);
            values.push(data[k]);
        }
        return values;
    }
    arrayToObject(values) {
        const data = {};
        for (let i = 0; i < values.length - 1; i += 2) {
            data[values[i]] = values[i + 1];
        }
        return data;
    }
    update(id, data) {
        return new Promise((resolve, reject) => {
            this.client.hset(id, ...this.objectToArray(data), (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this);
                }
            });
        });
    }
    findAll() {
        return new Promise((r, j) => {
            this.client.keys(`${this.prefix}:*`, (err, values) => {
                if (err) {
                    j(err);
                }
                else {
                    r(values);
                }
            });
        });
    }
    get(id) {
        return new Promise((resolve, reject) => {
            this.client.hgetall(id, (err, values) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(values);
                }
            });
        });
    }
    remove(id) {
        return new Promise((r, j) => {
            this.client.del(id, (err, val) => {
                if (err) {
                    j(err);
                }
                else {
                    r(val);
                }
            });
        });
    }
    move(old, id) {
        return new Promise((r, j) => {
            this.client.rename(old, id, (err, val) => {
                if (err) {
                    j(err);
                }
                else {
                    r(val);
                }
            });
        });
    }
}
exports.default = Storage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdG9yYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQTJDO0FBQzNDLG1DQUFzQztBQUN0QywrQkFBa0M7QUFFbEMsTUFBcUIsT0FBUSxTQUFRLHFCQUFZO0lBRTdDLFlBQTRCLE1BQWMsRUFBRSxVQUFtQjtRQUMzRCxLQUFLLEVBQUUsQ0FBQztRQURnQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRXRDLElBQUksQ0FBQyxNQUFNLEdBQUcsZUFBSyxDQUFDLFlBQVksQ0FBQyxVQUFXLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUE0QjtRQUNsQyxNQUFNLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksU0FBSSxFQUFFLEVBQUUsQ0FBQTtRQUNyQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzVCLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELGFBQWEsQ0FBQyxJQUF5QjtRQUNuQyxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pCLFNBQVM7YUFDWjtZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7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