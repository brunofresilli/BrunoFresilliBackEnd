async function changeUserRole(userId, currentRole) {
    const newRole = currentRole === 'user' ? 'premium' : 'user';
    const response = await fetch(`/premium/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    if (response.ok) {
        alert('User role updated');
        location.reload();
    } else {
        alert(result.message);
    }
}