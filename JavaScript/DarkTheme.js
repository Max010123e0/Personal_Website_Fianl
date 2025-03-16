document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.textContent = '🌙';  
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    themeToggle.classList.add('theme-toggle');
    
    const header = document.querySelector('header');
    header.appendChild(themeToggle);
    
    function setTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';  
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.textContent = '🌙';  
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            localStorage.setItem('theme', 'light');
        }
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme(true);
    }
    

    themeToggle.addEventListener('click', function() {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        setTheme(!isDarkTheme);
    });
});