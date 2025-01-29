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
    async function accederContenido() {
        console.log('DOM cargado');
        
        // Aquí es donde se espera que el contenido de "dropDown" se cargue dinámicamente
        // Usamos un delegado de eventos para manejar clics en el "dropDown" incluso si no existe aún.
        document.body.addEventListener('click', async (e) => {
            // Comprobamos si el clic ocurrió en el elemento dropDown
            if (e.target && e.target.id === 'dropDown') {
                console.log('Clic en dropDown');
                await cargarJornada();
            }
        });
    }

    // Función que hace el fetch de los datos de la jornada
    async function cargarJornada() {
        try {
            const response = await fetch('/xml');
            if (response.ok) {
                const jornadas = await response.text();
                console.log(jornadas);
            } else {
                console.error('Error al obtener el archivo XML: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    }
});
