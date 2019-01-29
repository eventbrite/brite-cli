import { ILogger } from "..";
import { BaseBriteCommand } from "../commands";
import { BriteCommandRunner } from "../runner";

class FakeCommand extends BaseBriteCommand {
	public defaultEnvironment = "myenv";

	public async execute() {
		return {
			code: 0,
		};
	}
}

describe("Brite Commands", () => {
	describe("when node_env is set via env vars passed in", () => {
		let runner: BriteCommandRunner;
		const env = process.env.NODE_ENV;

		beforeEach(() => {
			// Temporarily delete just to make sure we can actually set it
			process.env.NODE_ENV = "another thing";
			runner = new BriteCommandRunner();
		});

		afterEach(() => {
			// Put it back!
			process.env.NODE_ENV = env;
		});

		it("should set the default environment", async () => {
			const Logger = jest.fn<ILogger>();
			const result = await runner.run(FakeCommand, new Logger(), {});

			expect(result.environment).toEqual("another thing");
		});
	});

	describe("when node_env is NOT set", () => {
		let runner: BriteCommandRunner;
		const env = process.env.NODE_ENV;

		beforeEach(() => {
			// Temporarily delete just to make sure we can actually set it
			delete process.env.NODE_ENV;
			runner = new BriteCommandRunner();
		});

		afterEach(() => {
			// Put it back!
			process.env.NODE_ENV = env;
		});

		it("should set the default environment", async () => {
			const Logger = jest.fn<ILogger>();
			const result = await runner.run(FakeCommand, new Logger(), {});

			expect(result.environment).toEqual("myenv");
		});
	});
});
