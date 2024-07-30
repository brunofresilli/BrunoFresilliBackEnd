async function changeUserRole(userId, currentRole) {
    // Determina el nuevo rol basándote en el rol actual
    const newRole = currentRole === 'user' ? 'premium' : 'user';

    try {
        const response = await fetch(`/api/users/premium/${userId}`, { // Asegúrate de que la URL esté correcta
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: newRole }) // Enviar el nuevo rol en el cuerpo de la solicitud
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
            const result = await response.json();
            alert('User role updated successfully');
            location.reload(); // Recarga la página para reflejar los cambios
        } else {
            // Si la respuesta no es exitosa, muestra un mensaje de error
            const result = await response.json();
            alert(result.message || 'Failed to update user role');
        }
    } catch (error) {
        // Maneja cualquier error que ocurra durante la solicitud
        console.error('Error al actualizar el rol del usuario:', error);
        alert('An error occurred while updating user role');
    }
}