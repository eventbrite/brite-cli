import jest from './jest';
import eslint from './eslint'
import sasslint from './sasslint';
import {TaskFunction} from './types';

export default {
    jest,
    eslint,
    sasslint,
} as {[key: string]: TaskFunction};
