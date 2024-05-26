import app from "@/server";
import { describe, test, expect } from "bun:test";

describe("Example", () => {
    test("GET /posts", async () => {
        const res = await app.request("/");
        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Many posts");
    });
});
