import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { identifyClient } from "./identify";

describe("identifyClient", () => {
	it("should add id to transaction", () => {
		const tx = {
			find: () => Promise.resolve(),
		};
		const id = randomUUID();
		const identified = identifyClient(tx, () => id);
		expect(identified.id).toBe(id);
	});
});
