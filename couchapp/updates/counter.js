function(doc, req) {
	
	var filteredMacs = ['00:0c:76:5d:1c:9c'],  
	    deviceCount  = 0, 
	    macs = req.body.split("\n");
		
	for (var k = 1; k < macs.length; ++k) {
		if (macs[k].length < 1) continue;
		if (filteredMacs.indexOf(macs[k]) > -1) continue;
		++deviceCount;
	}

	var json = {
		_id: new Date().getTime().toString(),
		count: deviceCount,
	};
	return [json, "OK"];
}
