// ================= CONFIGURACIÓN GENERAL =================
const CONFIG = {
  // ID de la carpeta principal donde se crearán los libros
  ID_CARPETA_DESTINO: "id_carpeta_drive"
};

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Registro de Asistencia - Practicantes')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function obtenerPracticantesActivos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaBD = ss.getSheetByName("practicantes"); 
  if (!hojaBD) return [];

  const datos = hojaBD.getDataRange().getValues();
  let practicantes = [];

  for (let i = 1; i < datos.length; i++) {
    // Verifica Columna F (índice 5): ACTIVO[cite: 16]
    if (datos[i][5] == 1) { 
      // Columna B (índice 1): NOMBRES | Columna E (índice 4): HORAS[cite: 16]
      practicantes.push({ fila: i + 1, nombre: datos[i][1], horas: datos[i][4] || 0 });
    }
  }
  return practicantes;
}

function registrarAsistencia(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hojaPracticantes = ss.getSheetByName("practicantes");

    // 1. CÁLCULO DE HORAS
    const inicio = new Date("1970-01-01T" + datos.horaInicio + ":00Z");
    const fin = new Date("1970-01-01T" + datos.horaFin + ":00Z");
    let horasTurno = (fin - inicio) / (1000 * 60 * 60);
    if (horasTurno < 0) horasTurno += 24;

    // 2. ACTUALIZAR HORAS EN BD (Columna E - 5)[cite: 16]
    const fila = datos.fila;
    const horasActuales = parseFloat(hojaPracticantes.getRange(fila, 5).getValue()) || 0;
    const nuevasHoras = horasActuales + horasTurno;
    hojaPracticantes.getRange(fila, 5).setValue(nuevasHoras);

    // 3. OBTENER O CREAR LIBRO DOCENTE/PRACTICANTE (Columna G - 7)[cite: 16]
    let idLibro = hojaPracticantes.getRange(fila, 7).getValue(); 
    
    if (!idLibro || idLibro === "") {
        idLibro = crearLibroPracticante(datos.nombre, fila, hojaPracticantes);
    }

    const libroPracticante = SpreadsheetApp.openById(idLibro);
    let hojaDestino = libroPracticante.getSheetByName("Asistencia_Mensual");
    if (!hojaDestino) hojaDestino = libroPracticante.getSheets()[0]; 

    // 4. REGISTRAR ASISTENCIA EN EL LIBRO
    hojaDestino.appendRow([datos.nombre, datos.fecha, datos.horaInicio, "", datos.horaFin, ""]);

    return { success: true, nuevasHoras: nuevasHoras };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ================= FUNCIONES AUXILIARES =================

function crearLibroPracticante(nombrePracticante, fila, hojaPracticantes) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaPlantilla = ss.getSheetByName("plantilla");

  // Creamos el libro nuevo
  const nuevoLibro = SpreadsheetApp.create(nombrePracticante);
  const nuevoId = nuevoLibro.getId();
  
  // Guardamos el flujo para que Google registre el archivo
  SpreadsheetApp.flush();

  // Lo movemos a la carpeta de destino
  const archivoCreado = DriveApp.getFileById(nuevoId);
  const carpetaDestino = DriveApp.getFolderById(CONFIG.ID_CARPETA_DESTINO);
  archivoCreado.moveTo(carpetaDestino);

  // Guardamos el ID en la BD (Columna G - 7)[cite: 16]
  hojaPracticantes.getRange(fila, 7).setValue(nuevoId);

  // Copiamos la plantilla y renombramos
  hojaPlantilla.copyTo(nuevoLibro).setName("Asistencia_Mensual"); 
  
  // Eliminamos la hoja 1 por defecto
  const hojaPorDefecto = nuevoLibro.getSheets()[0];
  nuevoLibro.deleteSheet(hojaPorDefecto);

  // Permisos y correo (Columna C - 3)[cite: 16]
  const correoPracticante = hojaPracticantes.getRange(fila, 3).getValue(); 
  if (correoPracticante && correoPracticante !== "") {
    nuevoLibro.addEditor(correoPracticante);
    const asunto = "ASISTENCIA DE PRACTICANTE - " + nombrePracticante;
    const mensaje = "Hola " + nombrePracticante + ",\n\nSe ha creado tu libro de control de asistencia.\n\nEnlace al libro: " + nuevoLibro.getUrl();
    MailApp.sendEmail(correoPracticante, asunto, mensaje);
  }

  return nuevoId;
}
