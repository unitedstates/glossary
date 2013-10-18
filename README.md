### Glossary transformation

This branch has a small Node application that automatically transforms prose definition contributions into data files.

Once configured, deployed, and set as a web hook in Github, this app will take care of syncing any contributions inside the `definitions` directory of the `master` branch as JSON equivalents on the `gh-pages` branch.

### Setup

First, register a new OAuth token from Github, tied to the user or organization that runs the glossary project this is meant to integrate with. e.g., for `unitedstates/glossary`, you register an application with the `unitedstates` organization.

You can configure the app by **either**:

* copying `config.js.example` to `config.js` and filling in fields (lower case below). Good for local or traditional deployment.
* **not** creating a `config.js`, and using environment variables (upper case below). Good for Heroku or other PaaS deployment.

The fields you definitely need to fill in are:

* `github_token`/`GITHUB_TOKEN`: Your OAuth token you registered with Github above.
* `committer_name`/`COMMITTER_NAME`: Full name to attach to commits this app makes.
* `committer_email`/`COMMITTER_EMAIL`: Email address to attach to commits this app makes.

You may want to change the following fields:

* `owner` / `OWNER`: The user or organization handle owning the repository, defaults to `unitedstates`
* `repository` / `REPOSITORY`: The name of the repository, defaults to `glossary`
* `from_branch` / `FROM_BRANCH`: The branch with prose definitions, defaults to `master`
* `to_branch` / `TO_BRANCH`: The branch with data definitions, defaults to `gh-pages`

You can also change the port it runs on using a `port` field in `config.js`, or a `PORT`.

#### Heroku

This project is in the `dat` branch, so when deploying to Heroku, run:

```bash
git push heroku dat:master
```

This will push this repository's `dat` branch to Heroku's `master` branch, which will trigger the deploy.

#### Local testing

I found testing easiest by forking the repository, and using a convenient tunnelling service like [ngrok](https://ngrok.com/) to make a port on my development machine (my laptop) accessible to the public Internet. Then I added the URL ngrok created to my fork's webhooks and could easily test during development.

### Regenerating data

You can use the `/refresh` endpoint with a `path` parameter to trigger a reprocessing of every definition inside that path.

For example, visiting:

```bash
/refresh?path=definitions/congress
```

Will trigger a regeneration of each definition inside `definitions/congress`.

This is not recursive - it will only affect definitions directly inside the given directory.