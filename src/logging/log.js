
export let consoleLog = (label, content, newline) => {
	if(newline){
		console.log(`${label}: ${JSON.stringify(content)}\n`)
	}else{
		console.log(`${label}: ${JSON.stringify(content)}`)
	}
}
