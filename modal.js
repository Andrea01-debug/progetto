function openModalLogin() {
    document.getElementById("myModalLogin").style.display = "block";
}

function closeModalLogin() {
    document.getElementById("myModalLogin").style.display = "none";
}

function openModalRegister() {
    document.getElementById("ModalRegister").style.display = "block";
}

function closeModalRegister() {
    document.getElementById("ModalRegister").style.display = "none";
}

function openModalFgPsw() {
    document.getElementById("ModalFgPsw").style.display = "block";
}

function closeModalFgPsw() {
    document.getElementById("ModalFgPsw").style.display = "none";
}


window.onload=function(){
	document.getElementById('registerForm').addEventListener('submit', function(e){
		console.log("We")
		e.preventDefault();
		let Nome = $("#nome").val();
		let Cognome = $("#cognome").val();
		let Data = $("#data").val();
		let Username = $("#usernamelog").val();
		let Password = $("#passwordlog").val();
		let Domanda = $("#domanda").val();
		let Risposta = $("#risposta").val();
		console.log(Nome)

		$.post("https://LTW/RegistraUtente", JSON.stringify({
			nome: Nome,
			cognome: Cognome,
			data: Data,
			username: Username,
			password: Password,
			domanda : Domanda,
			risposta : Risposta,
		}));
		//closeModalRegister();  // messo qui per chiudere il register SOLO se sono stati riempiti tutti i campi
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
		}else if (event.data.type === "closeLoginWindow") {
			closeModalLogin();
		}
	});


	document.getElementById('loginForm').addEventListener('submit', function(event){
		event.preventDefault();/* 
		let Nome = $("#nome").val();
		let Cognome = $("#cognome").val();
		let Data = $("#data").val(); */
		let Username = $("#username").val();
		let Password = $("#password").val();

		$.post("https://LTW/LoginUtente", JSON.stringify({
			/* nome: Nome,
			cognome: Cognome,
			data: Data, */
			username: Username,
			password: Password
		}));
		//closeModalLogin();  // messo qui per chiudere il login SOLO se sono stati riempiti tutti i campi
	});
	
	document.getElementById('FgPswForm').addEventListener('submit', function(event){
		event.preventDefault(); 
		let Username = $("#usernamepsw").val();
		let Data = $("#datapsw").val();
		let Domanda = $("#domandapsw").val();
		let Risposta = $("#rispostapsw").val();
		let Password = $("#passwordfgpsw").val();

		$.post("https://LTW/ResetPswUtente", JSON.stringify({
			username: Username,
			data: Data,
			domanda: Domanda,
			risposta: Risposta,
			password: Password
		}));
	});
}





$(function () {
    function display(bool) {
        if (bool) {
            $("#container").show();
        } else {
            $("#container").hide();
        }
    }

    display(false)

    window.addEventListener('message', function(event) {
		var item = event.data;
        if (item.type === "ui") {
            if (item.status == true) {
                display(true)
            } else {
                display(false)
            }
        }
    })
})

document.onkeyup = function (data) {
	if (data.which == 27) {
		$.post('https://LTW/exit', JSON.stringify({}));
		return
	}
};

function toggleRisposta() {
    var select = document.getElementById('domanda');
    var rispostaDiv = document.getElementById('risposta-div');

    if (select.value === "") {
        rispostaDiv.style.display = "none"; // Nasconde il campo Risposta
    } else {
        rispostaDiv.style.display = "block"; // Mostra il campo Risposta
    }
}