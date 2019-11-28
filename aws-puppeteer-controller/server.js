var
    connect = require('connect'),
    express = require('express'),
    math = require('mathjs');
fs = require('fs'),
    app = express(),
    stats = { started: 0, completed: 0, errored: 0, connected_count: 0, min: -1, max: 0, median: 0, time: [], errortypes: {}, errors: [], connected: {}, progress: [] },
    bots = 6,
    questions = 10,
    state = -1,
    config = null;
tmpidx = '';
botticketcounter = 0;
var clientids = [];
process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (config !== null) fs.writeFileSync('config.json', JSON.stringify(config, null, 4));
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

var readCallback = function (err, data) {
    if (err) throw err;
    config = JSON.parse(data);
    console.log(config);
};

fs.readFile('config.json', 'utf8', readCallback);
fs.watchFile('config.json', function () {
    console.log("Config updated.");
    fs.readFile('config.json', readCallback);
});

setInterval(function () {
    stats.connected_count = 0;
    stats.connected = {};
}, 8000);

app.get('/error/', function (req, res) {
    var time = req.query.time;
    var title = req.query.title;
    var doc = req.query.doc;
    if (time) {
        stats.errored++;
        console.log(stats.errored + " have errored latest with: " + title);
        stats.errors.push({ error: title, body: doc });
        if (stats.errortypes.hasOwnProperty(doc)) {
            stats.errortypes[doc]++;
        } else {
            stats.errortypes[doc] = 1;
        }

    }
    res.send(200);
});
app.get('/intstatus/', function (req, res) {
    //console.log(req.query.intstatus);
    if (req.query.intstatus != "" && req.query.intstatus != "Done") {
        stats.errors.push({ error: Date(), body: req.query.intstatus });
        res.send(200);
    }

});
app.get('/progress/', function (req, res) {
    var bot = req.query.bot;
    var time = req.query.time;
    if (time && bot) {
        stats.progress.push(time);
        console.log("bot sent progress");
    }
    res.send(200);
});
app.get('/done/', function (req, res) {
    var time = parseInt(req.query.time);
    //if (time) {
    stats.completed++;
    stats.time.push(time);
    console.log(stats.completed + " have finished in " + time + " seconds.");
    //}
    res.send();
});
app.get('/start/', function (req, res) {
    if (stats.started == 2000) {
        stats.started = 0;
    }
    if (req.query.clientid) {

        if (clientids.indexOf(req.query.clientid) >= 0) {
            res.send("0");
            console.log("declined " + req.query.clientid);
        } else {
            clientids.push(req.query.clientid);
            stats.started++;
            res.send("" + stats.started);
            console.log(stats.started + " Started " + req.query.clientid);
        }
    } else {
        stats.started++;
        res.send("" + stats.started);
        console.log(stats.started + " Started");
    }

});

app.get('/test/', function (req, res) {
    if (req.query.questions) {
        questions = req.query.questions;
    }
    if (req.query.bots) {
        bots = req.query.bots;
    }
    state = 1;
    config.test++;
    res.send(200);
});

app.get('/cyberatest/', function (req, res) {

    if (req.query.bots) {
        bots = req.query.bots;
    }
    state = 4;
    config.test++;
    res.send(200);
});


app.get('/baselinetest/', function (req, res) {

    if (req.query.bots) {
        bots = req.query.bots;
    }
    var fs = require('fs');
    var file = fs.readFileSync('baseline.txt', 'utf8');
    tmpidx = "";
    for (var i = bots - 1; i >= 0; i--) {
        tmpidx += file;
        tmpidx += "\r\n";
    };
    state = 3;
    config.test++;
    res.send(200);
});


app.get('/srstest/', function (req, res) {

    if (req.query.bots) {
        bots = req.query.bots;
    }
    var fs = require('fs');
    var file = fs.readFileSync('srstest.txt', 'utf8');
    tmpidx = "";
    for (var i = bots - 1; i >= 0; i--) {
        tmpidx += file;
        tmpidx += "\r\n";
    };
    state = 3;
    config.test++;
    res.send(200);
});

