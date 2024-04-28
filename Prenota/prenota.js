

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


    window.addEventListener("message", function(event) {
		if (event.data.type === "registrationError") {
			Swal.fire({
				icon: 'error',
				title: 'Errore',
				text: event.data.message,
				confirmButtonText: 'OK'
			});
		} else if (event.data.type === "closeRegisterWindow") {
			closeModalRegister();
		} else if (event.data.type === "invalidLogin"){
			Swal.fire({
				icon: 'error',
				title: 'Errore',
				text: event.data.message,
				confirmButtonText: 'OK'
			});
		} else if (event.data.type === "validLogin"){
			Swal.fire({
				icon: 'success',
				title: 'Successo',
				text: event.data.message,
				confirmButtonText: 'OK'
			});
		}else if (event.data.type === "closeLoginWindow") {
			closeModalLogin();
		}else if (event.data.type === "ui") {
			if (event.data.status == true) {
				$("#container").show()
			} else {
				$("#container").hide();
			}
		}else if (event.data.type === "loginUser"){
			loginUser();
		}else if (event.data.type === "loginWorker"){

		}else if (event.data.type === "loginAdmin"){

		}
	});

}