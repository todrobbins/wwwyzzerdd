# Wwwyzzerdd for Wikidata

Easily edit and view the information in wikidata from Wikipedia

Definitely still in beta. Use at your own risk. Audit all the edits you make.

## Installation

You can find wwwyzzerdd in the browser extension stores

* [Chome Extension](https://chrome.google.com/webstore/detail/wwwyzzerdd-for-wikidata/gfidggfngdnaalpihbdjnfbkfiniookc?hl=en&authuser=0)
* [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/wwwyzzerdd-for-wikidata/)

## Known issues

* Implement case-insensitive external property matching
* Doesn't warn you when you add bad statements (e.g. that violate constraints)
* Doesn't let you undo
* Doesn't tell you when an error has occured
* Doesn't let you link dates/numbers/etc


## Usage

Setup: Install npm / yarn

To build: run bundle.sh

Or if you are having trouble getting this build to work we now offer a Dockerfile. Just install docker and run docker_build.sh. The output bundled artifacts will be deposited in the dist folder.

# Support

This code is supported by a [generous grant from the Wikimedia Foundation](https://meta.wikimedia.org/wiki/Grants:Programs/Wikimedia_Community_Fund/Rapid_Fund/Wwwyzzerdd_user_experience_improvements_and_critical_maintenance_(ID:_22024892)).