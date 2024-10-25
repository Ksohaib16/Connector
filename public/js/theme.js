class ThemeManager {
    constructor() {
        // Use localStorage instead of cookies
        this.currentTheme = this.getThemeFromStorage() || 'light';
        this.initializeTheme();
        this.attachEventListeners();
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateToggleButton();
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.innerHTML = this.currentTheme === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
        document.body.appendChild(button);
        return button;
    }

    updateToggleButton() {
        const button = document.querySelector('.theme-toggle') 
            || this.createToggleButton();
        button.innerHTML = this.currentTheme === 'light'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateToggleButton();
        this.saveThemeToStorage();
    }

    // Use localStorage instead of cookies
    saveThemeToStorage() {
        localStorage.setItem('theme', this.currentTheme);
    }

    getThemeFromStorage() {
        return localStorage.getItem('theme');
    }

    attachEventListeners() {
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});