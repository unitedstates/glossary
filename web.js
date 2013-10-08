var express = require("express");
var util = require('util');
var app = express();
app.use(express.logger());
app.use(express.bodyParser());


// heartbeat
app.get('/', function(request, response) {response.send('Hello World!');});


app.post('/', function(request, response) {
	console.log("request = " + util.inspect(request.body));
	if (!request || !request.body || !request.body.payload) {
		console.log("No payload specified.");
		return;
	};

	var payload = JSON.parse(request.body.payload);
	console.log("payload = " + util.inspect(payload));
	console.log("commits length = " + payload.commits.length);

	var masterBranchBaseUrl = "https://raw.github.com/keith5000/USGlossary/";

	for (var commitCount=0; commitCount < payload.commits.length; commitCount++) {
		if (payload.commits.added) {
			for (var addedCount=0; addedCount < payload.commits.added.length; addedCount++) {
				var rawFileUrl = masterBranchBaseUrl + payload.commits.added[addedCount];
				console.log("Added url: " + rawFileUrl);
			}
		}

		if (payload.commits.modified) {
			for (var modifiedCount=0; modifiedCount < payload.commits.modified.length; modifiedCount++) {
				var rawFileUrl = masterBranchBaseUrl + payload.commits.modified[modifiedCount];
				console.log("Modified url: " + rawFileUrl);
			}
		}
	}

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});


/*
var githubhook = require('githubhook');
var github = githubhook({ port: process.env.PORT || 3240 });

github.listen();

github.on('push:https://github.com/keith5000/USGlossary/tree/CommitTest', function (ref, data) {
	response.send("push");
});

github.on('commit:https://github.com/keith5000/USGlossary/tree/CommitTest', function (ref, data) {
	response.send("commit");
});
*/
