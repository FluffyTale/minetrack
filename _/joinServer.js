const ping = () => {
	require("minecraft-protocol").ping({
		host: "localhost",
		port: config.port,
		version: config.version,
	}).then( joinServer() ).catch(err => {
		console.log("! Can't connect to the localhost" + config.port
		+ "\nProbably the server is turned off or the server has a different port. Write the correct port and press ENTER.")
	})
}

module.exports = ping

const joinServer = () => {
	
	bot = require("mineflayer").createBot({
		host: "localhost",
		port: config.port,
		username: "Fox_the_Tracker",
		version: config.version,
	});
 
	bot.on('message', onChat)
 
	bot.on('end', () => {
		bot = null
	})

	bot.on('login', () => {
		setTimeout(selectPlayer, 200)
		console.log('> Connection established')
		bot.chat("/gamerule sendCommandFeedback")
	})
	
}

opWarning = 0

const onChat = (cm) => {
	console.log(cm.toAnsi())
	if(!cm.extra || !cm.extra[0]) return;
	
	var m = cm.extra[0].text.replace(/<(.*)> /,"")
	if(m.match("Fox_the_Tracker")) return;
	
	if(m.match("Gamerule sendCommandFeedback")) setCommandFeedback(cm)
	if(m.match("do not have permission to perform this command")) operatorError()
	
	if(m.match("!start")) require("./startTracking.js")()
	if(m.match("!stop")) require("./stopTracking.js")("stopped manually")
	if(m.match("!get")) require("./getEntries.js")()
		
	if(m.match("!scoreboard ")) changeScoreboard(m)
	if(m.match("!tag ")) changeTag(m)
		
	if(m.match("!select")) selectPlayerManually(cm, m)
	
	if(m.match("!shift")) switchShift()
}

// Switches
const switchShift = () => {
	if(config.stopOnShift) config.stopOnShift = false
	else config.stopOnShift = true
	bot.chat("Stop on shift is now set to: " + config.stopOnShift)
}

const setCommandFeedback = (m) => {
	if(m.match("set to: false")) commandFeedback = false
}

// Autoselect
const selectPlayer = (a) => {
	config.username = Object.keys(bot.players).find(x=> x != bot.username)
	bot.chat("Selected player to track: " + config.username)
	if(!config.username && !a) setTimeout(selectPlayer(1), 500)
}

const selectPlayerManually = (cm, m) => {
	m = cm.extra[0].text.replace(" !select","").replace(/<|>/g,"")
	config.username = m
	bot.chat("Selected player to track: " + config.username)
}

const changeScoreboard = (m) => {
	m = m.replace("!scoreboard ","")
	config.scoreboard = m
}

const changeTag = (m) => {
	m = m.replace("!tag ","")
	config.tag = m
}

const operatorError = () => {
	ticker = -1
	if(!opWarning) bot.chat(`Please give me /op!!`)
		opWarning = 1
}