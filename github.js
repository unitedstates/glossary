// minimal Node wrapper for the Github API v3's CRUD API
// http://developer.github.com/v3/repos/contents/
// cause believe it or not, no one seems to have made a Node lib that supports this

var request = require("request")
  , util = require('util');

// owner: user or organization handle
// repo: name of repository
// token: OAuth token generated inside GitHub web UI, settings per-user/org
// name: full (first and last) name to associate with any commits
// email: email address to associate with any commits
//
// set the `debug` property after initialization to turn on extra console output.
var Github = function(owner, repo, token, name, email) {
  this.owner = owner;
  this.repo = repo;
  this.token = token;
  this.name = name;
  this.email = email;
};

Github.prototype = {

  // Get a file in the repo, on a given branch.
  get: function(branch, path, callback) {
    var self = this;
    if (!callback) return;

    this.api("get", "/repos/:owner/:repo/contents/" + path, {
      ref: branch
    }, callback);
  },

  // Create a file in the repo, on a given branch,
  // with the given content and a commit.
  create: function(branch, path, content, message, callback) {
    var self = this;
    if (!callback) return;

    this.api("put", "/repos/:owner/:repo/contents/" + path, {
      branch: branch,
      content: new Buffer(content).toString("base64"),
      message: message,
      committer: {
        name: this.name,
        email: this.email
      }
    }, callback);
  },

  // Update a file in the repo that has the given SHA,
  // on a given branch, with the given content and a commit.
  update: function(branch, path, content, sha, message, callback) {
    var self = this;
    if (!callback) return;

    this.api("put", "/repos/:owner/:repo/contents/" + path, {
      branch: branch,
      content: new Buffer(content).toString("base64"),
      sha: sha,
      message: message,
      committer: {
        name: this.name,
        email: this.email
      }
    }, callback);
  },

  // Update a file in the repo that has the given SHA,
  // on a given branch, with the given content and a commit.
  delete: function(branch, path, sha, message, callback) {
    var self = this;
    if (!callback) return;

    this.api("delete", "/repos/:owner/:repo/contents/" + path, {
      branch: branch,
      sha: sha,
      message: message,
      committer: {
        name: this.name,
        email: this.email
      }
    }, callback);
  },

  // fetch the README for the repo, whatever its filename
  readme: function(branch, callback) {
    var self = this;
    if (!callback) return;

    this.api("get", "/repos/:owner/:repo/readme", {ref: branch}, callback);
  },


  // workhorse API request helper
  api: function(method, path, params, callback) {
    var self = this;
    if (method == "delete") method = "del"; // request lib uses 'del'
    if (!callback) return;
    if (!params) params = {};

    var headers = {
      "Authorization": "token " + this.token
    };

    url = ("https://api.github.com" + path).
      replace(":owner", this.owner).
      replace(":repo", this.repo);

    var respond = function(err, response, body) {
      if (err) return callback(err);
      var data = JSON.parse(body);

      if (self.debug) {
        console.log();
        console.log(method.toUpperCase() + ": " + url);
        console.log(util.inspect(headers));
        console.log(util.inspect(params));
        console.log(util.inspect(data));
        console.log();
      }

      // content field is always base64 encoded in CRUD API
      if (data.content)
        data.content = new Buffer(data.content, "base64").toString("ascii");

      if (data.message == "Not Found" && data.documentation_url)
        callback(null, null);
      else
        callback(null, data);
    };

    // if a GET, params are sent as a query string
    if (method == "get") request.get({url: url, qs: params, headers: headers}, respond);

    // otherwise, params are encoded as JSON and sent as a form body
    else {
      headers["Content-type"] = "application/x-www-form-urlencoded";
      request[method]({url: url, body: JSON.stringify(params), headers: headers}, respond);
    }
  }
};

module.exports = Github;