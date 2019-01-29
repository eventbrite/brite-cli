import { ILogger } from "../";
import { IBriteCommandOptions } from "../commands";

export type TaskFunction = (
	logger: ILogger,
	options: IBriteCommandOptions,
) => Promise<boolean>;
