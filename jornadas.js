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
            //console.log(xmlFiles);
            var length = xmlFiles.length - 1;
            const xmlResponse = await fetch(`/xml/${xmlFiles[length]}`);
            console.log("test "+xmlResponse);
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
                        cargarContenidoJornada(idJornada, xmlFiles);
                    });
                });
            } else {
                console.error('El contenedor con el id "dropDownContainer" no existe.');
            }
        } catch (error) {
            console.error('Error al cargar el contenido XML:', error);
        }
    }

    async function cargarContenidoJornada(idTemporada, xmlFiles) {
        // Verificar que xmlFiles es un array válido y tiene datos
        if (!xmlFiles || !Array.isArray(xmlFiles) || xmlFiles.length === 0) {
            console.error("Error: xmlFiles no es un array válido o está vacío.");
            return;
        }
    
        let length = xmlFiles.length - 1;
        let xmlFile = xmlFiles[length];
    
        try {
            let response = await fetch(`/xml/${xmlFile}`);
            let str = await response.text();
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(str, "text/xml");
    
            // Buscar la jornada cuyo id_jornada coincide con idTemporada
            let jornadas = xmlDoc.getElementsByTagName("jornada");
            let jornadaEncontrada = null;
    
            for (let i = 0; i < jornadas.length; i++) {
                let idJornada = jornadas[i].getElementsByTagName("id_jornada")[0]?.textContent?.trim();
    
                // Comparamos id_jornada con el idTemporada
                if (idJornada === idTemporada.toString().trim()) {
                    jornadaEncontrada = jornadas[i];
                    break;
                }
            }
    
            if (!jornadaEncontrada) {
                console.error(`No se encontró la jornada con id_jornada ${idTemporada}`);
                return;
            }
    
            // Obtener todos los partidos dentro de esa jornada
            let partidos = jornadaEncontrada.getElementsByTagName("partido");
            let resultados = [];
    
            // Filtrar los partidos
            for (let i = 0; i < partidos.length; i++) {
                let equipoLocal = partidos[i].getElementsByTagName("NombreLocal")[0]?.textContent?.trim() || "Desconocido";
                let equipoVisitante = partidos[i].getElementsByTagName("nombreVisitante")[0]?.textContent?.trim() || "Desconocido";
                let puntuacionLocal = partidos[i].getElementsByTagName("puntuacion")[0]?.textContent?.trim() || "0";
                let puntuacionVisitante = partidos[i].getElementsByTagName("puntuacion")[1]?.textContent?.trim() || "0";
    
                // Agregar al resultado
                resultados.push({
                    equipoLocal,
                    puntuacionLocal,
                    equipoVisitante,
                    puntuacionVisitante
                });
            }
    
            // Crear la tabla con los resultados
            const contentContainer = document.querySelector('#jornadaContenido');
            if (contentContainer) {
                // Limpiar contenido previo
                contentContainer.innerHTML = '';
    
                // Crear tabla HTML
                let tabla = document.createElement('table');
                tabla.classList.add('resultado-table');  // Puedes agregar una clase CSS para estilizarla
    
                // Crear encabezados de la tabla
                let headerRow = document.createElement('tr');
                headerRow.innerHTML = `
                    <th>Equipo Local</th>
                    <th>Pts Local</th>
                    <th>Equipo Visitante</th>
                    <th>Pts Visitante</th>
                `;
                tabla.appendChild(headerRow);
    
                // Crear las filas de la tabla con los resultados
                resultados.forEach(resultado => {
                    let row = document.createElement('tr');
                    row.classList.add('quicksand'); // Puedes agregar una clase CSS para estilizarla
    
                    row.innerHTML = `
                        <td>${resultado.equipoLocal}</td>
                        <td>${resultado.puntuacionLocal}</td>
                        <td>${resultado.equipoVisitante}</td>
                        <td>${resultado.puntuacionVisitante}</td>
                    `;
                    tabla.appendChild(row);
                });
    
                // Insertar la tabla generada en el contenedor
                contentContainer.appendChild(tabla);
                console.log(`Partidos en la jornada con id_jornada ${idTemporada}:`, resultados);
            } else {
                console.error('El contenedor con el id "dropDownContainer" no existe.');
            }
        } catch (error) {
            console.error("Error al cargar el XML:", error);
        }
    }
    
});
