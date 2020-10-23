/// <reference types="node" />
import { RedisClient } from "redis";
import { EventEmitter } from "events";
export default class Storage extends EventEmitter {
    readonly prefix: string;
    client: RedisClient;
    constructor(prefix: string, connection?: string);
    closeConnection(): void;
    set(data: Record<string, string>): Promise<string>;
    objectToArray(data: Record<string, any>): string[];
    arrayToObject(values: string[]): Record<string, string>;
    update(id: string, data: Record<string, string>): Promise<unknown>;
    findAll(): Promise<string[]>;
    get(id: string): Promise<Record<string, string>>;
    remove(id: string): Promise<number>;
    move(old: string, id: string): Promise<unknown>;
}
