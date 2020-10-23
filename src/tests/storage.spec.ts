import { assert, expect } from "chai";
import Storage from "../storage";
describe("storage", () => {
    let id: string;
    const storage = new Storage("users");
    describe("#set", () => {
        it("shoud persist the value", async () => {
            id = await storage.set({ name: "Adil" });
            expect(id).toString();
        });
    });

    describe("#get", () => {
        it("should get value", async () => {
            const value = await storage.get(id!);
            expect(value.name).to.eq("Adil");
        });
    })
    describe("#findAll", () => {
        it("should contains prev id", async () => {
            const ids = await storage.findAll();
            expect(ids).be.contains(id);
        });
    });
    describe("#remove", () => {
        it("Should remove the value", async () => {
            const numbers = await storage.remove(id!);
            assert( numbers === 1 );
        });
        it("key should not contains removed id", async () => {
            expect(await storage.findAll()).not.contains(id);
            storage.closeConnection();
        });
    });
});