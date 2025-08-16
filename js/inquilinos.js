document.addEventListener("DOMContentLoaded", async () => {
  const SQL = await initSqlJs({ locateFile: file => `../js/${file}` });

  const dbRequest = await fetch("../db/alamedas.db");
  const buffer = await dbRequest.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));

  // Consulta si está al día
  document.getElementById("form-consulta").addEventListener("submit", function (e) {
    e.preventDefault();

    const dpi = document.getElementById("dpi").value.trim();
    const casa = document.getElementById("numeroCasa").value.trim();
    const nombre = document.getElementById("nombre").value.trim().toLowerCase();
    const apellido = document.getElementById("apellido").value.trim().toLowerCase();
    const fechaNac = document.getElementById("fechaNacimiento").value;

    const resultado = document.getElementById("resultado-estado");
    resultado.innerHTML = "";

    // Validar existencia del inquilino
    const validacion = db.exec(`
      SELECT * FROM Inquilino 
      WHERE dpi='${dpi}' 
      AND numero_casa='${casa}' 
      AND LOWER(primer_nombre)='${nombre}' 
      AND LOWER(primer_apellido)='${apellido}' 
      AND fecha_nacimiento='${fechaNac}'
    `);

    if (validacion.length === 0) {
      resultado.textContent = "Inquilino no encontrado. Verifique los datos.";
      return;
    }

    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const año = hoy.getFullYear();

    const estadoPago = db.exec(`
      SELECT * FROM PagoDeCuotas 
      WHERE numero_casa='${casa}' 
      AND mes=${mes} 
      AND año=${año}
    `);

    if (estadoPago.length > 0) {
      resultado.textContent = "Cuota de mantenimiento al día.";
    } else {
      resultado.textContent = "Cuota de mantenimiento pendiente.";
    }
  });

  // Historial de pagos
   document.getElementById("btnHistorial").addEventListener("click", () => {
    const casa = document.getElementById("numeroCasa").value.trim();
    const resultadoHistorial = document.getElementById("resultado-historial");
    resultadoHistorial.innerHTML = "";

    if (!casa) {
      resultadoHistorial.textContent = "Ingrese el número de casa.";
      return;
    }

    const historial = db.exec(`
      SELECT * FROM PagoDeCuotas 
      WHERE numero_casa='${casa}'
      ORDER BY año DESC, mes DESC
    `);

    if (historial.length === 0) {
      resultadoHistorial.textContent = "No hay pagos registrados.";
    } else {
      const lista = document.createElement("ul");
      historial[0].values.forEach(r => {
        const item = document.createElement("li");
        item.textContent = `Año: ${r[2]} / casa: ${r[1]} / Pagado el mes: ${r[3]}`;
        lista.appendChild(item);
      });
      resultadoHistorial.appendChild(lista);
    }
  });
});
