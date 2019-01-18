import { BriteCommand, IBriteCommandResult } from './command';
import WebpackPlugin from '../plugins/brite-cli-plugin-webpack';

/**
 * Run a build
 */
export default class BriteBuildCommand extends BriteCommand {

    /**
     * Executes the build command
     */
    public async execute(): Promise<IBriteCommandResult> {
        return new WebpackPlugin(this.logger, this.options).run('build');
    }
}
