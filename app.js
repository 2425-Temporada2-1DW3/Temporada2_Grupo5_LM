$(document).ready(function () {
    // Cargar contenido inicial al abrir la página
    const initialUrl = 'inicio.html'; // URL del contenido inicial
    $.ajax({
        url: initialUrl,
        method: 'GET',
        success: function (data) {
            // Insertar el contenido inicial en el contenedor dinámico
            $('#dynamic-content').html(data);
        },
        error: function () {
            // Mostrar un mensaje de error si falla la carga inicial
            $('#dynamic-content').html('<p>Error al cargar el contenido inicial. Intenta nuevamente.</p>');
        }
    });

    // Manejar clics en enlaces con la clase 'load-content'
    $('.load-content').on('click', function (event) {
        event.preventDefault(); // Evitar que el enlace recargue la página

        const url = $(this).data('url'); // Obtener la URL desde el atributo data-url

        // Realizar la solicitud AJAX para cargar el contenido
        $.ajax({
            url: url, // URL del contenido a cargar
            method: 'GET', // Método HTTP
            success: function (data) {
                // Insertar el contenido recibido en el contenedor dinámico
                $('#dynamic-content').html(data);
            },
            error: function () {
                // Mostrar un mensaje de error si falla la carga
                $('#dynamic-content').html('<p>Error al cargar el contenido. Intenta nuevamente.</p>');
            }
        });
    });
});
