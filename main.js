//Injection helpers
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
        [line, text] = getSelectedLine();
        if (line){
            if(line != lastActiveLine){
                lastActiveLine = line;
                onLineCalled(line, text);
            }
        }
    } catch(e){}
}, 10);
//Injection helpers

//Main
function onLineCalled(line_number, line_text){
    if(line_text.endsWith('playBoomSound')){new Audio('https://www.myinstants.com/media/sounds/vine-boom.mp3').play()}
    else if(line_text.includes('//')){
        mixin = line_text.split('//')[1].trim();
        if(mixin.includes('RJS:')){eval(mixin.replace('RJS:', ''))}
    }
}
//Main
