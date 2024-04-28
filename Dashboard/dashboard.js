document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("themeButton").addEventListener("click", DarkTheme);
    console.log("aaaaaa")
    
    
});

window.onload=function(){
  $.post("https://LTW/DashboardData");


  window.addEventListener("message", function(event) {
    var flexitem1 = document.getElementById("fi1"); // Correzione del nome
    var flexitem2 = document.getElementById("fi2");
    var flexitem3 = document.getElementById("fi3");
    var flexitem4 = document.getElementById("fi4");
    
    flexitem1.querySelector(".quantity1").textContent = event.data.NDip;
    flexitem2.querySelector(".quantity2").textContent = event.data.NOrdini;
    flexitem3.querySelector(".quantity3").textContent = event.data.NPrenot;
    flexitem4.querySelector(".quantity4").textContent = event.data.Saldo;
  });
};

function DarkTheme() {
    var element = document.getElementById("container");
    element.classList.toggle("dark"); 
}





