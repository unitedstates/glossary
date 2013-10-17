### Glossary transformation

This branch has a small Node application that automatically transforms prose definition contributions into data files.

### Use

> TBW

### Setup and deployment

First, register a new OAuth token from Github, tied to the user or organization that runs the glossary project this is meant to integrate with. e.g., for `unitedstates/glossary`, you register an application with the `unitedstates` organization.

#### Local or non-Heroku deployment

Then, copy `config.js.example` to `config.js`, and fill in the following fields:

* `github_token`: Your OAuth token you registered with Github above.
* `committer_name`: Full name to attach to commits this app makes.
* `committer_email`: Email address to attach to commits this app makes.

If you're using a fork or have otherwise changed the setup, you may need to change the following fields:

* `owner`: The user or organization handle owning the repository, e.g. `unitedstates`
* `repository`: The name of the repository, e.g. `glossary`
* `from_branch`: The branch with prose definitions, e.g. `master`
* `to_branch`: The branch with data definitions, e.g. `gh-pages`

#### Heroku Deployment

Instead of using `config.js`, set 7 environment variables:

> TBW

This project is in the `dat` branch, so when deploying to Heroku, run:

```bash
git push heroku dat:master
```

This will push this repository's `dat` branch to Heroku's `master` branch, which will trigger the deploy.