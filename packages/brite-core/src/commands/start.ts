import WebpackPlugin from '../plugins/brite-cli-plugin-webpack';
import { BriteCommand, IBriteCommandResult } from './command';

/**
 * Run webpack, all kinds of fun start things
 */
export default class BriteStartCommand extends BriteCommand {

    /**
     * Executes the start command
     */
    public async execute(): Promise<IBriteCommandResult> {
        return new WebpackPlugin(this.logger, this.options).run('start');
    }
}
