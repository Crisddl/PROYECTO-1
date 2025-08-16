initSqlJs({
  locateFile: file => `../js/${file}`
}).then(SQL => {
  fetch("../db/alamedas.db")
    .then(res => res.arrayBuffer())
    .then(buffer => {
      const db = new SQL.Database(new Uint8Array(buffer));

      const form = document.getElementById("form-fechas");
      const resultados = document.getElementById("resultados");

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const desde = document.getElementById("desde").value;
        const hasta = document.getElementById("hasta").value;

        // Validación de rango de fechas
        if (desde > hasta) {
          alert("La fecha 'desde' no puede ser mayor que la fecha 'hasta'.");
          return;
        }

        const query = `
          SELECT Fecha, Titulo, Descripcion
          FROM Calendario
          WHERE Fecha BETWEEN '${desde}' AND '${hasta}'
          ORDER BY Fecha ASC
        `;

        try {
          const result = db.exec(query);

          resultados.innerHTML = "";

          if (result.length > 0) {
            const values = result[0].values;
            values.forEach(([fecha, titulo, descripcion]) => {
              const li = document.createElement("li");
              li.innerHTML = `<strong>${fecha}:</strong> ${titulo} - ${descripcion}`;
              resultados.appendChild(li);
            });
          } else {
            resultados.innerHTML = "<li>No se encontraron actividades en ese rango.</li>";
          }
        } catch (err) {
          console.error("Error en la consulta:", err);
          alert("Hubo un error al realizar la consulta.");
        }
      });
    });
});
