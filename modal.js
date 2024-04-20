function openModalLogin() {
    document.getElementById("myModalLogin").style.display = "block";
}

function closeModalLogin() {
    document.getElementById("myModalLogin").style.display = "none";
}

function openModalRegister() {
    document.getElementById("ModalRegister").style.display = "block";
    console.log("Ciao")
}

function closeModalRegister() {
    document.getElementById("ModalRegister").style.display = "none";
}

window.onload=function(){
    document.getElementById("registerForm").addEventListener("submit", function(e) {
        console.log("We")
        e.preventDefault();
        let Nome = $("#nome").val();
        let Cognome = $("#cognome").val();
        let Data = $("#data").val();
        let Username = $("#username").val();
        let Password = $("#password").val();
        console.log(Nome)

        fetch("https://LTW/RegistraUtente", {
            method: "POST",
            body: JSON.stringify({
                nome: Nome,
                cognome: Cognome,
                data: Data,
                username: Username,
                password: Password
            }),
        })

        $.post("https://LTW/RegistraUtente", JSON.stringify({
            nome: Nome,
            cognome: Cognome,
            data: Data,
            username: Username,
            password: Password
        }));
    })
  }
