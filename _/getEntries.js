module.exports = () => {
	bot.chat(`Output in the console`)
	
	if(!tracklist.length) return bot.chat(`No entries`)
	
	console.log(`scoreboard players add ${scoreboard} 1\n`)
	
	for(track of tracklist) {
		console.log(
		`execute if score ${scoreboard} matches ${track.tick} run tp ${tag} ${track.xyz.x} ${track.xyz.y} ${track.xyz.z} ${track.yaw} ${track.pitch}`)
	}
	
	console.log(`\nexecute if score ${scoreboard} matches ${tracklist[tracklist.length-1].tick} run scoreboard players reset ${scoreboard}`)
}