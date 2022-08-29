var script=document.createElement("script");script.src="https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/alertify.min.js",document.head.appendChild(script);var link=document.createElement("link");link.rel="stylesheet",link.href="https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/alertify.css",document.head.appendChild(link),setTimeout(()=>{function isLineSelected(e){return e.children[0].classList.contains("activeline-highlight")}function getCodeLines(){return document.getElementsByClassName("CodeMirror-code")[0].children}function getLineText(e){lineData=e.getElementsByClassName("CodeMirror-line")[0].getElementsByTagName("span")[0].children,lineText="";for(var t=0;t<lineData.length;t++)lineText+=lineData[t].innerText;return lineText}function copyTextToClipboard(e){var t=document.createElement("textarea");t.value=e,document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove()}function getSelectedLine(){lines=getCodeLines();for(var e=0;e<lines.length;e++)if(isLineSelected(lines[e]))return[e,getLineText(lines[e])]}function logAction(e){"true"==localStorage.logActions&&alertify.success(e)}function onLineCalled(line_number,line_text){console.log(line_text),line_text.endsWith("playBoomSound()")?(new Audio("https://www.myinstants.com/media/sounds/vine-boom.mp3").play(),logAction("Boom!")):line_text.includes("//RJS: ")?(mixin=line_text.split("//")[1].trim(),mixin.includes("RJS:")&&eval(mixin.replace("RJS:","")),logAction("Executed RJS: "+mixin)):line_text.includes("playSound(")&&(new Audio(line_text.split("playSound(")[1].split(")")[0]).play(),logAction("Playing sound"))}lastActiveLine=null,setInterval(()=>{try{enabled&&([line,text]=getSelectedLine(),line&&line!=lastActiveLine&&(lastActiveLine=line,onLineCalled(line,text)))}catch(e){}},10),null==localStorage.logActions&&(localStorage.logActions="true"),enabled=!0,function(){if(null==localStorage.disableMenu||"false"==localStorage.disableMenu){let e=document.getElementsByClassName("mat-toolbar-row")[0].children[1].children[1].children,t=e[e.length-1].cloneNode(!0);t.getElementsByClassName("mat-button-wrapper")[0].innerText="Jeroo Features",e[e.length-1].parentNode.insertBefore(t,e[e.length-1].nextSibling),t.addEventListener("click",()=>{option=prompt("Enter a command (ex. help)"),"help"==option?alert(["help - (displays this menu)","toggle - (toggles Jeroo features)","toggle-log - (toggle most logging)","copy-helpers - (copy helper functions)","disable-menu - (stop injecting the menubar button)"].join("\n")):"toggle"==option?(enabled=!enabled,alertify.success("Disabled Jeroo Features")):"toggle-log"==option?(localStorage.logActions="true"==localStorage.logActions?"false":"true",alertify.success("Logging "+("true"==localStorage.logActions?"Enabled":"Disabled"))):"copy-helpers"==option?(copyTextToClipboard(["method hopUntilObstacle(){while (isClear(AHEAD)){hop();}}","method safeHop(){if (!isNet(AHEAD) && !isWater(AHEAD)){hop();}}"].join("\n")),alertify.success("Copied helper functions to clipboard")):"disable-menu"==option?(localStorage.disableMenu="true",alertify.success("Menu Disabled")):alertify.error("Invalid command")})}}(),alertify.notify("Jeroo features loaded!","success",5),alertify.notify("Logging "+("true"==localStorage.logActions?"enabled":"disabled"),"success",5),alertify.notify("Warning dont raise the speed above 3","warning",5)},1e3);
