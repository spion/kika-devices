function(doc, req) {


	var whiteList = function(mac, name) {
		var wl = {
			"00:1c:bf:50:69:cb": "spion"
			"00:19:5b:cd:a9:18": "Doda"
			"00:21:6b:31:d6:da": "Андреј Т."
		};
		if (wl[mac]) { return wl[mac]; }
		return null;
	};

	var filteredNames = ['dvoarak'],
	    filteredMacs  = [],  
	    deviceCount = 0,
		rip = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/,
		arplines = req.body.split("\n"), 
		deviceNamesF = {},
		deviceNames = [];
		
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

		// If its whitelisted, add it to the currently active devices
		if (whiteList(mac, deviceName)) {
			deviceNamesF[whiteList(mac,deviceName)] = true;
		}
	}

	for (var key in deviceNamesF) { deviceNames.push(deviceNamesF[key]); }

	var json = {
		_id: new Date().getTime().toString(),
		count: deviceCount,
		devices: deviceNames
	};
	return [json, "OK"];
}
