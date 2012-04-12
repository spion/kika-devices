function(doc, req) {
	var filteredNames = ['dvoarak'],
	    filteredMacs  = [],  
	    filteredCount = 0;
	var rip = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
	var arplines = req.body.split("\n"), deviceNames = [];
	for (var k = 1; k < arplines.length; ++k) {
		var arpline = arplines[k].split(/\s{2,}/);
		var deviceName = arpline[0].replace(".local","");
		var deviceMac = arpline[1];
		if (filteredNames.indexOf(deviceName) == -1
		  && filteredMacs.indexOf(deviceMac) == -1) {
			if (!rip.test(deviceName) && deviceName.length > 0) {
				deviceNames.push(deviceName);
			}
		}
		else {
			++filteredCount;
		}
	}
	var json = {
		_id: new Date().getTime().toString(),
		count: arplines.length - 2 - filteredCount,
		devices: deviceNames
	};
	return [json, "OK"];
}
