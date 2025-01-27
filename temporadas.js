document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM completamente cargado y parseado'); // Depuración

  // Seleccionar el botón por su ID
  const temporadaButton = document.getElementById('temporada');

  // Asociar el evento click al botón
  temporadaButton.addEventListener('click', async function (e) {
    e.preventDefault(); // Prevenir comportamiento por defecto del enlace

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
      let temporadasContainer = document.getElementById('temporadas');

      if (!temporadasContainer) {
        // Crear el contenedor si no existe
        temporadasContainer = document.createElement('div');
        temporadasContainer.id = 'temporadas'; // Asignar el id
        document.body.appendChild(temporadasContainer); // Agregarlo al body o al contenedor que desees
      }

      // Limpiar el contenedor de temporadas antes de agregar nuevos elementos
      temporadasContainer.innerHTML = '';

      // Generar un div para cada archivo en xmlFiles
      xmlFiles.forEach((file, index) => {
        // Crear un nuevo div para cada temporada
        const temporadaDiv = document.createElement('div');

        // Añadir el evento click al div de la temporada
        temporadaDiv.addEventListener('click', async function (e) {
          e.preventDefault(); // Prevenir el comportamiento por defecto
          await loadXMLContent(file); // Cargar el contenido del archivo XML
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

    } catch (error) {
      console.error('Error:', error);
    }

  });

  async function loadXMLContent(file) {
    try {
      console.log(file)
      file = file+".xml"
      const xmlResponse = await fetch(`/xml/${file}`); // Obtener el archivo XML
      console.log(file)
      if (!xmlResponse.ok) {
        throw new Error('Error al obtener el archivo XML: ' + xmlResponse.statusText);
      }

      const xsltResponse = await fetch('/xml/temporadas.xslt'); // Obtener el archivo XSLT
      if (!xsltResponse.ok) {
        throw new Error('Error al obtener el archivo XSLT: ' + xsltResponse.statusText);
      }

      const xmlText = await xmlResponse.text(); // Convertir XML a texto
      const xsltText = await xsltResponse.text(); // Convertir XSLT a texto

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "application/xml");
      const xsltDoc = parser.parseFromString(xsltText, "application/xml");

      // Procesar el XML con el XSLT
      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);

      const transformedFragment = xsltProcessor.transformToFragment(xmlDoc, document);

      // Seleccionar el contenedor con la clase 'contenido'
      const contentContainer = document.querySelector('#clasificacion');
      if (contentContainer) {
        contentContainer.innerHTML = ''; // Limpiar contenido previo
        contentContainer.appendChild(transformedFragment); // Insertar el contenido transformado
      } else {
        console.error('El contenedor con la clase "contenido" no existe.');
      }

    } catch (error) {
      console.error('Hubo un problema al cargar o transformar el contenido del archivo XML:', error);
    }
  }
});
