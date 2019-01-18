import lint from 'sass-lint';
import {SASS_CONFIG} from './config';
import { TaskFunction } from '../types';

const sasslintTask: TaskFunction = async (logger, { cwd }) => {
  const config = lint.getConfig(SASS_CONFIG);

  const results = lint.lintFiles(`${cwd}/**/*.scss`, config);
  await lint.outputResults(results, config);

  if (lint.errorCount(results).count || lint.warningCount(results).count) {
    return false;
  }

  return true;
};

export default sasslintTask;
