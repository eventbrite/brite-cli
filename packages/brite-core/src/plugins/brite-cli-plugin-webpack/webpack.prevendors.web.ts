// NOTE: babel-polyfill doesn't like it when we re-add it, which is what's happening
// when we include any app dynamically on a React page. The challenge is that for
// async bundles like featurePrompt it's included on both legacy and React pages
// so there's no way to know if it should or shouldn't include `babel-polyfill`.
// Re-adding it doesn't seem to have problems (so far), so this is currently
// the best solution. This could easily break as we bump `babel-polyfill`,
// but we'll know pretty quickly.
interface MyWindow extends Window {
	_babelPolyfill: boolean;
}

const myWindow = window as MyWindow;

if (myWindow._babelPolyfill) {
	delete myWindow._babelPolyfill;
}
