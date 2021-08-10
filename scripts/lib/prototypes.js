if (!Object.prototype.hasOwnProperty('extend')) {
	Object.defineProperty(Object.prototype, 'extend',{
		value: function() {    
			// Variables
			var extended = {};
			var deep = false;
			var i = 0;

			// Check if a deep merge
			if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
				deep = arguments[0];
				i++;
			}
		
			// Merge the object into the extended object
			var merge = function (obj) {
				for (var prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						// If property is an object, merge properties
						if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
							extended[prop] = Object.extend(extended[prop], obj[prop]);
						} else {
							extended[prop] = obj[prop];
						}
					}
				}
			};
		
			// Loop through each object and conduct a merge
			for (; i < arguments.length; i++) {
				merge(arguments[i]);
			}
		
			return extended;
		},
		writable: true,
		configurable: true,
		enumerable: false
	});
}