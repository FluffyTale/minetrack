module.exports = () => {
	if(tracking) return require('./stopTracking.js')("already tracking")
	
	bot.chat("Start!")
	tracklist = []
	
	timer = 0
	tracking = setInterval(onTracking, 50)
}

stopTracking = require("./stopTracking.js")

const onTracking = () => {
	var player = bot.players[config.username]
	if(!player || !player.entity) return stopTracking("can't see selected player");
	timer++
	if(timer > 2400) return stopTracking("time was exceeded (2 min)")
	
	var entity = player.entity
	if(config.stopOnShift && entity.crouching) return stopTracking("total records: " + tracklist.length)
	
	var xyz = { x: +entity.position.x.toFixed(2), y: +entity.position.y.toFixed(2), z: +entity.position.z.toFixed(2) }
	var yaw = Math.floor(entity.headYaw * (180/-Math.PI) + 180)
	var pitch = Math.floor(entity.pitch * (180/-Math.PI))
	
	var last = tracklist[tracklist.length-1]
	if(last && last.xyz.x === xyz.x && last.xyz.y === xyz.y && 
	last.xyz.z === xyz.z && last.yaw === yaw && last.pitch === pitch) return;
	
	if(last && last.tick === timer - 2) fillMissing(timer, last, xyz, yaw, pitch)
	tracklist.push({ tick: timer, xyz: xyz, yaw: Math.floor(yaw), pitch: Math.floor(pitch) })
}

const fillMissing = (timer, last, xyz, yaw, pitch) => {
	tracklist.push({
		tick: timer - 1,
		xyz: { x:((last.xyz.x+xyz.x)/2).toFixed(2),y:((last.xyz.y+xyz.y)/2).toFixed(2),z:((last.xyz.z+xyz.z)/2).toFixed(2) }, 
		yaw: Math.floor((last.yaw+yaw)/2), pitch: Math.floor((last.pitch+pitch)/2)
	})
	//bot.chat('filled in ' + (timer-1))
}