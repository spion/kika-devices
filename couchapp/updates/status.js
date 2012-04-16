function(doc, req) {
	var whiteList = function(mac) {
		var wl = {
		}
		if (wl[mac]) { return wl[mac]; }
		return null;
	};

	var macs = req.body.split("\n"), 
	    peopleNamesF = {},
	    peopleNames = [];
		
	for (var k = 1; k < macs.length; ++k) {
		var name = whiteList(macs[k]);
		// If its whitelisted, add it to the currently active devices
		if (name && !peopleNamesF[name]) {
			peopleNames.push(name);
			peopleNamesF[name] = true;
		}
	}

	if (!doc) { doc = { _id:'9_people' }; }
	doc.names = peopleNames;
	return [doc, "OK\n"];
}
