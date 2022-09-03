module.exports = (reason) => {
	clearInterval(tracking); console.log(tracking); tracking = null
	bot.chat("> Tracking stopped (" + reason + ")")
	console.log(tracklist)
	
	timer = 0
	if(ticker > 0) {
		return ticker = -1
	}
	
	tracklist = require('./fixEntries.js')(tracklist)
	
	setTimeout(() => { require('./preview.js').start(tracklist) }, 100)
}