//Load alertifyjs
var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/alertify.min.js';
document.head.appendChild(script);

var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/alertify.css';
document.head.appendChild(link);

//If run speed is already defined dont run anything else

origSetTimeout = setTimeout;
setTimeout = function(func, time){
    //Allow for modifying the time
    if (time == 2){origSetTimeout(func, runSpeed)}
    else {origSetTimeout(func, time)}
}

//Give time for alertify to load
setTimeout(() => {
    if (!document.location.href.includes('jeroo.org/beta/dashboard')){
        alertify.error('JF - Not on the Jeroo Code Editor!!', 5)
        return 0; //Stop the code from running!
    }

    //Code to observe the page and detect stuffs
    function isLineSelected(line_element){return line_element.children[0].classList.contains('activeline-highlight')}
    function getCodeLines(){return document.getElementsByClassName('CodeMirror-code')[0].children}
    function getLineText(element){
        lineData = element.getElementsByClassName('CodeMirror-line')[0].getElementsByTagName('span')[0].children
        lineText = '';

        for(var i = 0; i < lineData.length; i++){
            lineText += lineData[i].innerText
        }
        return lineText;
    }

    function copyTextToClipboard(text){
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
    }

    function getSelectedLine(){
        lines = getCodeLines();
        for(var i = 0; i < lines.length; i++){
            if(isLineSelected(lines[i])){
                return [i, getLineText(lines[i])]
            }
        }
    }

    lastActiveLine = null;
    setInterval(() => {
        try {
            if (enabled){
                [line, text] = getSelectedLine();
                if (line){
                    if(line != lastActiveLine){
                        lastActiveLine = line;
                        onLineCalled(line, text);
                    }
                }
            }
        } catch(e){}
    }, 10); //This is not a good way to do this, but it works for now.

    //=====================

    //Config
    if (localStorage['logActions'] == undefined){localStorage['logActions'] = 'true'}

    enabled = true;
    //====================

    //More Helpers
    function logAction(action){if (localStorage['logActions'] == 'true'){alertify.success(action)}}
    //====================

    //Setup menubar
    (function (){
        //If disableMenu is either undefined or false, then show the menu
        if (localStorage['disableMenu'] == undefined || localStorage['disableMenu'] == 'false'){
            let menu_bar  = document.getElementsByClassName('mat-toolbar-row')[0].children[1].children[1].children
            let menu_item = menu_bar[menu_bar.length - 1].cloneNode(true)

            menu_item.getElementsByClassName('mat-button-wrapper')[0].innerText = 'Jeroo Features'

            menu_bar[menu_bar.length - 1].parentNode.insertBefore(menu_item, menu_bar[menu_bar.length - 1].nextSibling)

            menu_item.addEventListener('click', () => {
                option = prompt('Enter a command (ex. help)')
                if (option == 'help'){alert(["help - (displays this menu)",
                                            "speed-modifier - (changes the speed of the code)",
                                            "toggle - (toggles Jeroo features)",
                                            "toggle-log - (toggle most logging)",
                                            "copy-helpers - (copy helper functions)",
                                            "disable-menu - (stop injecting the menubar button)",
                                            "copy-blank - (copy the method required to run jf commands at full speed)",
                                            "github - (opens the github page)"].join('\n'))}
                else if (option == 'toggle'){enabled = !enabled; alertify.success('' ? 'Disabled Jeroo Features' : 'Enabled Jeroo Features')}
                else if (option == 'toggle-log'){localStorage['logActions'] = localStorage['logActions'] == 'true' ? 'false' : 'true'; alertify.success('Logging ' + (localStorage['logActions'] == 'true' ? 'Enabled' : 'Disabled'))}
                else if (option == 'copy-helpers'){
                    copyTextToClipboard(["method hopUntilObstacle(){while (isClear(AHEAD)){hop();}}",
                                         "method safeHop(){if (!isNet(AHEAD) && !isWater(AHEAD)){hop();}}",
                                         "method hopAndPlant(){hop(); plant();}",
                                         "method plantAndHop(){plant(); hop();}",
                                         "method blank(){turn(LEFT); turn(LEFT); turn(LEFT); turn(LEFT);}"].join('\n'))
                    alertify.success('Copied helper functions to clipboard')
                }
                else if (option == 'disable-menu'){localStorage['disableMenu'] = 'true'; alertify.success('Menu Disabled')}
                else if (option == 'copy-blank'){copyTextToClipboard("method blank(){turn(LEFT); turn(LEFT); turn(LEFT); turn(LEFT);}")}
                else if (option == 'github'){window.open('https://github.com/DylanBruner/JerooFeatures')}
                else if (option == 'speed-modifier'){
                    runSpeed = prompt('Enter a speed delay (ex. 0.5)ms')
                    alertify.success('Speed set to ' + runSpeed)
                }
                else {alertify.error('Invalid command')}
            })
        }
    })()
    //====================

    //Custom Stuff
    function onLineCalled(line_number, line_text){
        console.log(line_text)

        //Play the boom sound effect
        if(line_text.endsWith('playBoomSound()')){new Audio('https://www.myinstants.com/media/sounds/vine-boom.mp3').play(); logAction('Boom!')}
        //Execute javascript from jeroo
        else if(line_text.includes('//RJS: ')){mixin = line_text.split('//')[1].trim(); if(mixin.includes('RJS:')){eval(mixin.replace('RJS:', ''))}; logAction('Executed RJS: ' + mixin)}
        //Play sound from URL
        else if(line_text.includes('playSound(')){new Audio(line_text.split('playSound(')[1].split(')')[0]).play(); logAction('Playing sound')}
        //Log text to screen
        else if(line_text.includes('log(')){alertify.success(line_text.split('log(')[1].split(')')[0])}
        //Text To Speach
        else if(line_text.includes('tts(')){
            msg = new SpeechSynthesisUtterance();
            msg.text = line_text.split('tts(')[1].split(')')[0]
            window.speechSynthesis.speak(msg);
            logAction(`Speaking ${msg.text}`)
        }
    }
    //====================

    alertify.notify('Jeroo features loaded!', 'success', 5)
    alertify.notify('Logging ' + (localStorage['logActions'] == 'true' ? 'enabled' : 'disabled'), 'success', 5)
},1000)
