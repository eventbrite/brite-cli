# Brite CLI
The fastest and most awesomest way to build an app.

## Usage
You can run the CLI in a few ways.

### Command Line
The easiest way is by running simple commands...

```shell
brite start
brite test
brite build
```

### As a module
You can also import `brite`...

```js
import brite from '@eventbrite/brite-cli';

brite.run('start', {
    /* options */
});
```

## Adding commands
Brite CLI operates around the idea of creating commands.

In the `./commands` directory, you will find existing commands, and adding one is super easy.

Just drop one in using the same format as the existing commands...

```ts
/**
 * Run webpack, all kinds of fun start things
 */
export default class BriteStartCommand extends BriteCommand {
    /**
     * Executes the start command
     */
    public async execute() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    message: 'running webpack hopefully...',
                });
            }, 0);
        });
    }
}
```

And add the new command to `./commands/index`.

And that's it!

Resolving the promise or returning `message` as a part of your command result will log the output.


