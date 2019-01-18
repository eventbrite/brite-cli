import {
    IBriteCommandConstructor,
    IBriteCommandResult,
} from './commands';
import { ILogger } from '.';

export interface IBriteCommandRunner {
    run(
        Command: IBriteCommandConstructor,
        logger: ILogger,
        options?,
    ): Promise<IBriteCommandResult>;
}

/**
 * Run given commands
 */
export class BriteCommandRunner implements IBriteCommandRunner {

    public async run(
        Command: IBriteCommandConstructor,
        logger: ILogger,
        options?,
    ): Promise<IBriteCommandResult> {
        const command = new Command(logger, options);
        const start = Date.now();

        let result: IBriteCommandResult = { code: 0 };

        try {
            result = await command.execute();
        } catch (error) {
            const message = `ERROR: brite-cli failed to execute command.\
            Ensure that the ${command.constructor.name} plugins all exit with proper result objects.`;

            result = {
                error,
                message,
                code: 1,
            };
        }

        const end = Date.now();

        result.stats = {
            totalTime: (end - start),
        };

        return result;
    }
}
