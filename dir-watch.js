const fs = require('fs')
const https = require('https');
const checkInterval = 10*60*1000

function checkFolder(foldername) {
  let path = process.env.NFS_PATH +'/'+ foldername
  let lastupdated = fs.statSync(path).mtimeMs
  let lastInterval = Date.now() - checkInterval
  if (lastupdated < lastInterval) { // has folder been updated since last interval?
    contactBot('Alert',`Folder '${foldername}' hasn't been updated the last ${checkInterval/(1000*60)} minutes.`)
  }
}

function contactBot(type,message) {
  let chatID = process.env.BOT_CHATID
  let botToken = process.env.BOT_TOKEN
  let hostname = process.env.HOSTNAME

  let data = JSON.stringify({
      chat_id: chatID,
      text: `Dir-watcher: ${type} [${hostname}]\n${message}`
  })
  let options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
  }
  const req = https.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      try {
        let jsonres = JSON.parse(data)
        if (typeof(jsonres.ok) === 'undefined') {
          console.log('Error in API response', data)
        } else {
          if (!jsonres.ok) {
            console.log('API response not OK:', data)
          }
        }
      } catch(err) {
        console.log('Non-JSON API response', data)
      }
    })
  }).on("error", (err) => {
    console.log("HTTPS error: ", err.message)
  })
  req.write(data)
  req.end()
}


var folders = process.env.WATCH_FOLDERS.split(' ') // The Env var seperates folders by space
contactBot('Notice', `Dir-watch started on these folders: ${process.env.WATCH_FOLDERS}`)

setInterval(()=>{
  for(let i=0;i<folders.length;i++) {
    checkFolder(folders[i])
  }
}, checkInterval) 
