function(doc, req) {
	var filtered = ['dvoarak']
	var rip = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
	var arplines = req.body.split("\n"), deviceNames = [];
	for (var k = 1; k < arplines.length; ++k) {
		var deviceName = arplines[k].split(" ")[0].replace(".local","");
		if (!rip.test(deviceName) && deviceName.length > 0 && filtered.indexOf(deviceName) == -1) {
			deviceNames.push(deviceName);
		}
	}
	var json = {
		_id: new Date().getTime().toString(),
		count: arplines.length - 2,
		devices: deviceNames
	};
	return [json, "OK"];
}
