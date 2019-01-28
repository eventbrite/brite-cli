import WebpackPlugin from '../plugins/brite-cli-plugin-webpack';
import { BriteCommand, IBriteCommandResult } from './command';

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
