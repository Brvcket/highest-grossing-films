document.addEventListener("DOMContentLoaded", function () {
    fetch("films.json")
        .then(response => response.json())
        .then(data => {
            window.filmsData = data;
            window.currentSort = { column: 3, ascending: false }; // Default: Box Office, Descending
            displayFilms(data);
            updateSortIndicator();
            sortTable(3, false); // Initial sorting by Box Office (Descending)
        });

    document.getElementById("search").addEventListener("input", function () {
        let query = this.value.toLowerCase();
        let filteredFilms = window.filmsData.filter(film =>
            film.title.toLowerCase().includes(query) || 
            film.directors.toLowerCase().includes(query)
        );
        displayFilms(filteredFilms);
        updateSortIndicator();
    });

    document.getElementById("toggle-theme").addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        this.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
});

function displayFilms(films) {
    let tableBody = document.getElementById("films-table");
    tableBody.innerHTML = "";
    films.forEach(film => {
        let firstDirector = film.directors.split(",")[0].trim(); // Only first director (requirement)
        let firstCountry = film.country.split(",")[0].trim();   // Only first country (requirement)
        let row = `<tr>
            <td>${film.title}</td>
            <td>${film.release_year}</td>
            <td>${firstDirector}</td>
            <td>$${film.box_office.toLocaleString()}</td>
            <td>${firstCountry}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}


function sortTable(columnIndex, toggle = true) {
    let table = document.querySelector("table tbody");
    let rows = Array.from(table.rows);
    
    if (toggle) {
        window.currentSort.ascending = window.currentSort.column === columnIndex ? !window.currentSort.ascending : true;
    } else {
        window.currentSort.ascending = false; // Default: Box Office Descending
    }
    window.currentSort.column = columnIndex;

    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText.trim();
        let cellB = rowB.cells[columnIndex].innerText.trim();

        if (columnIndex === 3) {
            cellA = parseFloat(cellA.replace(/[^0-9.]/g, "")) || 0;
            cellB = parseFloat(cellB.replace(/[^0-9.]/g, "")) || 0;
            return window.currentSort.ascending ? cellA - cellB : cellB - cellA;
        }

        if (columnIndex === 1) {
            cellA = parseInt(cellA, 10) || 0;
            cellB = parseInt(cellB, 10) || 0;
            return window.currentSort.ascending ? cellA - cellB : cellB - cellA;
        }
        return window.currentSort.ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    rows.forEach(row => table.appendChild(row));
    updateSortIndicator();
}

function updateSortIndicator() {
    document.querySelectorAll("th").forEach((th, index) => {
        if (index === window.currentSort.column) {
            th.innerHTML = th.innerText.replace(/ ▲| ▼/g, "") + (window.currentSort.ascending ? " ▲" : " ▼");
        } else {
            th.innerHTML = th.innerText.replace(/ ▲| ▼/g, "");
        }
    });
}
