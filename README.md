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


## Glossary as data

> (This is still in-progress &mdash; data isn't yet automatically published, though some is available.)

The glossary automatically takes definitions contributed as prose, and publishes them as JSON files, accessible at predictable URLs on Github.

For example, the definition for `definitions/congress/Cloture` is available at:

> http://unitedstates.github.io/glossary/definitions/congress/Cloture.json

Under the hood: whenever a contribution is accepted, Github pings a small service that reads through each contribution and transforms it into a JSON file that is pushed to the project's `gh-pages` branch.

The JSON file contains the glossary in various useful forms:

* `short_definition` - plaintext, contains the first sentence of the entry.
* `long_definition` - Markdown, contains the whole entry, as entered.
* `long_definition_text` - plaintext, contains the whole entry, stripped of links.
* `long_definition_html` - HTML, contains the whole entry, with links transformed into HTML.

The code for this service, a small Node app optimized for deployment on Heroku, is also in this repository, in the [dat branch](/unitedstates/glossary/tree/dat).

## Branches

This project has 3 entirely separate branches:

* `master` - Project description, definitions in prose. Accepts contributions of new definitions.
* `gh-pages` - Glossary definitions as data. Automatically synced with definitions on `master` branch. Doesn't accept contributions.
* `dat` - Code for a small web service that manages the automatic syncing of the prose on the `master` branch to the data on the `gh-pages` branch

## Public domain

This project is [dedicated to the public domain](LICENSE). As spelled out in [CONTRIBUTING](CONTRIBUTING.md):

> The project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication][CC0].

> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

> [CC0]: http://creativecommons.org/publicdomain/zero/1.0/
