import redis, { RedisClient } from "redis";
import { EventEmitter } from "events";
import { v4 as uuid } from "uuid";

export default class Storage extends EventEmitter {
    client: RedisClient;
    constructor(public readonly prefix: string, connection?: string) {
        super();
        this.client = redis.createClient(connection!);
        this.client.on("error", (err) => {
            this.emit("error", err);
        });
    }

    closeConnection() {
        this.client.quit();
    }

    async set(data: Record<string, string>) {
        const id = `${this.prefix}:${uuid()}`
        await this.update(id, data);
        return id;
    }

    objectToArray(data: Record<string, any>) {
        const values: string[] = [];
        for (const k in data) {
            if (!data.hasOwnProperty(k)) {
                continue;
            }
            values.push(k);
            values.push(data[k]);
        }
        return values;
    }

    arrayToObject(values: string[]) {
        const data: Record<string, string> = {};
        for (let i = 0; i < values.length - 1; i += 2) {
            data[values[i]] = values[i + 1];
        }
        return data;
    }

    update(id: string, data: Record<string, string>) {
        return new Promise((resolve, reject) => {
            this.client.hset(id, ...this.objectToArray(data), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    findAll() {
        return new Promise<string[]>((r, j) => {
            this.client.keys(`${this.prefix}:*`, (err, values) => {
                if (err) {
                    j(err);
                } else {
                    r(values);
                }
            })
        });
    }

    get(id: string) {
        return new Promise<Record<string, string>>((resolve, reject) => {
            this.client.hgetall(id, (err, values) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(values);
                }
            });
        });
    }

    remove(id: string) {
        return new Promise<number>((r, j) => {
            this.client.del(id, (err, val) => {
                if (err) {
                    j(err);
                } else {
                    r(val);
                }
            })
        });
    }

    move(old: string, id: string) {
        return new Promise((r, j) => {
            this.client.rename(old, id, (err, val) => {
                if (err) {
                    j(err);
                } else {
                    r(val);
                }
            })
        })
    }
}
