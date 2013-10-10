// minimal Node wrapper for the Github API v3's CRUD API
// http://developer.github.com/v3/repos/contents/
// cause believe it or not, no one seems to have made a Node lib that supports this

var request = require("request");

var Github = function(owner, repo, token) {
  this.owner = owner;
  this.repo = repo;
  this.token = token;
};

Github.prototype = {
  readme: function(callback) {
    var self = this;
    if (!callback) return;

    this.api("get", "/repos/:owner/:repo/readme", function(err, data) {
      if (err) return callback(err);
      callback(null, data.content);
    });
  },

  api: function(method, path, callback) {
    var self = this;
    if (!callback) return;

    url = ("https://api.github.com" + path).
      replace(":owner", this.owner).
      replace(":repo", this.repo);

    request[method](url, function(err, response, body) {
      if (err) return callback(err);
      var data = JSON.parse(body);

      // console.log(util.inspect(data));

      // content field is always base64 encoded in CRUD API
      if (data.content)
        data.content = new Buffer(data.content, "base64").toString("ascii");

      callback(null, data);
    });
  }
};

module.exports = Github;