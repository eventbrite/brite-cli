import { ILogger } from '../';

export interface IBriteCommand {
    logger: ILogger,
    options: any;
    execute(options?): Promise<IBriteCommandResult>;
}

export interface IBriteCommandResult {
    code: number;
    error?: Error;
    message?: string;
    data?: any;
    stats?: {
        [key: string]: number | string;
        totalTime?: number;
    };
}

export interface IBriteCommandConstructor {
    new(logger: ILogger, options?): IBriteCommand;
}

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
export abstract class BriteCommand implements IBriteCommand {
    public options;
    public logger;

    constructor(logger, options) {
        this.options = options;
        this.logger = logger;
    }

    /**
     * Extend the execute method in a command
     */
    public abstract async execute(): Promise<IBriteCommandResult>;
}
