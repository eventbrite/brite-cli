import { join } from 'path';

import { IBritePlugin, ILogger } from '../..';
import { BriteCommandResult, IBriteCommandOptions } from '../../commands';

import { DEFAULT_PORT, DEV_ENV } from './common';
import {
    getResultOk,
    parseResults,
    runWebpack,
    runWebpackDevServer,
} from './utils';
import getNodeConfig from './webpack.config.node';
import getWebConfig from './webpack.config.web';

export default class WebpackPlugin implements IBritePlugin {
    public options;
    public logger;

    constructor(logger: ILogger, options?: IBriteCommandOptions) {
        const {cwd, env, port, outputPath, basePath } = options;

        this.options = {
            ...options,
            cwd,
            // TODO: EB-89574 Investigate correct env defaults for cli commands
            env: env || DEV_ENV,
            port: port || DEFAULT_PORT,
            outputPath: outputPath || join(cwd, 'build'),
            basePath: basePath || '',
        };

        this.logger = logger;
    }

    /**
     * Run a webpack build or start a dev server
     */
    public async run(command: 'build' | 'start'): Promise<BriteCommandResult>  {
        if (command === 'build') {
            return await this.runBuild();
        } else if (command === 'start') {
            return await this.runStart();
        }

        const error = new Error(`ERROR: ${command} not found.`);
        return {
            error,
            message: error.message,
            code: 1,
        } as BriteCommandResult;
    }

    /**
     * Run a webpack build for node and web
     */
    private async runBuild(): Promise<BriteCommandResult> {
        let result = await runWebpack(getNodeConfig(this.options), 'run', this.logger);

        if (result.code !== 0) {
            return result;
        }

        result = await runWebpack(getWebConfig(this.options), 'run', this.logger);

        if (result.code !== 0) {
            return result;
        }

        return getResultOk();
    }

    /**
     * Start up a webpack watch mode for the server, and a webpack dev server for web
     */
    private async runStart(): Promise<BriteCommandResult> {
        let result = getResultOk();

        try {
            const results = await Promise.all([
                runWebpack(getNodeConfig(this.options), 'watch', this.logger),
                runWebpackDevServer(getWebConfig(this.options), this.logger),
            ]);

            result = parseResults(results);
        } catch (e) {
            result = {
                code: 1,
                error: e,
                message: `webpack start failed to boot: ${e.message}`,
            };
        }

        return result;
    }
}
