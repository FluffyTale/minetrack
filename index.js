const mc = require("mineflayer")
const config = require("./config.json")

// Listening in console

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
	var text = d.toString().trim()
    
	if(+text && !bot) {
		port = +text
		return joinServer()
	}
	
	if(text.match(/exit|quit/)) process.exit()
	
	console.log("> Command wasn't processed: " + text.length ? text : "none")
  });

// 

port = 25565
bot = null

selected = null

tracklist = []
tracking = null

ticker = 0

commandFeedback = true

// Create a bot

const joinServer = () => {
 
 bot = mc.createBot({
  host: "localhost",
  port: port,
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

// Prevent from crash

process.on('uncaughtException', function (error) {
  if(error.code == "ECONNREFUSED") {
	  console.log("! Can't connect to the localhost:" + port)
	  console.log("  Probably server is shut down or you have to specify server port")
	  return
  }
  
  console.log('! Caught exception: ', error);
  process.exit(1)
});

// Packets and other

const onTracking = () => {
	var player = bot.players[selected]
	if(!player || !player.entity) return stopTracking("can't see selected player");
	timer++
	if(timer > 2400) return stopTracking("time was exceeded (2 min)")
	
	var entity = player.entity
	if(entity.crouching) return stopTracking("total records: " + tracklist.length)
	
	var xyz = { x: +entity.position.x.toFixed(2), y: +entity.position.y.toFixed(2), z: +entity.position.z.toFixed(2) }
	var yaw = entity.headYaw * (180/-Math.PI) + 180
	var pitch = entity.pitch * (180/-Math.PI)
	
	var last = tracklist.at(-1)
	if(last && last.xyz === xyz && last.yaw === yaw && last.pitch === pitch) return;
	
	tracklist.push({ tick: timer, xyz: xyz, yaw: Math.floor(yaw), pitch: Math.floor(pitch) })
}

const startTracking = () => {
	if(tracking) return stopTracking("already tracking")
	bot.chat("Start!")
	timer = 0
	ticker = -1
	tracklist = []
	
	tracking = setInterval(onTracking, 50)
}

const stopTracking = (reason) => {
	clearInterval(tracking)
	bot.chat("> Tracking stopped (" + reason + ")")
	tracklist = fixEntries(tracklist)
	startPreview(tracklist)
}

const startPreview = (tracks) => {
	ticker = 0
	if(commandFeedback) bot.chat("/gamerule sendCommandFeedback false")
	
	async function preview() {
		ticker += 1
		var track = tracklist.find(x=> x.tick === ticker)
		
		if(track) bot.chat(`/tp @s ${track.xyz.x} ${track.xyz.y} ${track.xyz.z} ${track.yaw} ${track.pitch}`)
		if(ticker > tracklist[tracklist.length-1].tick + 23) ticker = 0
		await sleep(50)
		if(ticker != -1) preview()
		if(ticker == -1 && commandFeedback) bot.chat("/gamerule sendCommandFeedback true")
	}
	
	preview()
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

const fixEntries = (list) => {
	var second_entry = list[0].tick - 2
	for(let entry of list) { entry.tick -= second_entry }
	list[0].tick = 1
	
	for(let e of list) {
		let a = list.find(n=> n.tick === e.tick + 1)
		let b = list.find(c=> c.tick === e.tick + 2)
		if(!a && b) list.push({ tick: e.tick + 1, 
								xyz: { x:(e.xyz.x+b.xyz.x)/2,y:(e.xyz.y+b.xyz.y)/2,z:(e.xyz.z+b.xyz.z)/2 }, 
								yaw: (e.yaw+b.yaw)/2, pitch: (e.pitch+b.pitch)/2 })
	}
	
	list.sort((a,b) => a.tick - b.tick )
	
	return list
}

const getEntries = () => {
	bot.chat(`Output to the console`)
	ticker = -1
	if(!tracklist.length) return bot.chat(`No entries`)
	console.log(`scoreboard players add TICK SCOREBOARD 1\n`)
	for(track of tracklist) {
		console.log(
		`execute if score TICK SCOREBOARD matches ${track.tick} run tp @e[tag=TAG] ${track.xyz.x} ${track.xyz.y} ${track.xyz.z} ${track.yaw} ${track.pitch}`)
	}
	console.log(`\nexecute if score TICK SCOREBOARD matches ${tracklist[tracklist.length-1].tick} run scoreboard players reset TICK SCOREBOARD`)
}

//bot._client.on('packet', onPacket)
//const onPacket = (P, T) => {
//	if(!tracking) return;
//	if(T.name !== "rel_entity_move") return;
//	console.log(T.name)
//}

const onChat = (cm) => {
	console.log(cm.toAnsi())
	if(!cm.extra || !cm.extra[0]) return
	var m = cm.extra[0].text
	
	if(m.match("Gamerule sendCommandFeedback")) setCommandFeedback(cm)
	
	if(m.match("!start")) startTracking()
	if(m.match("!stop")) stopTracking("stopped manually")
	if(m.match("!get")) getEntries()
}

const setCommandFeedback = (m) => {
	if(m.match("set to: false")) commandFeedback = false
}

const selectPlayer = () => {
	selected = Object.keys(bot.players).find(x=> x != bot.username)
	bot.chat("Selected player to track: " + selected)
}



joinServer(); // auto-join