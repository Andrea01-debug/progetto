function openModal() {
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function SetNavigatore() {
    
}



document.getElementById('modal-toggle').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'block'; // Mostra il modal quando il link viene cliccato
});

document.querySelector('.modal-overlay').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none'; // Nascondi il modal quando l'overlay viene cliccato
});
