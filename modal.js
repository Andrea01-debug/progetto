function updateContent(grade) {    
    if (grade === 0) {
        console.log("grado 0");
		document.getElementById("Accedi").style.display = "none";
    	document.getElementById("Profilo").style.display = "block";
    } else if (grade === 1) {
        console.log("grado 1")
    } else if (grade === 3) {
        console.log("grado 2")
    } else {
        console.log("grado boh")
    }
}


// Ascolta i messaggi NUI dal client Lua
window.addEventListener('message', function(event) {
    if (event.data.type === "setUserGrade") {
        const grade = event.data.grade;
        
        // Memorizza l'ID nel localStorage
        localStorage.setItem('grade', grade);

        // Aggiorna il contenuto in base all'ID
        updateContent(grade);
    }
});

// All'avvio della pagina, usa l'ID memorizzato per aggiornare il contenuto
document.addEventListener('DOMContentLoaded', () => {
	console.log("DOM LOADERD");
    const grade = localStorage.getItem('grade');
    if (grade) {
        // Se c'è un ID salvato, aggiorna il contenuto

        updateContent(parseInt(grade)); // Il grado potrebbe essere sconosciuto al riavvio
		//localStorage.clear();
    }
});

function openLogout() {
	console.log("ESCIIIIIIIIIIII")
    // Invia un messaggio al client Lua per indicare il logout
    $.post("https://LTW/LogoutUser", JSON.stringify({}));
    
    // Rimuove l'utente dal localStorage
    localStorage.removeItem('grade'); // O qualunque sia la chiave usata per memorizzare i dati dell'utente
    console.log("Utente disconnesso e localStorage cancellato.");
    
    // Aggiorna il contenuto della pagina per riflettere il logout
    document.getElementById("Accedi").style.display = "block";
    document.getElementById("Profilo").style.display = "none";
    document.getElementById("MenuATendina").style.display = "none";
}


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

function loginUser() {
    document.getElementById("Accedi").style.display = "none";
    document.getElementById("Profilo").style.display = "block";
}

function toggleProfiloTendina() {
	var temp = document.getElementById("MenuATendina")
	if(temp.style.display === "block") {
		temp.style.display = "none";
	} else {
		temp.style.display = "block";
	}
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


	document.getElementById('loginForm').addEventListener('submit', function(event){
		event.preventDefault();
		let Username = $("#username").val();
		let Password = $("#password").val();

		$.post("https://LTW/LoginUtente", JSON.stringify({
			username: Username,
			password: Password
		}));
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
        rispostaDiv.style.display = "none"; // Nasconde il campo Risposta sichè non si sceglie la domanda di sicurezza
    } else {
        rispostaDiv.style.display = "block"; // Mostra il campo Risposta
    }
}

// Bottone per tornare in cima



document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("container");
    const scrollBtn = document.getElementById("scrollBtn");

    container.addEventListener("scroll", function() {
        if (container.scrollTop > 50) { // Il valore soglia può variare
            scrollBtn.style.display = "block"; // Mostra il pulsante
        } else {
            scrollBtn.style.display = "none"; // Nascondi il pulsante
        }
    });

    // Funzione per scorrere in cima al container
    scrollBtn.addEventListener("click", function() {
        container.scrollTop = 0;
    });
});
