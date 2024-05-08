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