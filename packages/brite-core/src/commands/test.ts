import tasks from '../tasks';
import {TaskFunction} from '../tasks/types';
import {BaseBriteCommand, BriteCommandResult} from "./command";

/**
 * Run jest tests
 */
export default class BriteTestCommand extends BaseBriteCommand {
    public static availableTasks: string[] = Object.keys(tasks);
    public defaultEnvironment = 'test';

    /**
     * Executes the test command
     */
    public async execute(): Promise<BriteCommandResult> {
        const results: boolean[] = [];
        let result: BriteCommandResult = {code: 0};
        const tasksToRun: string[] = this.options.tasks || BriteTestCommand.availableTasks;

        try {
            // Running these in a loop for now since jest is hijacking error codes
            // It's actually kind of nice though because if one thing fails, it exits quicker
            // tslint:disable-next-line:prefer-for-of
            for (const taskName of tasksToRun) {
                const task: TaskFunction = tasks[taskName];
                const success = await task(this.logger, this.options);

                if (!success) {
                    result = {
                        code: 1,
                        message: `Brite CLI task: ${taskName} failed.`,
                    };

                    break;
                }
            }

        } catch (e) {
            result = {
                code: 1,
                error: e,
                message: e.message,
            };
        }

        if (!result.error && !results.every(Boolean)) {
            result = {
                code: 1,
                message: `ERROR: One of the sub tasks for the test command failed\
                    \nPlease review console output for more details.`,
            };
        }

        return result;
    }
}
