import { BriteCLI } from './brite';
import { BriteCommandResult, CommandList, commands } from './commands';
import './envsetup';
import { BriteCommandRunner } from './runner';

export interface ILogger {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
}

export interface IBritePlugin {
    run(command: string): Promise<BriteCommandResult>;
}

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
export const init = (cmds: CommandList, options?, passThroughArgs?) => cli.run(cmds, options, passThroughArgs);

export default cli;
