var modal = {
    showing: false,
	title: "This is a modal.",
	content: "This is used to show error dialogs, or confirmations for game event such as entering a challenge or reseting a layer.",
}

if (console.everything === undefined)
{
    console.everything = [];

    console.defaultLog = console.log.bind(console);
    console.log = function(){
        console.everything.push({"type":"log", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultLog.apply(console, arguments);
    }
    console.defaultError = console.error.bind(console);
    console.error = function(){
		modal.title = "An error has occured."
		modal.content = "<br/>Details of error:<h5>" + arguments[0].stack.replace("\n", "<br/>") + `</h5><br/>If you can see this, please visit https://discord.gg/wwQfgPa for help.<br/><button class="tabButton" style="background-color: var(--color); padding: 5px 20px 5px 20px" onclick="exportSave()"><p>Export save to clipboard</p></button>`
		modal.showing = true
        console.defaultError.apply(console, arguments);
    }
    console.defaultWarn = console.warn.bind(console);
    console.warn = function(){
        console.everything.push({"type":"warn", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultWarn.apply(console, arguments);
    }
    console.defaultDebug = console.debug.bind(console);
    console.debug = function(){
        console.everything.push({"type":"debug", "datetime":Date().toLocaleString(), "value":Array.from(arguments)});
        console.defaultDebug.apply(console, arguments);
    }
}