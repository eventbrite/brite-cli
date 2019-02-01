import WebpackPlugin from '../plugins/brite-cli-plugin-webpack';
import { BaseBriteCommand, BriteCommandResult } from './command';

/**
 * Run webpack, all kinds of fun start things
 */
export default class BriteStartCommand extends BaseBriteCommand {
    public defaultEnvironment = 'development';

    /**
     * Executes the start command
     */
    public async execute(): Promise<BriteCommandResult> {
        return new WebpackPlugin(this.logger, this.options).run('start');
    }
}
