$("#seta_left").click(() => {
    $($(".hiddenR").get()[$(".hiddenR").get().length - 1]).removeClass("hiddenR");
    let arr = $(".detalhes_img").get();
    let aux = [];
    for (let i = 0; i < arr.length; i++)
        if(!$(arr[i]).hasClass("hidden") && !$(arr[i]).hasClass("hiddenR"))
            aux.push(arr[i]);
    if(aux.length > 1)
        $(aux[aux.length - 1]).addClass("hidden");    
});

$("#seta_right").click(() => {
    let arr = $(".detalhes_img").get();
    $($(".hidden").get()[0]).removeClass("hidden");
    for (let i = 0; i < arr.length - 1; i++){
        if(!$(arr[i]).hasClass("hiddenR") && !$(arr[i]).hasClass("hidden")){
            $(arr[i]).addClass("hiddenR");
            break;
        }
    }
});