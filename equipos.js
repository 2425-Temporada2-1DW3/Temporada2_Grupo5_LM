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
    
          // Verificar si el contenedor "temporadas" existe, si no lo creamos
          let temporadasContainer = document.getElementById('temporadasButton1');
    
          
    
          // Limpiar el contenedor de temporadas antes de agregar nuevos elementos
          temporadasContainer.innerHTML = '';
    
          // Generar un div para cada archivo en xmlFiles
          xmlFiles.forEach((file, index) => {
            // Crear un nuevo div para cada temporada
            const temporadaDiv = document.createElement('div');
    
            // Añadir el evento click al div de la temporada
            temporadaDiv.addEventListener('click', async function (e) {
              e.preventDefault(); // Prevenir el comportamiento por defecto
              await cargarEquipos(` ${file}.xml`); // Cargar el contenido del archivo XML
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
            await loadXMLContent(xmlFiles[0]); // Cargar automáticamente el primer archivo
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

        // Get all "equipo" elements
        const equipos = xmlDoc.querySelectorAll("temporada > clasificacion > equipo");
        
        // Create an array to store all "nombre" values
        const nombresEquipos = [];

        // Loop through each "equipo" and get its "nombre"
        equipos.forEach((equipo) => {
            const nombre = equipo.querySelector("nombre");
            if (nombre) {
                // Create the div with class "equipo"
                const equipoDiv = document.createElement("div");
                equipoDiv.classList.add("equipo");

                // Create the inner div with class "montserrat"
                const montserratDiv = document.createElement("div");
                montserratDiv.classList.add("montserrat");

                // Create the img element
                const img = document.createElement("img");
                img.classList.add("equipoImg");
                img.src = "/imagenes/logos/logo.png"; // Replace with actual image source if needed
                img.alt = "Equipo Logo";

                // Append the image and name to the "montserrat" div
                montserratDiv.appendChild(img);
                montserratDiv.appendChild(document.createTextNode(nombre.textContent)); // Replace nombre

                // Create the ul element
                const ul = document.createElement("ul");

                // Add "Fundacion" and "Entrenador" list items
                const fundacionLi = document.createElement("li");
                fundacionLi.textContent = "Fundacion";
                ul.appendChild(fundacionLi);

                const entrenadorLi = document.createElement("li");
                entrenadorLi.textContent = "Entrenador";
                ul.appendChild(entrenadorLi);

                // Append the "montserrat" div and "ul" to the "equipo" div
                equipoDiv.appendChild(montserratDiv);
                equipoDiv.appendChild(ul);

                // Append the "equipo" div to the "equipos" container
                const equiposContainer = document.getElementById("equipos");
                if (equiposContainer) {
                    equiposContainer.appendChild(equipoDiv);
                }
            }
        });
        console.log(nombresEquipos); // Print the parsed XML document
    }
    
}); 