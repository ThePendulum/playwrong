# Playwrong
Demonstration of issue where concurrent Playwright calls prevent Node from exiting.

* `npm install`
* `node app.js`
* Change `maxConcurrent` to `1` for the script to exit fine, `2` or more for it to keep running
