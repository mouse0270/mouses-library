class MousesLibrary extends MousesLib {
	constructor(module) {
		super(module)
	}
}

let mousesLibrary = null;

Hooks.once('init', async () => { 
	mousesLibrary = new MousesLibrary({
			name: 'mouses-library',
			title: 'Mouses Library',
		});

	//let depHandler = {};

	// Add Hook for if module exists;
	game.modules.forEach(module => {
		if (module.active) {
			Hooks.callAll(`${module.id}IsLoaded`);
		}
	});	

	mousesLibrary.setting('register', 'allowHTMLforAllSettings', {
		type: Boolean,
		default: false
	});

	Hooks.on('renderSettingsConfig', (app, html) => {
		// Get Mouses Modules
		let modules = [];
		for (let [module, data] of game.modules.entries()) {
			let isMousesModule = data.data.authors.find(author => author.name.toLowerCase() == 'mouse0270');
			if (isMousesModule || mousesLibrary.setting('allowHTMLforAllSettings')) modules.push(data.data.title);
		}

		modules.forEach(module => {
			let $moduleSettings = $(html).find(`[data-tab="modules"] h2.module-header:contains("${module}")`).nextUntil('h2.module-header');

			$moduleSettings.each((index, setting) => {
				let $hint = $(setting).find('p.notes');
				// Add setting to parsed settings to let CSS be styled correctly
				$(setting).addClass('html-parsed-setting');
				$hint.html(DOMPurify.sanitize(marked($hint.text()), {USE_PROFILES: {html: true}}))
			});
		});
	});
});