module.exports = (list) => {
	var second_entry = list[0].tick - 2
	for(let entry of list) { entry.tick -= second_entry }
	list[0].tick = 1
	
	list.sort((a,b) => a.tick - b.tick )
	
	return list
}