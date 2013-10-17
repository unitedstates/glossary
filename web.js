var fs = require('fs'),
    config = {};

if (fs.existsSync("./config.js"))
  config = require('./config');
else {
  config.github_token = process.env.GITHUB_TOKEN;
  config.owner = process.env.OWNER;
  config.repository = process.env.REPOSITORY;
  config.committer_name = process.env.COMMITTER_NAME;
  config.committer_email = process.env.COMMITTER_EMAIL;
  config.from_branch = process.env.FROM_BRANCH || 'master';
  config.to_branch = process.env.TO_BRANCH || 'gh-pages';
}

var express = require("express"),
    util = require('util'),
    Github = require('./github'),
    Glossary = require('./glossary'),
    async = require('async'),
    sleep = require('sleep'),
    app = express();

var repo = new Github(
  config.owner,
  config.repository,
  config.github_token,
  config.committer_name,
  config.committer_email
);

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

  syncFiles(affected);
});

app.get('/refresh', function(request, response) {
  var path = request.param("path");
  if (!path) return response.send("No 'path' provided.");

  repo.get(from_branch, path, function(err, files) {
    if (err) return response.send("Error looking up path.");
    else if (!files) return response.send("No files found.");

    if (Object.prototype.toString.call(files) !== '[object Array]')
      files = [files];

    // turn into an array of paths
    var paths = [];
    files.forEach(function(file) {paths[paths.length] = file.path;});

    // takes care of sync/sleep/etc
    syncFiles(paths);

    response.send("Kicked off updating for " + files.length + " files.");
  });
});


// Given an array of files, run sync on each of them.
//
// Run the sync in synchronous sequence, with a pause between,
// until Github resolves an acknowledged internal race condition bug.
var syncFiles = function(files) {
  async.eachSeries(files, function(file, done) {

    // temporary workaround: sleep synchronously
    var delay = 1;
    console.log("Sleeping for " + delay + "s.");
    sleep.sleep(delay);

    if (syncThis(file))
      syncFile(file, done);
    else
      console.log("Not syncing " + file);
  }, function(err) {
    if (err) return console.log("Error syncing file! " + err);
    console.log("Done syncing " + files.length + " files.");
  });
}

// Do the transform on a given path.
//
// It's not relevant to look at whether the file was removed/modified/etc
// in any particular commit. Instead, figure out their current state in the
// from_branch, and sync the to_branch to meet that state.
//
//  1) get the current state of the file on the `from_branch`
//  2) get the current state of the file on the `to_branch`
//    3a) if it's not on `from` and is on `to`,  issue a delete to `to_branch`
//    3b) if it's on `from` and is not on `to`,  issue a create to `to_branch`
//    3c) if it's on `from` and on `to`,         issue an update to `to_branch`
//    3d) if it's not on either `from or `to`,   i hate everything

var syncFile = function(path, done) {
  console.log("Checking on " + from_branch + ": " + path);

  var to_path = mapPath(path);

  repo.get(from_branch, path, function(fromErr, fromData) {
    if (fromErr) return console.log("Error fetching details from " + from_branch + " for: " + path);

    repo.get(to_branch, to_path, function(toErr, toData) {
      if (toErr) return console.log("Error fetching details from " + to_branch + " for: " + to_path);

      // file is no longer on `from`branch`, delete it on `to_branch`
      if (!fromData && toData)
        deleteFile(to_path, toData, done);
      else if (fromData && !toData)
        createFile(to_path, fromData, done);
      else if (fromData && toData)
        updateFile(to_path, fromData, toData, done);
      else if (!fromData && !toData) {
        console.log("File is already missing from " + to_branch + "???: " + path);
      }
    });

  });
};


// delete a file on `to_branch`
var deleteFile = function(path, to, done) {
  console.log("Deleting from " + to_branch + ": " + path);

  repo.delete(to_branch, path, to.sha, "Deleting " + path, function(err, data) {
    if (err) errorMsg(err, "delete", to_branch, path);
    if (!data)
      console.log("File is suddenly missing from " + to_branch + "???: " + path);
    else
      console.log("Deleted.");

    done();
  })
};

// create a file on `to_branch`
var createFile = function(path, from, done) {
  console.log("Creating on " + to_branch + ": " + path);

  var toContent = Glossary.transform(from.content);

  repo.create(to_branch, path, toContent, "Creating " + path, function(err, data) {

    if (err) errorMsg(err, "create", to_branch, path);
    if (!data)
      console.log("Couldn't create on " + to_branch + "???: " + path);
    else {
      if (data.commit)
        console.log("Created, commit sha " + data.commit.sha);
      else
        console.log("Problem creating: " + util.inspect(data));
    }

    done();
  });
}

// update a file on `to_branch` using content from `from_branch`
var updateFile = function(path, from, to, done) {
  console.log("Updating on " + to_branch + ": " + path);

  var toContent = Glossary.transform(from.content);

  repo.update(to_branch, path, toContent, to.sha, "Updating " + path, function(err, data) {
    if (err) errorMsg(err, "update", to_branch, path);
    if (!data)
      console.log("Couldn't upate on " + to_branch + "???: " + path);
    else {
      if (data.commit)
        console.log("Updated, commit sha " + data.commit.sha);
      else
        console.log("Problem updating: " + util.inspect(data));
    }
    done();
  });
}


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