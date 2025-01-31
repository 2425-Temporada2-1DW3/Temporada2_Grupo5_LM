async function loadXMLContent() {
    try {
      
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