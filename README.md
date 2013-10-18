## A glossary for the United States

A collection of pleasant, readable definitions of terms and processes in the United States. [Public domain](#public-domain). Designed for integration in various user-facing applications.

Ease of understanding is the #1 priority. Precision and completeness are #2.

### Guidelines

Definitions are stored in text files, one per file. The name of the entry is the filename (no extension).

The first line is a short, single sentence definition. It should be possible to form a small, light glossary by using the first sentence of every entry.

A longer definition can follow, with paragraphs separated by two line breaks.

The longer definition can use links, but the text should hold up even if the links are stripped out. It should be possible to form a rich glossary using the full text of every entry, whether or not HTML is an option in the user's environment.

### For Example

In the Senate, cloture votes are often practically equivalent to passage votes. Even when people know what a "filibuster" is, the word "cloture" may not mean much.

So, for [Cloture](definitions/congress/Cloture):

> Before a bill can proceed to a final up-or-down vote in the Senate, 60 senators must agree to end debate through a vote on "cloture".

> Preventing the Senate from ending debate in order to avoid voting to pass a bill is often called a filibuster.

> The 60-senator threshold for cloture votes is a Senate rule - it is not part of the Constitution. The Constitution mandates a majority vote for the passage of bills, but the Senate is allowed to set its own rules that govern the process of getting to that final vote.


### Glossary as data

The glossary automatically takes definitions contributed as prose, and publishes them as JSON files, accessible at predictable URLs on Github.

For example, the prose definition for `definitions/congress/Cloture` is available at:

> http://unitedstates.github.io/glossary/definitions/congress/Cloture.json

Under the hood: whenever a contribution is accepted on the `master` branch, Github pings a small service that reads through each contribution and transforms it into a JSON file that is pushed to the project's `gh-pages` branch.

The JSON file contains the glossary in various useful forms:

* `short_definition` - plaintext, contains the first sentence of the entry.
* `long_definition` - Markdown, contains the whole entry, as entered.
* `long_definition_text` - plaintext, contains the whole entry, stripped of links.
* `long_definition_html` - HTML, contains the whole entry, with links transformed into HTML.

The code for this service, a small Node app optimized for deployment on Heroku, is also in this repository, in the [dat branch](/unitedstates/glossary/tree/dat).

### Branches

This project has 3 entirely separate branches:

* `master` - Project description, definitions in prose. Accepts contributions of new definitions.
* `gh-pages` - Glossary definitions as data. Automatically synced with definitions on `master` branch. Doesn't accept contributions.
* `dat` - Code for a small web service that manages the automatic syncing of the prose on the `master` branch to the data on the `gh-pages` branch

### Discovering existing definitions

You can use the Github Repo Contents API to easily introspect on what definitions are available, and how the `gh-pages` branch is laid out. These are public URLs, you don't need to authenticate with Github.

This URL lists the main directories definitions are sorted into:

```
https://api.github.com/repos/unitedstates/glossary/contents/definitions?ref=gh-pages
```

And this this URL lists all the definitions in the `congress` directory:

```
https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress?ref=gh-pages
```

In both cases, you'll get an array of results, where each result's `name` field will tell you what definitions are available. An example of partof the response you might see for `definitions/congress`:

```json
[
  {
    "name": "Adjourn.json",
    "path": "definitions/congress/Adjourn.json",
    "sha": "797db0bfd2be0d775383e7783ba95639cd9fa7f5",
    "size": 398,
    "url": "https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress/Adjourn.json?ref=gh-pages",
    "html_url": "https://github.com/unitedstates/glossary/blob/gh-pages/definitions/congress/Adjourn.json",
    "git_url": "https://api.github.com/repos/unitedstates/glossary/git/blobs/797db0bfd2be0d775383e7783ba95639cd9fa7f5",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress/Adjourn.json?ref=gh-pages",
      "git": "https://api.github.com/repos/unitedstates/glossary/git/blobs/797db0bfd2be0d775383e7783ba95639cd9fa7f5",
      "html": "https://github.com/unitedstates/glossary/blob/gh-pages/definitions/congress/Adjourn.json"
    }
  },
  {
    "name": "Amendment.json",
    "path": "definitions/congress/Amendment.json",
    "sha": "17536f495a23cfbcb9f3a93e46e306ceae1ca7c9",
    "size": 618,
    "url": "https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress/Amendment.json?ref=gh-pages",
    "html_url": "https://github.com/unitedstates/glossary/blob/gh-pages/definitions/congress/Amendment.json",
    "git_url": "https://api.github.com/repos/unitedstates/glossary/git/blobs/17536f495a23cfbcb9f3a93e46e306ceae1ca7c9",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/unitedstates/glossary/contents/definitions/congress/Amendment.json?ref=gh-pages",
      "git": "https://api.github.com/repos/unitedstates/glossary/git/blobs/17536f495a23cfbcb9f3a93e46e306ceae1ca7c9",
      "html": "https://github.com/unitedstates/glossary/blob/gh-pages/definitions/congress/Amendment.json"
    }
  }
  ...
]
```

## Public domain

This project is [dedicated to the public domain](LICENSE). As spelled out in [CONTRIBUTING](CONTRIBUTING.md):

> The project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication][CC0].

> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

> [CC0]: http://creativecommons.org/publicdomain/zero/1.0/