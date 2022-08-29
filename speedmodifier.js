origSetTimeout = setTimeout;
setTimeout = function(func, time){
    if (time == 2){
        origSetTimeout(func, .000000000005);
    }
    else {origSetTimeout(func, time)}
}