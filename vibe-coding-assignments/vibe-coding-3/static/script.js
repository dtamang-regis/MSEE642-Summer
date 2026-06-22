// Reset demo function
function resetDemo() {
    fetch('/api/reset')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Demo reset successfully! All login attempts and lockouts have been cleared.');
                location.reload();
            } else {
                alert('Error resetting demo: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error resetting demo');
        });
}

// Auto-refresh attempt logs every 5 seconds
function refreshLogs() {
    const currentPath = window.location.pathname;
    if (currentPath === '/vulnerable' || currentPath === '/secure') {
        location.reload();
    }
}

// Set interval for auto-refresh (only on login pages)
if (window.location.pathname === '/vulnerable' || window.location.pathname === '/secure') {
    setInterval(refreshLogs, 5000);
}

// Add visual feedback for form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
            }
        });
    });
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
