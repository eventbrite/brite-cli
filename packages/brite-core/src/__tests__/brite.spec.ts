import { BriteCLI } from "../brite";
import { BriteCommandConstructor } from "../commands";

describe("brite", () => {
	let cli;
	let run;
	let logger;

	beforeEach(() => {
		run = jest.fn(async (cmd) => {
			const result = await cmd.execute();
			result.stats = { totalTime: 10 };
			return result;
		});
		const MockRunner = jest.fn(() => ({
			run,
		}));
		const MockCommand = jest.fn<BriteCommandConstructor>(() => ({
			name: "MockCommand",
			execute: () =>
				new Promise((resolve) =>
					resolve({ code: 0, message: "Mock command message" }),
				),
		}));
		const MockCommands = jest.fn(() => ({
			foo: new MockCommand(),
		}));

		logger = {
			log: jest.fn(),
			error: jest.fn(),
		};

		cli = new BriteCLI(new MockRunner(), new MockCommands(), logger);
	});

	it("should run commands", async () => {
		await cli.run("foo", {
			foo: "bar",
		});

		const expectedArgs = {
			foo: "bar",
			cwd: process.cwd(),
			env: "test",
			passThroughArgs: [],
		};
		expect(run).toBeCalled();
		expect(run).toBeCalledWith(
			expect.objectContaining({
				execute: expect.any(Function),
			}),
			logger,
			expectedArgs,
		);
		expect(logger.log).toHaveBeenNthCalledWith(1, "Mock command message");
		expect(logger.log).toHaveBeenLastCalledWith(
			"Command MockCommand ran in 10ms",
		);
		expect(logger.error).not.toHaveBeenCalled();
	});
});
