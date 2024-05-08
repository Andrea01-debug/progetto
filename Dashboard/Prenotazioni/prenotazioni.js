function AggiornaCoordinate() {
    // Otteniamo l'elemento immagine
    var img = document.getElementById('mappaImg');
    console.log("Test")
    

    var scaleX = img.width / Gazella;
    var scaleY = img.height / Zebra;
    Gazella = img.width
    Zebra = img.height

    // Aggiorniamo le coordinate delle aree in base ai fattori di scala
    var area1 = document.getElementById('Tavolo1');
    var area2 = document.getElementById('Tavolo2');
    var area3 = document.getElementById('Tavolo3');
    var area4 = document.getElementById('Tavolo4');
    var area5 = document.getElementById('Tavolo5');
    var area6 = document.getElementById('Tavolo6');
    var area7 = document.getElementById('Tavolo7');
    var area8 = document.getElementById('Tavolo8');
    var area9 = document.getElementById('Tavolo9');
    var area10 = document.getElementById('Tavolo10');
    var area11 = document.getElementById('Tavolo11');
    var area12 = document.getElementById('Tavolo12');
    var area13 = document.getElementById('Tavolo13');
    var area14 = document.getElementById('Tavolo14');
    area1.coords = Math.round(area1.coords.split(",")[0] * scaleX) + "," + Math.round(area1.coords.split(",")[1] * scaleY) + "," + Math.round(area1.coords.split(",")[2] * scaleX) + "," + Math.round(area1.coords.split(",")[3] * scaleY);
    area2.coords = Math.round(area2.coords.split(",")[0] * scaleX) + "," + Math.round(area2.coords.split(",")[1] * scaleY) + "," + Math.round(area2.coords.split(",")[2] * scaleX) + "," + Math.round(area2.coords.split(",")[3] * scaleY);
    area3.coords = Math.round(area3.coords.split(",")[0] * scaleX) + "," + Math.round(area3.coords.split(",")[1] * scaleY) + "," + Math.round(area3.coords.split(",")[2] * scaleX) + "," + Math.round(area3.coords.split(",")[3] * scaleY);
    area4.coords = Math.round(area4.coords.split(",")[0] * scaleX) + "," + Math.round(area4.coords.split(",")[1] * scaleY) + "," + Math.round(area4.coords.split(",")[2] * scaleX) + "," + Math.round(area4.coords.split(",")[3] * scaleY);
    area5.coords = Math.round(area5.coords.split(",")[0] * scaleX) + "," + Math.round(area5.coords.split(",")[1] * scaleY) + "," + Math.round(area5.coords.split(",")[2] * scaleX) + "," + Math.round(area5.coords.split(",")[3] * scaleY);
    area6.coords = Math.round(area6.coords.split(",")[0] * scaleX) + "," + Math.round(area6.coords.split(",")[1] * scaleY) + "," + Math.round(area6.coords.split(",")[2] * scaleX) + "," + Math.round(area6.coords.split(",")[3] * scaleY);
    area7.coords = Math.round(area7.coords.split(",")[0] * scaleX) + "," + Math.round(area7.coords.split(",")[1] * scaleY) + "," + Math.round(area7.coords.split(",")[2] * scaleX) + "," + Math.round(area7.coords.split(",")[3] * scaleY);
    area8.coords = Math.round(area8.coords.split(",")[0] * scaleX) + "," + Math.round(area8.coords.split(",")[1] * scaleY) + "," + Math.round(area8.coords.split(",")[2] * scaleX) + "," + Math.round(area8.coords.split(",")[3] * scaleY);
    area9.coords = Math.round(area9.coords.split(",")[0] * scaleX) + "," + Math.round(area9.coords.split(",")[1] * scaleY) + "," + Math.round(area9.coords.split(",")[2] * scaleX) + "," + Math.round(area9.coords.split(",")[3] * scaleY);
    area10.coords = Math.round(area10.coords.split(",")[0] * scaleX) + "," + Math.round(area10.coords.split(",")[1] * scaleY) + "," + Math.round(area10.coords.split(",")[2] * scaleX) + "," + Math.round(area10.coords.split(",")[3] * scaleY);
    area11.coords = Math.round(area11.coords.split(",")[0] * scaleX) + "," + Math.round(area11.coords.split(",")[1] * scaleY) + "," + Math.round(area11.coords.split(",")[2] * scaleX) + "," + Math.round(area11.coords.split(",")[3] * scaleY);
    area12.coords = Math.round(area12.coords.split(",")[0] * scaleX) + "," + Math.round(area12.coords.split(",")[1] * scaleY) + "," + Math.round(area12.coords.split(",")[2] * scaleX) + "," + Math.round(area12.coords.split(",")[3] * scaleY);
    area13.coords = Math.round(area13.coords.split(",")[0] * scaleX) + "," + Math.round(area13.coords.split(",")[1] * scaleY) + "," + Math.round(area13.coords.split(",")[2] * scaleX) + "," + Math.round(area13.coords.split(",")[3] * scaleY);
    area14.coords = Math.round(area14.coords.split(",")[0] * scaleX) + "," + Math.round(area14.coords.split(",")[1] * scaleY) + "," + Math.round(area14.coords.split(",")[2] * scaleX) + "," + Math.round(area14.coords.split(",")[3] * scaleY);
}

// Aggiorna le coordinate quando l'immagine viene caricata
window.onload = function(){
    Gazella = document.getElementById('mappaImg').naturalWidth
    Zebra = document.getElementById('mappaImg').naturalHeight
    AggiornaCoordinate();
}
// Aggiorna le coordinate quando la finestra viene ridimensionata
window.onresize = AggiornaCoordinate;

document.addEventListener('DOMContentLoaded', function () {
  console.log("DOM CARICATO Ordini");
  const grade = localStorage.getItem('grade');
  if (grade == 2) {
      document.getElementById("gestioneDipendenti").style.display = "block";
  
      console.log("grado 2!!!!!!!!!!!!!!")
  } else {
      console.log("grado Pinguino")
  }
});