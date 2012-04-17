
exports.lock = function(obj, fn, wait) {	
	var interval = setInterval(function() {
		if (!obj.__locked) {
			obj.__locked = true;
			fn();
			clearInterval(interval);
		}
	}, wait);
};

exports.unlock = function(name) {
	if (obj.__locked) delete obj['__locked'];
}
