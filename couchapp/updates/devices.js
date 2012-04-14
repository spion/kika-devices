function(doc, req) {
	var filteredNames = ['dvoarak'],
	    filteredMacs  = [],  
	    deviceCount = 0;
	var rip = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
	var arplines = req.body.split("\n"), deviceNames = [];
	for (var k = 1; k < arplines.length; ++k) {
		var arpline = arplines[k].split(/\s{2,}/);
		if (arpline.length <= 1) continue;
		var deviceName = arpline[0].replace(".local","");
		var deviceMac = arpline.length > 2 ? arpline[2] : null;
		// if the device is in the filtered names or filtered macs
		// or is a regular IP instead of a hostname, don't count it
		if (filteredNames.indexOf(deviceName) > -1
		  || filteredMacs.indexOf(deviceMac) > -1
		  || rip.test(deviceName)) continue;
		// otherwise count it
		++deviceCount;

		// and add it to the list (removed due to privacy concerns)
		//deviceNames.push(deviceName);
	}
	var json = {
		_id: new Date().getTime().toString(),
		count: deviceCount,
		devices: deviceNames
	};
	return [json, "OK"];
}
