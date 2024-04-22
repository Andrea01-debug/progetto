

window.onload=function(){

    document.getElementById('FormPrenotazione').addEventListener('submit', function(event){
        event.preventDefault();
        let Nome = $("#nome").val();
        let Numero = $("#numero").val();
        let Data = $("#data").val();
        let Ora = $("#time").val();
        
        $.post("https://../PrenotaTavolo", JSON.stringify({
            nome: Nome,
            numero: Numero,
            giorno: Data,
            ora: Ora
        }));
    });

}