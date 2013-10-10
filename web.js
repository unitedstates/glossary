var express = require("express")
	, util = require('util')
	, config = require('./config')
	, Github = require('./github')
  , app = express();

var repo = new Github(
	config.owner,
	config.repository,
	config.github_token,
	config.committer_name,
	config.committer_email
);
repo.debug = true;

var from_branch = config.from_branch
	, to_branch = config.to_branch;

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
	affected.forEach(function(file) {
		if (syncThis(file))
			syncFile(file);
		else
			console.log("Not syncing " + file);
	});
});

// Do the transform on a given path.
//
// It's not relevant to look at whether the file was removed/modified/etc
// in any particular commit. Instead, figure out their current state in the
// from_branch, and sync the to_branch to meet that state.
//
//  1) get the current state of the file on the `from_branch`
// 	  2a) if it's not there, issue a delete on `to_branch`
//    2b) if it's there, check the `to_branch` for it
//			3a) if it's there, issue an update on `to_branch`
//			3b) if it's not there, issue a create on `to_branch`

var syncFile = function(path) {
	console.log("Checking on " + from_branch + ": " + path);

	var to_path = mapPath(path);

	repo.get(from_branch, path, function(err, data) {
		if (err) console.log("Error fetching details from " + from_branch + " for: " + path);

		// file is no longer on `from`branch`, delete it on `to_branch`
		if (!data)
			deleteFile(to_path);

	});
};

//
var deleteFile = function(path) {
	console.log("Deleting from " + to_branch + ": " + path);

	repo.get(to_branch, path, function(err, data) {
		if (err) errorMsg(err, "get", to_branch, path);

		if (!data)
			console.log("File is already missing from " + to_branch + "???: " + path);
		else {
			repo.delete(to_branch, path, data.sha, "Deleting " + path, function(err, data) {
				if (err) errorMsg(err, "delete", to_branch, path);
				if (!data)
					console.log("File is suddenly missing from " + to_branch + "???: " + path);
				else
					console.log("Deleted.");
			})
		}

	});
};

var syncTo = function(path) {

};


// rule for whether or not a path should be synced
var syncThis = function(path) {
	return (path.indexOf("definitions/") == 0);
}

// rule for taking a path from from_branch and mapping it to to_branch
var mapPath = function(path) {
	return path + ".json";
}

var errorMsg = function(err, action, branch, path) {
	console.log("[" + action + "][" + branch + "][" + path + "] Error: " + err)
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