import WebpackPlugin from '../';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const TEST_APP_DIR = resolve(__dirname, './__fixtures__/test-app');
const BUILD_TIMEOUT = 20000;
const cleanTestBuildDir = () => {
    execSync(`rm -rf ${join(TEST_APP_DIR, 'build')}`);
};

describe('build', () => {
    beforeEach(() => {
        cleanTestBuildDir();
    });

    afterEach(() => {
        cleanTestBuildDir();
    });

    describe('development', () => {

        it('should build the web and node bundles', async () => {
            await new WebpackPlugin(console, {cwd: TEST_APP_DIR, basePath: 'src'}).run('build');

            // expect regular bundles and maps to be present
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.web.js'))).toBe(true);
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.node.js'))).toBe(true);
            // expect css not to be extracted
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.css'))).toBe(false);
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.css.map'))).toBe(false);
        }, BUILD_TIMEOUT);
    });

    describe('production', () => {
        it('should should create node, web and css bundles', async () => {
            await new WebpackPlugin(console, {
                cwd: TEST_APP_DIR,
                env: 'production',
                basePath: 'src',
            }).run('build');

            // expect regular bundles and maps to be present
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.web.js'))).toBe(true);
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.web.js.map'))).toBe(true);
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.node.js'))).toBe(true);
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.node.js.map'))).toBe(true);
            // expect css to be present
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.css'))).toBe(true);
            expect(existsSync(join(TEST_APP_DIR, 'build/test-app.css.map'))).toBe(true);
        }, BUILD_TIMEOUT);
    });
});
