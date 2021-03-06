import { ILogger } from '.';
import {
    BriteCommandConstructor,
    BriteCommandResult,
} from './commands';

export interface IBriteCommandRunner {
    run(
        Command: BriteCommandConstructor,
        logger: ILogger,
        options?,
    ): Promise<BriteCommandResult>;
}

/**
 * Run given commands
 */
export class BriteCommandRunner implements IBriteCommandRunner {

    public async run(
        Command: BriteCommandConstructor,
        logger: ILogger,
        options?,
    ): Promise<BriteCommandResult> {
        const command = new Command(logger, options);
        const start = Date.now();

        let result: BriteCommandResult = { code: 0 };

        try {
            command.before();
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

        result.environment = process.env.NODE_ENV;
        result.stats = {
            totalTime: (end - start),
        };

        return result;
    }
}
