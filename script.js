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
            film.title.toLowerCase().includes(query)
        );
        displayFilms(filteredFilms);
    });
});

function displayFilms(films) {
    let tableBody = document.getElementById("films-table");
    tableBody.innerHTML = "";
    films.forEach(film => {
        let row = `<tr>
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.director}</td>
            <td>$${film.box_office.toLocaleString()}</td>
            <td>${film.country}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function sortTable(columnIndex) {
    let table = document.querySelector("table tbody");
    let rows = Array.from(table.rows);
    let ascending = table.dataset.order !== "asc";

    rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText;
        let cellB = rowB.cells[columnIndex].innerText;

        return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    table.dataset.order = ascending ? "asc" : "desc";
    rows.forEach(row => table.appendChild(row));
}
