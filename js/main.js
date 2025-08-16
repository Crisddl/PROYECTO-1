initSqlJs({
  locateFile: (file) => `js/${file}`
}).then(SQL => {
  fetch("../db/alamedas.db")
    .then((res) => res.arrayBuffer())
    .then((buffer) => {
      const db = new SQL.Database(new Uint8Array(buffer));
      const result = db.exec("SELECT fecha, noticia FROM Noticias ORDER BY fecha DESC LIMIT 3");

      const ul = document.getElementById("lista-noticias");

      if (result.length > 0) {
        const values = result[0].values;
        values.forEach(([fecha, noticia]) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${fecha}:</strong> ${noticia}`;
          ul.appendChild(li);
        });
      } else {
        ul.innerHTML = "<li>No hay noticias disponibles</li>";
      }
    });
});
