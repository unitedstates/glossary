var express = require("express")
	, util = require('util')
	, config = require('./config')
	, Github = require('./github')
  , app = express();

var repo = new Github(
	config.owner,
	config.repository,
	config.github_token,
	config.name,
	config.email
);

app.use(express.logger());
app.use(express.bodyParser());
app.get('/', function(request, response) {response.send('You can hear my heart beat!');});

// endpoint to run the transform on any modified files
app.post('/', function(request, response) {
	if (!request || !request.body || !request.body.payload) {
		console.log("No payload specified.");
		return;
	}

	var payload = JSON.parse(request.body.payload);
	// console.log(util.inspect(payload));

	// only care about commits to the master branch
	var branch = payload.ref.split("/").slice(-1)[0];
	if (branch != config.from_branch)
		return;

	// collect every path mentioned that was added, modified, or removed in any commit
	var affected = [];
	payload.commits.forEach(function(commit) {
		affected = affected.
			concat(commit.added).concat(commit.modified).concat(commit.removed);
	});
	affected = arrayUnique(affected);
	affected.forEach(transform);
});

// do the transform on a given path -
//  1) get the current state of the file in Github
//  2a) if it's been removed, issue a delete on gh-pages
//  2b) if it's been added, issue a create on gh-pages
//  2c) if it's been modified, issue an update on gh-pages
var transform = function(path, sha) {
	console.log("checking: " + path);

};



// uniq-ify an array
var arrayUnique = function(a) {
  return a.reduce(function(p, c) {
    if (p.indexOf(c) < 0) p.push(c);
    return p;
  }, []);
};



var port = process.env.PORT || config.port || 5000;
app.listen(port, function() {console.log("Now listening on port " + port + ".");});