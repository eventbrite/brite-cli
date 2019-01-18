import './envsetup';
import { BriteCLI } from './brite';
import { commands, CommandList, IBriteCommandResult } from './commands';
import { BriteCommandRunner } from './runner';

export interface ILogger {
    log: (...args: any[]) => void,
    error: (...args: any[]) => void,
    debug: (...args: any[]) => void,
};

export interface IBritePlugin {
    run(command: string): Promise<IBriteCommandResult>;
};

const runner = new BriteCommandRunner();
const cli = new BriteCLI(runner, commands, console);

/**
 * Run the CLI by passing a command string and optional options
 * @example
 * init('start');
 * @param command A string of one of the commands from './commands/index'
 * @param options Optional options for the command
 * @param passThroughArgs  - raw arguments from the cli
 */
export const init = (commands: CommandList, options?, passThroughArgs?) => cli.run(commands, options, passThroughArgs);

export default cli;
