/* function AggiornaCoordinate() {
    var img = document.getElementById('mappaImg');    

    var scaleX = img.width / Gazella;
    var scaleY = img.height / Zebra;
    Gazella = img.width
    Zebra = img.height 

    var aree = document.querySelectorAll("map[name='tavoli'] area");

    aree.forEach(area => {
        var coords = area.getAttribute("coords").split(",").map(Number);

        var scaledCoords = coords.map((val, index) => {
            return (index % 2 === 0) ? Math.round(val * scaleX) : Math.round(val * scaleY);
        });

        area.setAttribute("coords", scaledCoords.join(","));
    });

    // Maphilight bello
    $('#mappaImg').maphilight({
        fill: true,
        fillColor: 'ff0000',
        fillOpacity: 0.5,
        stroke: false,
        alwaysOn: true,
    });
}

// Aggiornamento coordinate quando l'immagine viene caricata e quando la finestra viene ridimensionata
window.onload = function() {
    Gazella = document.getElementById('mappaImg').naturalWidth
    Zebra = document.getElementById('mappaImg').naturalHeight
    AggiornaCoordinate();
    
};

window.onresize = function() {
    AggiornaCoordinate();
    
}; */

function AggiornaCoordinate() {
    var img = document.getElementById('mappaImg');

    var scaleX = img.width / Gazella;
    var scaleY = img.height / Zebra;

    const aree = document.querySelectorAll('.area');

    aree.forEach(area => {
        const originalLeft = parseInt(area.getAttribute('data-original-left'));
        const originalTop = parseInt(area.getAttribute('data-original-top'));
        const originalWidth = parseInt(area.getAttribute('data-original-width'));
        const originalHeight = parseInt(area.getAttribute('data-original-height'));

        area.style.left = `${Math.round(originalLeft * scaleX)}px`;
        area.style.top = `${Math.round(originalTop * scaleY)}px`;
        area.style.width = `${Math.round(originalWidth * scaleX)}px`;
        area.style.height = `${Math.round(originalHeight * scaleY)}px`;
    });
}



window.onload = function() {
    const aree = document.querySelectorAll('.area');
    aree.forEach(area => {
        area.setAttribute('data-original-left', area.style.left);
        area.setAttribute('data-original-top', area.style.top);
        area.setAttribute('data-original-width', area.style.width);
        area.setAttribute('data-original-height', area.style.height);

        area.addEventListener('click', function() {
            // Azione da eseguire quando si fa clic su un'area
            console.log(`Hai cliccato sull'area: ${this.id}`);
            if (area.classList.contains("rosso")) {
                openModalTable1();
            } else {
                openModalTable2();
                console.log("aaa");
            }
        });
    });

    Gazella = document.getElementById('mappaImg').naturalWidth;
    Zebra = document.getElementById('mappaImg').naturalHeight;

    AggiornaCoordinate();

    // set campi data e ora av vio pagina
    const now = new Date();

    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    
    const timeString = `${hours}:${minutes}`;

    
    document.getElementById('time').value = timeString;

    document.getElementById('date-input').valueAsDate = now; 
};

window.onresize = function() {
    AggiornaCoordinate();
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM CARICATO Ordini");
    const grade = localStorage.getItem('grade');
    if (grade == 2) {
        document.getElementById("gestioneDipendenti").style.display = "block";
    } else {
        console.log("grado Impossibile")
    }

});

$(document).ready(function() {
    caricaPrenotazioni();
    aggiornaMappa();
})

function caricaPrenotazioni() {
    var giorno = document.getElementById("date-input").value
    //console.log(giorno)
    function loadReservations() {
        $.post('https://LTW/GetPrenotazioniServer', JSON.stringify({ valore: giorno })); 
    }

    loadReservations();

    window.addEventListener("message", function(event) {
        if (event.data.type === 'SendPrenotazioniClient') {
            const prenot = event.data.data;
            const tbody = $("#tabellaPrenotazioni tbody");
            tbody.empty();

            prenot.forEach(prenotato => {
                const row = `<tr>
                    <td>${prenotato.Nome}</td>
                    <td>${prenotato.Tavolo}</td>
                    <td>${prenotato.Numero}</td>
                    <td>${prenotato.Ora}</td>
                    <td class="td">
                        <button class="rimuoviTavolo" onclick="rimuoviTavolo('${prenotato.Nome}', ${prenotato.Tavolo}, ${prenotato.Numero}, '${prenotato.Ora}', '${prenotato.Data}')">Rimuovi</button>
                    </td>
                </tr>`;
                tbody.append(row)
            });
        }
    });
}

window.rimuoviTavolo = function(Nome, Tavolo, Numero, Ora, Data) {
    console.log("dfgdtythftyhjyf")
    $.post('https://LTW/RimuoviTavoloPrenotato', JSON.stringify({ 
        Nome: Nome,
        Tavolo: Tavolo,
        Numero: Numero,
        Ora: Ora,
        Data: Data, 

    }), function() { 
        
        aggiornaMappa();
        caricaPrenotazioni();
        setTimeout(() => {
            window.location.reload();
        }, 5);
    });
};



function aggiornaMappa() {
    var giorno = document.getElementById("date-input").value;
    var ora = document.getElementById("time").value;

    console.log(giorno);
    console.log(ora);

    
    $.post('https://LTW/AggiornaMappa', JSON.stringify({ giorno: giorno, ora: ora }));

    
    window.addEventListener("message", function(event) {
        if (event.data.type === 'AggiornaMappaDalClient') {
            const colora = event.data.data;

            // ogni volta tutti i tavoli vengono prima impostati su verde
            const aree = document.querySelectorAll('.area');
            aree.forEach(area => {
                area.classList.remove('rosso');
            });

            // Colora di rosso i tavoli prenotati in base agli ID ricevuti che corrispondono al numero di tavoli sul server
            colora.forEach(tavolo => {
                const tavoloElement = document.getElementById(tavolo.Tavolo);
                if (tavoloElement) {
                    tavoloElement.classList.add('rosso');
                }
            });
        }
    });
}



// Finestre Modali Tavoli


function openModalTable1() {
    document.getElementById("ModaleTavoli1").style.display = "block";
}

function closeModalTable1() {
    document.getElementById("ModaleTavoli1").style.display = "none";
}

function openModalTable2() {
    document.getElementById("ModaleTavoli2").style.display = "block";
}

function closeModalTable2() {
    document.getElementById("ModaleTavoli2").style.display = "none";
}
