

window.onload=function(){

    document.getElementById('FormPrenotazione').addEventListener('submit', function(event){
        event.preventDefault();
        let Nome = $("#nomepren").val();
        let Numero = $("#numeropren").val();
        let Data = $("#datapren").val();
        let Ora = $("#timepren").val();
        
        $.post("https://LTW/PrenotaTavolo", JSON.stringify({
            nome: Nome,
            numero: Numero,
            giorno: Data,
            ora: Ora
        }));
    });

}