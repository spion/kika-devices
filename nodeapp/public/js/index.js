
function lcdOffset(num) {
    var singleDigitW = 36, deltaDigit = 1;
    var where = ((num ? num : 10) - 1);
    var pixels = where * (singleDigitW + deltaDigit) - deltaDigit;
    return pixels;
}

function showLcd(where, temp, tag) {
    
    temp = parseFloat(parseFloat(temp).toFixed(1));
    
    $(where).html('');
    if (temp < 0) {
        temp = Math.abs(temp);
        $("<div></div>").addClass('dot').html("-").appendTo($(where));
    }
    for (var k = 1; k >= -1; --k) {
        var cif = Math.floor(temp / Math.pow(10, k)) % 10;
        if (k == -1)
            $("<div></div>").addClass('dot').html(".").appendTo($(where));
        $('<div></div>').appendTo($(where)).addClass('lcd')
        .css('background-position', 0 - lcdOffset(cif));
    }
    $("<div />").addClass('tag').text(tag).appendTo($(where));
    $("<div />").addClass('clearfix').appendTo($(where));
}




function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number;
}

var isPlural = function(num) {
    return (num % 10 != 1 || num % 100 == 11);
};

var getDuration = function(dur) {
    var minDur = Math.ceil(dur / 1000 / 60);
    var m = minDur % 60;
    var h = Math.floor(minDur / 60);
    var ret = [];
    if (h > 0)
        ret.push(h + "h");
    ret.push(zeroFill(m, 2) + "m");
    return ret.join(" ");
};

var cosm = {};
cosm.key = 'TgZljX6Yu10Bnwja0xOtSu6IXh6SAKw4UlBualJSajZXcz0g';
cosm.feed = function(path, params, cb) {
    if (typeof (params) == 'function') {
        cb = params;
        params = {};
    }
    var ajax = {
        type:'get',
        data: params,
        dataType: 'json',
        //url: 'http://api.cosm.com/v2/feeds/' + path,
        url: '/cosm-feeds/' + path,
        headers: { 'X-ApiKey': cosm.key }
    };
    if (cb) ajax.success = cb;
    return $.ajax(ajax);
};



var updateStatus = function() {

    var yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();

    var statusCosmProm   = cosm.feed('86779/datastreams/hacklab_status', {start: yesterday}), 
        statusAppProm    = $.getJSON("/status", {limit: 12 * 24 * 7}), 
        temperaturesProm = cosm.feed('64655', {start: yesterday, limit: 300});


    function makeFail(tag) {
        return function(err) { console.log(tag + " failed " + JSON.stringify(err)); };
    }

    statusCosmProm.fail(makeFail("statusCosmProm"));
    statusAppProm.fail(makeFail("statusAppProm"));
    temperaturesProm.fail(makeFail("temperaturesProm"));


    console.log("Waiting for promises");
    $.when(statusCosmProm, statusAppProm, temperaturesProm).then(function(res, json, data) {
        res = res[0]; json = json[0]; data = data[0];

        var jsonApp = json;
        try {
        var json = {
            counters: res.datapoints.map(function(dp) {
                return {count: dp.value - 0,time: new Date(dp.at).getTime()};
            }).reverse()
        };
        } catch (e) { var json = {counters: []}; }

        json.counters.unshift({
            count: res.current_value - 0,
            time: new Date(res.at).getTime()
        });
        
        var jc_rev = json.counters.slice().reverse();
        var changepoints = jc_rev.filter(function(el, ix) {
            return ix < 1 || jc_rev[ix - 1].count != el.count || ix == jc_rev.length - 1;
        });
        var markings = changepoints.map(function(el, ix) {
            var end = el.count === 0 && ix < changepoints.length - 1 ? changepoints[ix + 1].time : el.time;
            return {xaxis: {from: el.time, to: end},color: "#f5f5f5"};
        });

        var current = json.counters[0];
        var recentEnough = new Date().getTime() - current.time < 1000 * 60 * 32; // 32 minutes max

        if (recentEnough)
            $("#status").html(current.count ? "отворен" : "напуштен");
        else
            $("#status").html("запуштен");
        var lastDate;
        for (var k = 1; k < json.counters.length; ++k) {
            var item = json.counters[k];
            lastDate = item.time;
            if ((!!item.count) != (!!current.count) || !recentEnough) {
                $("#status-dur").html(getDuration(new Date().getTime() - lastDate));
                break;
            }
            $("#status-dur").html("повеќе од " + getDuration(new Date().getTime() - lastDate));
        }

        var plotopt = {
            xaxis: {
                mode: "time",
                tickFormatter: function(val, axis) {
                    var d = new Date(val);
                    return d.toLocaleTimeString().substr(0, 5);
                }
            },
            legend: {position: 'nw'},
            grid: {markings: markings}
        };

        // Plot ALL the charts!


        var json = jsonApp;   
        var current = json.counters[0];
        var recentEnough = new Date().getTime() - current.time < 1000 * 60 * 32;
        if (recentEnough)
            $("#count").html(current.count);
        else
            $("#count").html("непознат број");

        if (recentEnough || isPlural(current.count))
            $("#plural").show();
        else
            $("#plural").hide();

        $("#names").html("");
        for (var k = 0; k < json.present.length; ++k) {
            var liItem = $("<li></li>");
            $("<img />").attr({src: json.present[k].pic}).appendTo(liItem);
            $("<a></a>").attr({href: 'http://twitter.com/' + json.present[k].name})
                .html(json.present[k].name).appendTo(liItem);
            liItem.appendTo($("#names"));
        }
        for (var k = 0, plotData = []; k < json.counters.length; ++k) {
            plotData.push([json.counters[k].time, json.counters[k].count]);
        }
        plotData.reverse();
        
        var plotPeople = $.extend(true, plotopt, {yaxis: {tickDecimals: 0}});
        $.plot($("#plot"), [plotData], plotPeople);


        showLcd("#temp_hw", data.datastreams[0].current_value, "hw");
        showLcd("#temp_random", data.datastreams[3].current_value, "random");
        showLcd("#temp_lounge", data.datastreams[1].current_value, "lounge");
        var series = data.datastreams.map(function(ds) {
            return {
                label: ds.id,
                data: ds.datapoints ? ds.datapoints.map(function(el) {
                    return [new Date(el.at).getTime(), el.value - 0];
                }) : []
            };
        });
        $.plot($("#temps"), series, plotopt);

    }, function(err1, err2, err3) {
        console.log("Errors" + JSON.stringify(err1) +" "+ err2);
    });

    
};

$(function() {
    updateStatus();
});

window.setInterval(updateStatus, 3 * 60 * 1000);




