import {TaskFunction} from '../tasks/types';
import {BriteCommand, IBriteCommandResult} from "./command";
import tasks from '../tasks';

/**
 * Run jest tests
 */
export default class BriteTestCommand extends BriteCommand {
    public static availableTasks: string[] = Object.keys(tasks);

    /**
     * Executes the test command
     */
    public async execute(): Promise<IBriteCommandResult> {
        let results: boolean[] = [];
        let result: IBriteCommandResult = {code: 0};
        let tasksToRun: string[] = this.options.tasks || BriteTestCommand.availableTasks;

        try {
            results = await Promise.all<boolean>(tasksToRun.map((taskName) => {
                const task: TaskFunction = tasks[taskName];

                if (task) {
                    return task(this.logger, this.options);
                }
                
                throw new Error(`Failure: Task (${taskName}) does not exist. Available tasks: ${BriteTestCommand.availableTasks.join(', ')}`);
            }));
        } catch(e) {
            result = {
                code: 1,
                error: e,
                message: e.message,
            }
        }

        if (!result.error && !results.every(Boolean)) {
            result = {
                code: 1,
                message: 'ERROR: One of the sub tasks for the test command failed.\nPlease review console output for more details.'
            }
        }

        return result;
    }
}
