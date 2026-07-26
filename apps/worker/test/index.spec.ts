import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src/index";

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe("Poocho worker", () => {
	it("responds with health metadata (unit style)", async () => {
		const request = new IncomingRequest("http://example.com/health");
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.json()).toMatchInlineSnapshot(`
			{
			  "name": "poocho",
			  "status": "ok",
			}
		`);
	});

	it("responds with health metadata (integration style)", async () => {
		const response = await SELF.fetch("https://example.com/health");
		expect(await response.json()).toMatchInlineSnapshot(`
			{
			  "name": "poocho",
			  "status": "ok",
			}
		`);
	});
});
