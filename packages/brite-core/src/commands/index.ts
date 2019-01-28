import { default as build } from './build';
import { default as start } from './start';
import { default as test } from './test';

export const commands = { start, test, build };

export {
    BaseBriteCommand,
    BriteCommandResult as IBriteCommandResult,
    BriteCommandConstructor as IBriteCommandConstructor,
    IBriteCommandOptions,
    BaseBriteCommand as BriteCommand,
} from './command';

/**
 * This creates a dynamic string type of all available default commands
 * from the object literal keys in ./commands/index.ts
 */
export type CommandList = keyof typeof commands;
