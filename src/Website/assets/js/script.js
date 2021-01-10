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

let animais_arr = [];
let nomes_arr = [];
let to_stay = [];
let should_delete = false;

function animais(){
    $(".carta").get().forEach(element => {
        animais_arr.push(element);
    });;

    $(".nome_animal").get().forEach(element => {
        nomes_arr.push($(element).text());
    });;

}

$("#searchbar").keyup((event) => {
    if(event.which === 13){
        animais_arr.forEach(element => {$(element).remove();});

        nomes_arr.forEach(nome => {
            nome.split(" ").forEach(palavra_nome => {
                String($("#searchbar").val()).split(" ").forEach(palavra_procurado => {
                    if(String(palavra_nome).toLowerCase().includes(String(palavra_procurado).toLowerCase())){
                        to_stay.push(animais_arr[nomes_arr.indexOf(nome)]);
                    }
                });
            });
        });

        to_stay.forEach(element => {$(".container").append(element);});

        $(".carta .header label").get().forEach(c => {
            let aux = String($(c).html().toLowerCase()).split(" ");

            for (let i = 0; i < aux.length; i++) {
                aux[i] = aux[i].replace("<mark>", "").replace("</mark>", "");
            }
            
            $("#searchbar").val().split(" ").forEach(palavra => {
                try {aux[aux.indexOf(String(palavra))] = `<mark>${aux[aux.indexOf(String(palavra))]}</mark>`}
                catch (error) {console.log("Algo correu mal");}
            });

            let final = "";

            aux.forEach(p => {final += p + " ";});

            $(c).html(String(final).trim());
        });

        to_stay = [];
        should_delete = true;
    }
    else if(event.which === 8 || event.which === 46){
        if(should_delete){
            should_delete = false;
            $(".carta").get().forEach(element => {$(element).remove()});

            animais_arr.forEach(carta => {$(".container").append(carta);});

            $(".carta .header label").get().forEach(c => {
                let aux = String($(c).html().toLowerCase()).split(" ");
                for (let i = 0; i < aux.length; i++) {aux[i] = aux[i].replace("<mark>", "").replace("</mark>", "");}
                let final = "";
                aux.forEach(p => {final += p + " ";});
                $(c).html(String(final).trim());
            });
        }
    }
});