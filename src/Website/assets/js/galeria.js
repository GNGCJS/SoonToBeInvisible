document.getElementsByClassName("arrow-icon")[0].addEventListener("click", function(){ changeState(document.getElementsByClassName("arrow-icon")[0]) });
function changeState(a){
    if(a.classList.contains("open")){
        a.classList.remove("open");
    } else{
        a.classList.add("open");
    }

}
