module.exports = {
	start: (tracks) => {
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
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }