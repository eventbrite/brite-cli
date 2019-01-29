# Brite Core

The main core source code for Brite

```js
import brite from "@eventbrite/brite-core";

brite.run("start", {
	/* options */
});
```

## Adding commands

Brite operates around the idea of creating commands.

In the `./commands` directory, you will find existing commands, and adding one is super easy.

Just drop one in using the same format as the existing commands...

```ts
export default class BriteStartCommand extends BriteCommand {
	public defaultEnvironment = "developement";

	public async execute() {
		const result = await someAsyncThing();

		return {
			code: 0,
			message: "Ran thing successfully!",
		};
	}
}
```

Set the environment your command will run in by settring `defaultEnvironment`.

And add the new command to `./commands/index`.

And that's it!

Resolving the promise or returning `message` as a part of your command result will log the output.
