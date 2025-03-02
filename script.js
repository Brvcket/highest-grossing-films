document.addEventListener("DOMContentLoaded", function () {
    fetch("films.json")
        .then(response => response.json())
        .then(data => {
            window.filmsData = data;
            displayFilms(data);
        });

    document.getElementById("search").addEventListener("input", function () {
        let query = this.value.toLowerCase();
        let filteredFilms = window.filmsData.filter(film =>
            film.title.toLowerCase().includes(query) ||
            film.directors.toLowerCase().includes(query)
        );
        displayFilms(filteredFilms);
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

function sortTable(columnIndex) {
    let table = document.querySelector("table tbody");
    let rows = Array.from(table.rows);
    let header = document.querySelectorAll("th span")[columnIndex];

    let ascending = !header.dataset.order || header.dataset.order === "desc";
    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText;
        let cellB = rowB.cells[columnIndex].innerText;

        return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    header.dataset.order = ascending ? "asc" : "desc";
    header.innerHTML = ascending ? "▲" : "▼";

    // drop arrows for other columns
    document.querySelectorAll("th span").forEach((span, index) => {
        if (index !== columnIndex) {
            span.innerHTML = "";
            span.dataset.order = "";
        }
    });

    rows.forEach(row => table.appendChild(row));
}