app.get('/uasrstest/', function (req, res) {

    if (req.query.bots) {
        bots = req.query.bots;
    }
    var fs = require('fs');
    var file = fs.readFileSync('uasrstest.txt', 'utf8');
    tmpidx = "";
    for (var i = bots - 1; i >= 0; i--) {
        tmpidx += file;
        tmpidx += "\r\n";
    };
    state = 3;
    config.test++;
    res.send(200);
});

app.get('/statictest/', function (req, res) {

    if (req.query.bots) {
        bots = req.query.bots;
    }
    var fs = require('fs');
    var file = fs.readFileSync('static.txt', 'utf8');
    tmpidx = "";
    for (var i = bots - 1; i >= 0; i--) {
        tmpidx += file;
        tmpidx += "\r\n";
    };
    state = 5;
    config.test++;
    res.send(200);
});


app.get('/randomtest/', function (req, res) {

    if (req.query.bots) {
        bots = req.query.bots;
    }
    state = 2;
    config.test++;
    res.send(200);
});


app.get('/update/', function (req, res) {
    state = 0;
    config.test++;
    res.send(200);
});
app.get('/heartbeat/', function (req, res) {
    stats.connected = {};
    console.log("Connections reset.");
    res.send(200);
});
app.get('/reset/', function (req, res) {
    stats = { started: 0, completed: 0, errored: 0, connected_count: 0, min: -1, max: 0, median: 0, time: [], errortypes: {}, errors: [], connected: {}, progress: [] };
    //clientids = [];
    console.log("Server reset.");
    res.send(200);
});
app.get('/stats/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (stats.time.length > 0) {
        stats.median = math.mean(stats.time);
    }


    for (var i = stats.time.length - 1; i >= 0; i--) {
        var time = stats.time[i];
        if (time < stats.min || stats.min < 0) {
            stats.min = time;
        }
        if (time > stats.max) {
            stats.max = time;
        }
    };
    res.json(stats);
});


app.get('/kill/', function (req, res) {
    state = -1;
    config.test++;
    res.send(200);
});
app.get('/arbitrary/', function (req, res) {
    state = 99;
    config.test++;
    res.send(200);
});

app.get('/logoff/', function (req, res) {
    state = -2;
    config.test++;
    res.send(200);
});

app.get('/', function (req, res) {
    if (config) {
        var index = "test1_blah" + config.test + "\r\ncd /d %0\\..\r\ntaskkill /F /IM AutoMoodleIE.exe\r\ntaskkill /F /IM iexplore.exer\ntaskkill /F /IM chrome.exe\r\nrundll32.exe InetCpl.cpl,ClearMyTracksByProcess 2\r\n";
        if (state === 1) {
            for (var i = bots - 1; i >= 0; i--) {
                index += "Start AutoMoodleIE.exe DoQuiz," + config.course + "," + config.quiz + "," + config.redirect + "," + questions + "\r\n";
            };

        } else if (state === 2) {
            for (var i = bots - 1; i >= 0; i--) {
                index += "Start AutoMoodleIE.exe DoRandom\r\n";
            };

        } else if (state === 3) {
            index += tmpidx;

        } else if (state === 5) {
            index += tmpidx;
        } else if (state === 4) {
            var fs = require('fs');
            var file = fs.readFileSync('cybera.txt', 'utf8');
            for (var i = bots - 1; i >= 0; i--) {
                index += file;
                index += "\r\n;"
            };


        } else if (state === 0) {
            index += "del /Q AutoMoodleIE.exe\r\n"
            index += "wget http://54.210.111.96:8880/static/AutoMoodleIE.exe\r\n"
        } else if (state === 99) {
            var fs = require('fs');
            var file = fs.readFileSync('arbitrary.txt', 'utf8');
            index += file;
        } else if (state === -2) {
            index += "taskkill /F /IM Authentication.exe\r\n"
            index += "Start \"C:\\Program Files\\Authentication\\Authentication.exe\"\r\n"
        }
        res.set('Content-Type', 'text/plain');
        res.send(index);
    } else {
        res.send(200);
    }
    if (stats.connected[req.ip] != 1) {
        stats.connected[req.ip] = 1;
        stats.connected_count++;
    }
});
app.get('/static/*', function (req, res) {
    res.sendfile(__dirname + "/" + req.path);
});
app.listen(8880);
console.log("Server running.");
