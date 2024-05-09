function AggiornaCoordinate() {
    var img = document.getElementById('mappaImg');    

    var scaleX = img.width / Gazella;
    var scaleY = img.height / Zebra;
    Gazella = img.width
    Zebra = img.height /* non riesco a ridimensionare bene, non so perchè non è più come prima */

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
})

function caricaPrenotazioni() {
    var giorno = document.getElementById("date-input").value
    console.log(giorno)
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
                </tr>`;
                tbody.append(row)
            });
        }
    });
}