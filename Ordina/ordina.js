$(document).ready(function() {
    $(".add").click(function() {
        var flexitem = $(this).closest('.flexitem');
        var itemName = flexitem.find('.Oggetto').text(); // Ottieni il nome dell'oggetto dalla classe
        var priceElement = flexitem.find('.Prezzo');
        var price = parseFloat(priceElement.text());
        var prezzo = 0;
        prezzo = (prezzo + price).toFixed(2);
        priceElement.text(price);
        var quantityElement = flexitem.find(".quantity");
        var quantity = parseInt(quantityElement.text());
        quantity++;
        quantityElement.text(quantity);
        console.log(quantity);
        updateRiepilogo(itemName, quantity, prezzo);
    });

    $(".sub").click(function() {
        var flexitem = $(this).closest('.flexitem');
        var itemName = flexitem.find('.Oggetto').text(); // Ottieni il nome dell'oggetto dalla classe
        var priceElement = flexitem.find('.Prezzo');
        var price = parseFloat(priceElement.text());
        priceElement.text(price);
        var quantityElement = flexitem.find(".quantity");
        var quantity = parseInt(quantityElement.text());
        if (quantity > 0) {
            quantity--;
            quantityElement.text(quantity);
            var prezzo = 0;
            prezzo = (prezzo + price).toFixed(2);
            
            console.log(quantity);
            updateRiepilogo(itemName, quantity, prezzo);
        }
    });
});

function updateRiepilogo(itemName, quantity, price) {
    var riepilogoList = $("#riepilogoLista");
    var listItem = riepilogoList.find("li[data-item='" + itemName + "']");

    if (quantity === 0) {
        listItem.remove();
    } else {
        var newItem = "<li data-item='" + itemName + "'>" + quantity + " x " + itemName + " $"+ price + "</li>";

        if (listItem.length === 0) {
            riepilogoList.append(newItem);
        } else {
            var newPrice = (quantity * price).toFixed(2);
            newItem = "<li data-item='" + itemName + "'>" + quantity + " x "  + itemName + " $"+ newPrice + "</li>";
            listItem.replaceWith(newItem);
        }
    }
    var total = calculateTotal();
    $("#ChkoutBtn").text("Ordina: totale $" + total);
}

function calculateTotal() {
    var total = 0;
    $("#riepilogoLista li").each(function() {
        // Estrai il prezzo dal testo della lista
        var listItemText = $(this).text();
        var match = listItemText.match(/\$(\d+\.\d+)/); // Estrai il prezzo dalla stringa
        if (match) {
            var itemPrice = parseFloat(match[1]);
            total += itemPrice;
        }
    });
    return total.toFixed(2);
}

function totalButton() {
    var total = calculateTotal();
    Swal.fire({
        title: "Totale",
        text: "Il totale dell'ordine è $" + total,
        icon: "info",
        confirmButtonText: "OK"
    });
    console.log("ok")
}
