

class MousesLib {
	constructor(module) {
		let defaults = {
			primaryColor: '#673ab7;',
			secondaryColor: '#8AB73A',
			successColor: '#00B74A',
			dangerColor: '#F93154',
			warningColor: '#FFA900',
			infoColor: '#39C0ED'
		}

		this.MODULE = { ...defaults, ...module };

		Handlebars.registerHelper('markdown', (stringId, options) => {
			return DOMPurify.sanitize(marked(game.i18n.localize(`${stringId}`)), { USE_PROFILES: { html: true } });
		});

		Handlebars.registerHelper('is', (value1, value2, options) => {
			return value1 == value2 ? options.fn(this) : options.inverse(this);
		})
		

		// attach renderTemplate function to Handlebars for Organization
		Handlebars.renderTemplate = renderTemplate;
		Handlebars.loadTemplates = loadTemplates;

		// Add Log Level
		this.setting('register', 'logLevel', {
			name: game.i18n.localize(`mouses-library.settings.logLevel.name`),
			hint: game.i18n.localize(`mouses-library.settings.logLevel.hint`),
			type: String,
			choices: {
				'0': game.i18n.localize('mouses-library.settings.logLevel.all'),
				'1': game.i18n.localize('mouses-library.settings.logLevel.info'),
				'2': game.i18n.localize('mouses-library.settings.logLevel.warn'),
				'3': game.i18n.localize('mouses-library.settings.logLevel.error')
			},
			default: '2',
			onChange: value => console.log('Log Level changed to ', value)
		})
	}

	logger(type) {
		let color = this.MODULE.primaryColor;
		let logLevel = 0;
		switch (type.toLowerCase()) {
			case 'info':
				color = this.MODULE.infoColor; logLevel = 1;
				break;
			case 'warn':
				color = this.MODULE.warningColor; logLevel = 2;
				break;
			case 'error':
				color = this.MODULE.dangerColor; logLevel = 3;
				break;
		}
		if (logLevel >= parseInt(this.setting('logLevel'))) {
			console.log.apply(console, [`%c${this.MODULE.title}`, `background-color: ${color}; color: rgb(255 255 255);font-weight: 700;padding: 3px 5px;`, ...arguments[1]]);
		}
	}

	LOG() { this.logger('log', arguments); }
	WARN() { this.logger('warn', arguments); }
	INFO() { this.logger('info', arguments); }
	ERROR() { this.logger('error', arguments); }

	localize() {
		return game.i18n.localize(`${this.MODULE.name}.${arguments[0]}`);
	}

	setting() {
		let args = arguments;
		
		// Are we registering a new setting
		if (args[0].toLowerCase() == 'register') {
			// Register New Setting
			let setting = args[1]; // This is the name of the setting
			let value = args[2]; // This is the settings of the setting
			let settingDefaults = {
				name: this.localize(`settings.${setting}.name`),
				hint: this.localize(`settings.${setting}.hint`),
				scope: 'client',
				config: true
			}
			let newSetting = Object.extend(true, settingDefaults, value);
			game.settings.register(this.MODULE.name, setting, newSetting);
			return newSetting;
		} else {
			let setting = args[0];
			// If only one value is passed in, get setting
			if (typeof args[1] == 'undefined') {
				return game.settings.get(this.MODULE.name, setting);
			} else {
				return game.settings.set(this.MODULE.name, setting, args[1]);
			}
		}
	}
}