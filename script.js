document.addEventListener("DOMContentLoaded", function () {
    fetch("films.json")
        .then(response => response.json())
        .then(data => {
            window.filmsData = data;
            window.currentSort = {column: 3, ascending: false}; 
            displayFilms(data);
            updateSortIndicator();
            sortTable(3, false); 
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
    });
});

function displayFilms(films) {
    let tableBody = document.getElementById("films-table");
    tableBody.innerHTML = "";
    films.forEach(film => {
        let row = `<tr>
            <td>${film.title}</td>
            <td>${film.release_year}</td>
            <td>${film.directors}</td>
            <td>$${film.box_office.toLocaleString()}</td>
            <td>${film.country}</td>
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
        let cellA = rowA.cells[columnIndex].innerText;
        let cellB = rowB.cells[columnIndex].innerText;

        if (columnIndex === 3) {
            cellA = parseFloat(cellA.replace(/[^0-9.]/g, "")) || 0;
            cellB = parseFloat(cellB.replace(/[^0-9.]/g, "")) || 0;
        }

        return window.currentSort.ascending ? cellA - cellB : cellB - cellA;
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
