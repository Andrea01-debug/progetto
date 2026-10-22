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


$(document).ready(function() {
    // Ordini attualmente mostrati, indicizzati per ID, per aggiornare le singole righe
    const ordersById = new Map();

    // Carica gli ordini dal server
    loadOrders();

    function loadOrders() {
        $.post('https://LTW/GetOrdiniServer');
    }

    function getStatusTextAndClass(accettato) {
        switch (accettato) {
            case 0:
                return { text: "In attesa", class: "red" };
            case 1:
                return { text: "In lavorazione", class: "yellow" };
            case 2:
                return { text: "Pronto per il ritiro", class: "green" };
            default:
                return { text: "Sconosciuto", class: "grey" };
        }
    }

    function buildRow(order) {
        const statusInfo = getStatusTextAndClass(order.Accettato);
        const payed = order.Pagato == 1 ? "Si" : "No";

        return `<tr data-id="${order.ID}">
            <td>${order.CodPren}</td>
            <td>${order.Ordine}</td>
            <td>${parseFloat(order.Totale)}</td>
            <td>${payed}</td>
            <td class="${statusInfo.class}">${statusInfo.text}</td>
            <td class="td">
                <button class="avviaLavorazione" onclick="avviaLavorazione(${order.ID})">Lavora</button>
                <button class="prontoRitiro" onclick="prontoRitiro(${order.ID})">Pronto</button>

            </td>
            <td> <button class="delete-button" onclick="eliminaOrdine(${order.ID})">
            <i class="fas fa-trash-alt"></i>
            </button></td>
        </tr>`;
    }

    // Sostituisce solo la riga dell'ordine modificato
    function updateRow(orderId, accettato) {
        const order = ordersById.get(orderId);
        if (!order) return;
        order.Accettato = accettato;
        $(`#ordineTable tbody tr[data-id="${orderId}"]`).replaceWith(buildRow(order));
    }

    window.addEventListener("message", function(event) {
        if (event.data.type === 'SendOrdiniClient') {
            const orders = event.data.data;

            ordersById.clear();
            orders.forEach(order => ordersById.set(order.ID, order));

            // Una sola scrittura nel DOM per tutta la tabella
            $("#ordineTable tbody").html(orders.map(buildRow).join(''));
        }
    });


    window.avviaLavorazione = function(orderId) {
        $.post('https://LTW/AccettaOrdine', JSON.stringify({ id: orderId }), function() { // l'ordine passa allo stato 1 su DB "In Lavorazione"
            updateRow(orderId, 1);
        });
    };


    window.prontoRitiro = function(orderId) {
        $.post('https://LTW/RitiraOrdine', JSON.stringify({ id: orderId }), function() { // l'ordine passa allo stato 2 su DB "Pronto per il ritiro"
            updateRow(orderId, 2);
        });
    };


    window.eliminaOrdine = function(orderId) {
        $.post('https://LTW/EliminaOrdine', JSON.stringify({ id: orderId }), function() { // l'ordine vieen rimosso da DB
            ordersById.delete(orderId);
            $(`#ordineTable tbody tr[data-id="${orderId}"]`).remove();
        });
    };

    // Ordinamento tabella: ascendente, oppure discendente se la colonna è già ordinata in modo ascendente
    window.sortTable = function(columnIndex) {
        const tbody = document.querySelector("#ordineTable tbody");
        const rows = Array.from(tbody.rows);
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        const cellText = row => row.cells[columnIndex].textContent.trim();
        const ascending = (a, b) => collator.compare(cellText(a), cellText(b));

        const alreadyAscending = rows.every((row, i) => i === 0 || ascending(rows[i - 1], row) <= 0);
        rows.sort(alreadyAscending ? (a, b) => ascending(b, a) : ascending);

        // Reinserimento in un'unica operazione
        const fragment = document.createDocumentFragment();
        rows.forEach(row => fragment.appendChild(row));
        tbody.appendChild(fragment);
    };
});
