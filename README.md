### Glossary transformation

This branch has a small Node application that automatically transforms prose definition contributions into data files.

### Setup and deployment

1. Register a new OAuth token from Github, tied to the user or organization that runs the glossary project this is meant to integrate with. e.g., for `unitedstates/glossary`, you register an application with the `unitedstates` organization.
2. Copy `config.js.example` to `config.js`, and fill in the Oauth token you generated in step 1.