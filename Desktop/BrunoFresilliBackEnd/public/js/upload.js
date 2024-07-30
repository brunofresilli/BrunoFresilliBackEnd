$(document).ready(function() {
    // Handler para mostrar mensajes
    $(document).on('showMessage', function(event, type, message) {
        if (type === 'success') {
            alert(message); // Puedes personalizar esto para mostrar mensajes en la interfaz de usuario
        } else if (type === 'error') {
            alert(message); // Igualmente puedes personalizar esto
        }
    });

    $('#uploadForm').on('submit', function(event) {
        event.preventDefault(); // Evita el envío estándar del formulario

        // Crea un objeto FormData
        var formData = new FormData(this);

        // Reemplaza ':uid' con el ID real del usuario
        var userId = $('#uploadForm').data('userId'); // Usa data-attribute para el ID del usuario
        var url = `/api/users/${userId}/documents`;

        // Enviar los datos al servidor con AJAX
        $.ajax({
            url: url,
            type: 'POST',
            data: formData,
            processData: false, // No procesar los datos (porque es un FormData)
            contentType: false, // No establecer contentType (porque es un FormData)
            success: function(response) {
                // Emitir mensaje de éxito
                $(document).trigger('showMessage', ['success', 'Archivos subidos exitosamente!']);
            },
            error: function(xhr, status, error) {
                // Emitir mensaje de error
                let errorMessage = 'Error al subir los archivos';
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                $(document).trigger('showMessage', ['error', errorMessage]);
            }
        });
    });
});