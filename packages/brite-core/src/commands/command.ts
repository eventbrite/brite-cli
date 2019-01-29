import { ILogger } from "../";

export interface BriteCommandResult {
	code: number;
	environment?: string;
	error?: Error;
	message?: string;
	data?: any;
	stats?: {
		[key: string]: number | string;
		totalTime?: number;
	};
}

export type BriteCommandConstructor = new (
	logger: ILogger,
	options?,
) => BaseBriteCommand;

export interface IBriteCommandOptions {
	cwd?: string;
	env?: string;
	port?: number;
	outputPath?: string;
	passThroughArgs?: string[];
	basePath?: string;
}

/**
 * An abstract class for use in creating new commands.
 * The options passed ot the constructor are available on `this.options`
 */
export abstract class BaseBriteCommand {
	public options;
	public logger;
	public abstract defaultEnvironment: string;

	constructor(logger, options) {
		this.options = options;
		this.logger = logger;
	}

	/**
	 * Run before execute
	 */
	public before() {
		this.setDefaultEnvironment();
	}

	/**
	 * Extend the execute method in a command
	 */
	public abstract async execute(): Promise<BriteCommandResult>;

	/**
	 * Sets up the default environment this task should run in
	 */
	private setDefaultEnvironment() {
		process.env.NODE_ENV =
			process.env.NODE_ENV || this.defaultEnvironment || "development";
	}
}
