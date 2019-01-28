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
        this.setDefaultEnvironment();

        return new WebpackPlugin(this.logger, this.options).run('build');
    }

    /**
     * Sets the default environment to production
     */
    public setDefaultEnvironment() {
        process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    }
}
