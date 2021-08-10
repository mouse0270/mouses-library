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
			/*module.data?.dependencies?.forEach(dependency => {
				if (typeof depHandler[module.id] == 'undefined') depHandler[module.id] = 'dpLoader';
				depHandler[module.id] += `.${dependency.name}`;
			})*/
			Hooks.callAll(`${module.id}IsLoaded`);
		}
	});
	
	/*for (const [key, value] of Object.entries(depHandler)) {
		mousesLibrary.LOG(key, value);
	};*/
});