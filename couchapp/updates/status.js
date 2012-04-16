function(doc, req) {
	var whiteList = function(mac) {
		var wl = {
			"00:1c:bf:50:69:cb":"spion",
			"00:19:5b:cd:a9:18":"Doda",
			"00:21:6b:31:d6:da":"Андреј Т.",
			"06:87:d3:13:3f:7f":"Glisha",
			"00:1c:bf:0e:ce:c8":"Никола (God)",
			"1c:65:9d:88:d8:36":"mogi"
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
