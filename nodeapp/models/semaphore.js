
exports.wait = function(obj, fn, time) {	
	var interval = setInterval(function() {
		if (!obj.__locked) {
			obj.__locked = true;
			fn();
			clearInterval(interval);
		}
	}, time);
};

exports.signal = function(obj) {
	if (obj.__locked) delete obj['__locked'];
};

