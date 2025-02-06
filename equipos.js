document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM completamente cargado y parseado'); // Depuración
    const temporadaButton = document.getElementById('equiposButton');

    // Asociar el evento click al botón
    temporadaButton.addEventListener('click', async function (e) {
      e.preventDefault(); // Prevenir comportamiento por defecto del enlace
      await cargarTemporadas(); // Cargar temporadas al hacer clic
  
    });
    
    async function cargarTemporadas() {
        try {
          const response = await fetch('/xml'); // Obtener el listado de archivos XML
          if (!response.ok) {
            throw new Error('Error al obtener los archivos XML: ' + response.statusText);
          }
    
          const xmlText = await response.text(); // Obtener el contenido como texto
    
          const regex = /<a href="([^"]+\.xml)">/g;
          let match;
          const xmlFiles = [];
    
          // Iteramos sobre todas las coincidencias
          while ((match = regex.exec(xmlText)) !== null) {
            // Extraer solo el nombre sin la extensión .xml
            const fileNameWithoutExtension = match[1].replace('.xml', '');
            xmlFiles.push(fileNameWithoutExtension); // Almacenamos solo el nombre de la temporada sin la extensión
          }
    
          console.log(xmlFiles); // Ver en consola los archivos sin la extensión .xml
    
          let temporadasContainer = document.getElementById('temporadas');
    
          
    
          // Limpiar el contenedor de temporadas antes de agregar nuevos elementos
    
          // Generar un div para cada archivo en xmlFiles
          xmlFiles.forEach((file, index) => {
            // Crear un nuevo div para cada temporada
            const temporadaDiv = document.createElement('div');
    
            // Añadir el evento click al div de la temporada
            temporadaDiv.addEventListener('click', async function (e) {
              e.preventDefault(); // Prevenir el comportamiento por defecto
              await cargarEquipos(` ${file}.xml`); // Cargar el contenido del archivo XML
              console.log(`Cargando archivo: ${file}.xml`); // Depuración
              
            });
    
            // Crear el botón y enlace con la estructura deseada
            const button = document.createElement('button');
            const anchor = document.createElement('a');
            anchor.classList.add('montserrat');
            anchor.textContent = ` ${file}`; // Nombre de la temporada sin la extensión
    
            // Añadir el enlace al botón
            button.appendChild(anchor);
    
            // Añadir los elementos al div de la temporada
            temporadaDiv.appendChild(button);
    
            // Añadir el div de la temporada al contenedor
            temporadasContainer.appendChild(temporadaDiv);
          });
    
          // Si hay archivos XML, cargar automáticamente el primero
          if (xmlFiles.length > 0) {
            console.log(`Cargando automáticamente el archivo: ${xmlFiles[0]}`);
            await cargarEquipos(`${xmlFiles[0]}.xml`); // Cargar automáticamente el primer archivo
          }
    
        } catch (error) {
          console.error('Error:', error);
        }
    
    }
    
    async function cargarEquipos(filename){
        filename = filename.trim();

        console.log(filename)
        
        const response = await fetch("/xml/"+filename); // Obtener el listado de archivos XML
        if (!response.ok) {
          throw new Error('Error al obtener los archivos XML: ' + response.statusText);
        }
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");


        // Create an array to store all "nombre" values
        const nombresEquipos = [];

        // Borrar elementos existentes en el contenedor 
        const equiposContenido = document.getElementById("equiposContenido");
        const tituloJugadores = document.getElementById("tituloJugadores");

        if (equiposContenido) {
          equiposContenido.innerHTML = ""; // Clears existing content
        }
        // cojer todos los equipos
        const equipos = xmlDoc.querySelectorAll("temporada > clasificacion > equipo");
        // leer cada equipo y crear el boton
        equipos.forEach((equipo) => {
            const nombre = equipo.querySelector("nombre");
            if (nombre) {

              // Div Principal
              const equipoDiv = document.createElement("div");
              let imgpath = equipo.querySelector("idFotoEquipo")?.textContent.trim();
              if (imgpath == null) {
                imgpath = "idFotodefault";
              }

              equipoDiv.classList.add("equipo");

              // Div para la foto y nombre de equipo
              const divBtn = document.createElement("div");
              divBtn.classList.add("montserrat");

              // Imagen del equipo
              const img = document.createElement("img");
              img.classList.add("equipoImg");

              
              img.src = "/imagenes/equipos/"+imgpath+".png"; // SE necesita path de la imagen en el XML

              // Boton del equipo
              divBtn.appendChild(img);
              divBtn.appendChild(document.createTextNode(nombre.textContent));

              divBtn.addEventListener("click", function() {
                tituloJugadores.innerHTML = "JUGADORES DEL " + nombre.textContent.toUpperCase();
                cargarJugadores(equipo);
              });

              equipoDiv.appendChild(divBtn);

              equiposContenido.appendChild(equipoDiv);
              
            }
        });
        cargarJugadores(equipos[0]);
        const nombre = equipos[0].querySelector("nombre");
        tituloJugadores.innerHTML = "JUGADORES DEL " + nombre.textContent.toUpperCase();


    }
    
    async function cargarJugadores(equipo) {
      const jugadores = equipo.querySelectorAll("jugadores jugador");
      const tablaContenido = document.getElementById("tablaContenido");
      
      if (tablaContenido) {
        const rows = tablaContenido.querySelectorAll("tr");
        // quitar todos los trs menos el primero
        for (let i = rows.length - 1; i > 0; i--) {
            rows[i].remove();
        }
      }
      jugadores.forEach((jugador) => {
        const nombre = jugador.querySelector("nombre")?.textContent.trim();
        const edad = jugador.querySelector("edad")?.textContent.trim();
        const posicion = jugador.querySelector("posicion")?.textContent.trim();
        let imgpath = jugador.querySelector("idFoto")?.textContent.trim();
        if (imgpath == null) {
            imgpath = "idFotodefault";
        }
        console.log(imgpath);
        const tableRow = document.createElement("tr");

        // Columna NOMBRE
        const tableColum1 = document.createElement("td");
        tableColum1.innerHTML = nombre;        
        tableRow.appendChild(tableColum1);

        // Columna IMAGEN
        const tableColum2 = document.createElement("td");
        const img = document.createElement("img");
        img.src = "/imagenes/jugadores/"+imgpath+".png"; // SE necesita path de la imagen en el XML
        tableColum2.appendChild(img);          
        tableRow.appendChild(tableColum2);

        // Columna EDAD
        const tableColum3 = document.createElement("td");
        tableColum3.innerHTML = edad;        
        tableRow.appendChild(tableColum3);

        // Columna POSICION
        const tableColum4 = document.createElement("td");
        tableColum4.innerHTML = posicion;        
        tableRow.appendChild(tableColum4);

        tablaContenido.appendChild(tableRow);

      });
    }
}); 