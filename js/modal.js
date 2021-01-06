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
		modal.title = "出错了。"
		modal.content = `<br/>错误细节：<h5><pre>` + arguments[0].stack + `</pre></h5><br/>如果您看到了这条消息，请加入 https://discord.gg/wwQfgPa 以获取帮助。<br/><button class="tabButton" style="background-color: var(--color); padding: 5px 20px 5px 20px" onclick="exportSave()"><p>导出存档到剪贴板</p></button>`
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

function showDiscordModal () {
	modal.title = "Discord servers"
	modal.content = `
		……闲聊和讨论都欢迎<br/><br/>
		<button class="tabButton" onClick="window.open('https://discord.gg/wwQfgPa','_blank')" style="background-color:var(--color)">Jacorb的主频道<h5>可以在这里讨论原版的The Prestige Tree，以及其他东西</h5></button><br>
		<button class="tabButton" onClick="window.open('https://discord.gg/F3xveHV','_blank')" style="background-color:var(--color)">Acamaeda的TMT频道<h5>致力于 "The Modding Tree" 研究的社区及相关模组</h5></button><br>
	`
	modal.showing = true
}