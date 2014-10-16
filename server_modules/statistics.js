var db = require('./models');

exports.add = function (req, res) {
	var backgroundSpeed = req.param('backgroundSpeed');
    var sameAsForeground = req.param('sameAsForeground');
    var noticedObject = req.param('noticedObject');
    var ip = req.connection.remoteAddress;

    sameAsForeground = sameAsForeground === 'true';
    noticedObject = noticedObject === 'true';
    
    if(!(backgroundSpeed === 'fast' || backgroundSpeed ==='slow')) {
    	sendInvalidError();
    	return;
    }

    db.TestRuns.find({
        where: {
            ipAddress: ip
        }
    }).success(onIpSearchSuccess).error(onIpSearchFail);

    function onIpSearchSuccess(model) {
        if(!model) {
            addTestRun();
        } else {
            onAddFailed();
        }
    }

    function onIpSearchFail() {
        addTestRun();
    }

    function addTestRun() {
        var testRun = {
            backgroundSpeed: backgroundSpeed,
            sameAsForeground: sameAsForeground,
            noticedObject: noticedObject,
            ipAddress: ip
        };

        db.TestRuns.create(testRun, onAddSuccess, onAddFailed);
    }

    function sendInvalidError() {
    	res.send(400, {
    		errorMsg: 'Some parameters were incorrect'
    	});
    }

    function onAddSuccess() {
		res.send(201, {
    		msg: 'Successfully submitted statistics'
    	});
    }

    function onAddFailed() {
    	res.send(400, {
    		errorMsg: 'Unable to register more statistics from this address'
    	});
    }
}

exports.get = function(req, res) {
    db.TestRuns.findAll({}).success(onSearchSuccess).error(onSearchFail);
    
    function onSearchSuccess(models) {
        res.send(200, models);
    }

    function onSearchFail() {

    }
}