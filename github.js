// minimal Node wrapper for the Github API v3's CRUD API
// http://developer.github.com/v3/repos/contents/
// cause believe it or not, no one seems to have made a Node lib that supports this

var request = require("request");

var Github = function(owner, repo, token, name, email) {
  this.owner = owner;
  this.repo = repo;
  this.token = token;
  this.name = name;
  this.email = email;
};

Github.prototype = {
  readme: function(callback) {
    var self = this;
    if (!callback) return;

    this.api("get", "/repos/:owner/:repo/readme", {}, function(err, data) {
      if (err) return callback(err);
      callback(null, data.content);
    });
  },

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
    }, function(err, data) {
      if (err) callback(err);
      else callback(null, data);
    });
  },

  api: function(method, path, params, callback) {
    var self = this;
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

      // console.log(util.inspect(data));

      // content field is always base64 encoded in CRUD API
      if (data.content)
        data.content = new Buffer(data.content, "base64").toString("ascii");

      callback(null, data);
    };

    console.log(url);
    console.log(JSON.stringify(headers));

    // if a GET, params is sent as a query string
    if (method == "get") request.get({url: url, qs: params, headers: headers}, respond);

    // otherwise, params is encoded as JSON and sent as a form body
    else {
      headers["Content-type"] = "application/x-www-form-urlencoded";
      request[method]({url: url, body: JSON.stringify(params), headers: headers}, respond);
    }
  }
};

module.exports = Github;