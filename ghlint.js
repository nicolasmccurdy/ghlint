var _ = require('underscore');
var request = require('request-promise');

var repoURL = 'https://api.github.com/repos/nicolasmccurdy/repos';
var options = {
  headers: {
    'User-Agent': 'ghlint'
  },
  qs: {
    client_id: process.env.GHLINT_ID,
    client_secret: process.env.GHLINT_SECRET
  },
  url: repoURL
}

var linters = [
  {
    message: 'has commits',
    lint: function (repoURL) {
      return request(_.extend(options, { url: repoURL + '/commits' })).then(function (body) {
        return body.length > 0;
      });
    }
  },
  {
    message: 'has a lowercase name',
    lint: function (repoURL) {
      return request(options).then(function (body) {
        return /^[a-z\-_]+$/.test(body.name);
      });
    }
  },
  {
    message: 'has a description',
    lint: function (repoURL) {
      return request(options).then(function (body) {
        return Boolean(body.full_name);
      });
    }
  },
  {
    message: 'default branch is master',
    lint: function (repoURL) {
      return request(options).then(function (body) {
        return body.default_branch === 'master';
      });
    }
  },
  {
    message: 'has issues',
    lint: function (repoURL) {
      return request(options).then(function (body) {
        return Boolean(body.has_issues);
      });
    }
  },
  {
    message: 'has a homepage if it is using GitHub Pages',
    lint: function (repoURL) {
      return request(options).then(function (body) {
        return body.has_pages ? Boolean(body.homepage) : true;
      });
    }
  }
]

linters.forEach(function (linter) {
  linter.lint(repoURL).then(function (result) {
    console.log(linter.message + ': ' + result);
  }, console.error);
});
