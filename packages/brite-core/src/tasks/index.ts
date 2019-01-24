import jest from './jest';
import eslint from './eslint'
import sasslint from './sasslint';
import {TaskFunction} from './types';

export default {
    eslint,
    sasslint,
    jest,
} as {[key: string]: TaskFunction};
