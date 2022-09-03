const mc = require("mineflayer")
config = require("./config.json")

// Listening in console

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
	var text = d.toString().trim()
    
	if(+text && !bot) {
		config.port = +text
		return joinServer()
	}
	
	if(text.match(/exit|quit/)) process.exit()
	
	console.log("> Command wasn't processed: " + text.length ? text : "none")
  });

bot = null //
tracklist = [] // entries
tracking = null // interval
timer = 0 // tracking timer
commandFeedback = true
ticker = 0

// Creates a bot

const joinServer = require("./_/joinServer.js")
joinServer()

//bot._client.on('packet', onPacket)
//const onPacket = (P, T) => {
//	if(!tracking) return;
//	if(T.name !== "rel_entity_move") return;
//	console.log(T.name)
//}