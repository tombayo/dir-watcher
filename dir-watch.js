const fs = require('fs')
require('dotenv').config()

function checkFolder(foldername) {
  let path = process.env.ROOT_FOLDER +'/'+ foldername
  let lastupdated = statSync(path).mtimeMs
  let now = Date.now()
  let msSinceUpdate = now - lastupdated

  return (msSinceUpdate/1000).toFixed(0) // Convert to seconds
}

var folders = process.env.WATCH_FOLDERS.split(' ') // The Env var seperates folders by space
var textfile = `
# HELP dir_watcher_seconds_since_update Number of seconds since last folder update.
# TYPE dir_watcher_seconds_since_update gauge
`

for(let i=0;i<folders.length;i++) {
  textfile += `dir_watcher_seconds_since_update{folder="${folders[i]}"} ${checkFolder(folders[i])}\n`
}

writeFileSync(process.env.PROM_FILE_PATH,textfile)
