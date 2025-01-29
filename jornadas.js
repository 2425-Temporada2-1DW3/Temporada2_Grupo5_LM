document.addEventListener('DOMContentLoaded', async () => {
    // Asegurarse de que el botón "jornadaButton" esté en el DOM
    const jornadaButton = document.getElementById('jornadaButton');

    // Verificar si el botón existe
    if (jornadaButton) {
        jornadaButton.addEventListener('click', async () => {
            accederContenido();
        });
    } else {
        console.error('El botón "jornadaButton" no se encontró en el DOM');
    }

    // Función que se llama cuando se hace clic en "jornadaButton"
    async function accederContenido(e) {
        console.log('DOM cargado');
        await cargarJornada();
        // Aquí es donde se espera que el contenido de "dropDown" se cargue dinámicamente
        // Usamos un delegado de eventos para manejar clics en el "dropDown" incluso si no existe aún.
        
    }

    // Función que hace el fetch de los datos de la jornada
    async function cargarJornada() {
        try {
            const response = await fetch('/xml');
            if (response.ok) {
                const xmlText = await response.text(); // Obtener el contenido como texto

                const regex = /<a href="([^"]+\.xml)">/g;
                let match;
                const xmlFiles = [];
                while ((match = regex.exec(xmlText)) !== null) {
                    // Extraer solo el nombre sin la extensión .xml
                    const fileNameWithoutExtension = match[1];
                    xmlFiles.push(fileNameWithoutExtension); // Almacenamos solo el nombre de la temporada sin la extensión
                }
                loadXMLContent(xmlFiles)
            } else {
                console.error('Error al obtener el archivo XML: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
    async function loadXMLContent(xmlFiles) {
        try {
            console.log(xmlFiles);
            var length = xmlFiles.length - 1;
            const xmlResponse = await fetch(`/xml/${xmlFiles[length]}`);
            if (!xmlResponse.ok) {
                throw new Error('Error al obtener el archivo XML: ' + xmlResponse.statusText);
            }
    
            const xsltResponse = await fetch('/xsl/jornadaFilter.xslt');
            if (!xsltResponse.ok) {
                throw new Error('Error al obtener el archivo XSLT: ' + xsltResponse.statusText);
            }
    
            const xmlText = await xmlResponse.text();
            const xsltText = await xsltResponse.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");
            const xsltDoc = parser.parseFromString(xsltText, "application/xml");
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsltDoc);
            const transformedFragment = xsltProcessor.transformToFragment(xmlDoc, document);
    
            const contentContainer = document.querySelector('#dropDownContainer');
            if (contentContainer) {
                contentContainer.innerHTML = ''; // Limpiar contenido previo
                contentContainer.appendChild(transformedFragment); // Insertar el contenido transformado
                console.log('Contenido XML cargado correctamente');
    
                // Agregar EventListener a cada <li> dentro de #jornadas
                document.querySelectorAll('#jornadas li').forEach(li => {
                    li.addEventListener('click', function () {
                        let idJornada = this.getAttribute('data-id'); // Obtener el ID de la jornada
                        cargarContenidoJornada(idJornada);
                    });
                });
            } else {
                console.error('El contenedor con el id "dropDownContainer" no existe.');
            }
        } catch (error) {
            console.error('Error al cargar el contenido XML:', error);
        }
    }
    
//     async function cargarContenidoJornada(idJornada, xmlFiles) {
//     console.log(`Cargando datos de la Jornada ${idJornada}`);
    
        
//      fetch(`/xml/${xmlFiles[length]}`)  // Cargar el archivo XML completo
//          .then(response => response.text())
//          .then(xmlText => {
//              // Parsear el XML
//              const parser = new DOMParser();
//              const xmlDoc = parser.parseFromString(xmlText, "application/xml");

//              // Filtrar o buscar solo los datos de la jornada seleccionada
//              const jornada = xmlDoc.querySelector(`jornada[id_jornada="${idJornada}"]`);
//              if (jornada) {
//                  // Transformar solo el contenido de la jornada seleccionada con XSLT
//                  transformToHTML(jornada, idJornada);
//              } else {
//                  console.error(`Jornada con ID ${idJornada} no encontrada.`);
//              }
//          })
//          .catch(error => {
//              console.error('Error al cargar el archivo XML:', error);
//          });
// }

});
