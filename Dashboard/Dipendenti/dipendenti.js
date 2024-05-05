document.addEventListener('DOMContentLoaded', function () {
  /* document.getElementById("themeButton").addEventListener("click", DarkTheme);*/

  const expand_btn = document.querySelector(".expand-btn");
  let activeIndex;
  expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
  });
  
  const current = window.location.href;
  
  const allLinks = document.querySelectorAll(".sidebar-links a");
  
  allLinks.forEach((elem) => {
    elem.addEventListener("click", function () {
      const hrefLinkClick = elem.href;
  
      allLinks.forEach((link) => {
        if (link.href == hrefLinkClick) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  });



  const checkbox = document.querySelector('input[type="checkbox"]');

  checkbox.addEventListener('change', function() {
    SetDark()
  });
});
  
  
document.addEventListener('DOMContentLoaded', () => {
const DarkMode = localStorage.getItem('dark-mode')
  if(DarkMode == 1) {
    DarkTheme()
    SetSoleLuna()
  }
});
  
  
window.onload=function(){
    $.post("https://LTW/GetDipendenti");
  
}
  
  function SetDark() {
  if(localStorage.getItem('dark-mode') == 0) {
    localStorage.setItem('dark-mode', 1);
  } else {
    localStorage.setItem('dark-mode', 0);
  }
  DarkTheme();
}

function SetSoleLuna() {
  var element = document.getElementById("darkmode-toggle");
  element.checked = true;
}

function DarkTheme() {
  let element = document.getElementById("container");
  element.classList.toggle("dark"); 
  const prova = document.querySelectorAll(".flexitem");
  prova.forEach((elem) => {
    elem.classList.toggle("dark")
  });
  var barra = document.getElementById("Barra");
  barra.classList.toggle("dark")
  let element2 = document.getElementById("employeeList");
  element2.classList.toggle("dark");
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM LOADERD");
    const grade = localStorage.getItem('grade');
    if (grade) {

        updateContent(parseInt(grade));
    }
    
});

window.addEventListener("message", function(event) {
  if (event.data.type === "ui") {
    if (event.data.status == true) {
      $("#container").show()
    } else {
      $("#container").hide();
    }
  }
});
  
  
function filterEmployees() {
  const input = document.getElementById("searchBar");
  const filter = input.value.toLowerCase();
  const employeeList = document.getElementById("employeeList");
  const employees = employeeList.getElementsByClassName("flexitem");

  for (let i = 0; i < employees.length; i++) {
      const name = employees[i].getAttribute("data-name").toLowerCase();
      if (name.indexOf(filter) > -1) {
          employees[i].style.display = "flex"; // Mostra se corrisponde
      } else {
          employees[i].style.display = "none"; // Nascondi se non corrisponde
      }
  }
}
  
function promoteEmployee(nome) {
    console.log("Promuovi:", nome);
    Swal.fire({
      title: "Gestione Dipendente",
      html: `Vuoi davvero Promuovere <b>${nome}</b> ? `,
      icon: "info",
      confirmButtonText: "OK",
  });
  //TODO INCREMENTARE DI 1 IL GRADO DEL GIOCATORE CON QUELL'ID (GRADO + 1)
}
  
function unpromoteEmployee(nome) {
    console.log("Promuovi:", nome);
    Swal.fire({
      title: "Gestione Dipendente",
      html: `Vuoi davvero Retrocedere <b>${nome}</b> ? `,
      icon: "info",
      confirmButtonText: "OK",
  });
   //TODO DECREMENTARE DI 1 IL GRADO DEL GIOCATORE CON QUELL'ID (GRADO - 1)
}
  
function fireEmployee(nome) {
    console.log("Licenzia:", nome);
    Swal.fire({
      title: "Gestione Dipendente",
      html: `Vuoi davvero Licenziare <b>${nome}</b> ? `,
      icon: "info",
      confirmButtonText: "OK",
  });

  //TODO RIMUOVERE GRADO DEL GIOCATORE CON QUELL'ID (IMPOSTARE GRADO = 0)
}

function addEmployee() {
  Swal.fire({
      title: "Assumi Dipendente",
      html:`
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label for="employee-id" style="width: 30%;">ID:</label>
            <input type="text" id="employee-id" class="swal2-input" placeholder="Inserisci ID" style="flex-grow: 1;">
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label for="employee-user-id" style="width: 30%;">ID Utente:</label>
            <input type="text" id="employee-user-id" class="swal2-input" placeholder="Inserisci ID Utente" style="flex-grow: 1;">
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label for="employee-grade" style="width: 30%;">Grado:</label>
            <input type="text" id="employee-grade" class="swal2-input" placeholder="Inserisci Grado" style="flex-grow: 1;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Assumi",
      cancelButtonText: "Annulla",
      preConfirm: () => {
          const employeeId = document.getElementById("employee-id").value;
          const employeeUserId = document.getElementById("employee-user-id").value;
          const employeeGrade = document.getElementById("employee-grade").value;

          if (!employeeId || !employeeUserId || !employeeGrade) {
              Swal.showValidationMessage("Per favore, compila tutti i campi.");
              return false;
          }

          return { 
              id: employeeId,
              userId: employeeUserId,
              grade: employeeGrade,
          };
      }
  }).then((result) => {
      if (result.isConfirmed) {
          const data = result.value;
          console.log("Dipendente assunto:", data);

          //TODO DOMANI: invia dati al client e al server e salva su DB

      } else if (result.isDismissed) {
          console.log("Assunzione annullata.");
      }
  });
}
  
  window.addEventListener("message", function(event) {
    if (event.data.type === "GetDip") {
        const employeeList = event.data.employees;
        const listElement = document.getElementById("employeeList");
        listElement.innerHTML = '';

        // Crea gli elementi per ogni dipendente
        employeeList.forEach((employee) => {
            const employeeItem = document.createElement("div");
            employeeItem.className = "flexitem employee-item";
            employeeItem.setAttribute("data-name", `${employee.Nome} ${employee.Cognome}`);
            employeeItem.innerHTML = `
                <img src="profilo.jpg" alt="Foto Profilo" class="profile-pic">
                <div class="employee-info">
                    <h3>${employee.Nome} ${employee.Cognome}</h3>
                    <p>Grado: ${employee.Grado}</p>
                    <p>ID: ${employee.ID}</p>
                </div>
                <div class="employee-actions">
                    <button class="promote-btn" onclick="promoteEmployee('${employee.Nome} ${employee.Cognome}')">Promuovi</button>
                    <button class="unpromote-btn" onclick="unpromoteEmployee('${employee.Nome} ${employee.Cognome}')">Retrocedi</button>
                    <button class="fire-btn" onclick="fireEmployee('${employee.Nome} ${employee.Cognome}')">Licenzia</button>
                </div>
            `;
            listElement.appendChild(employeeItem);
        });
    }
});
  
  
  
  