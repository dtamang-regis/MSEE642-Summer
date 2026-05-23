// Simple JavaScript for enhanced user experience

document.addEventListener('DOMContentLoaded', function() {
    // Add copy functionality to code blocks
    const codeBlocks = document.querySelectorAll('code');
    codeBlocks.forEach(block => {
        block.style.cursor = 'pointer';
        block.title = 'Click to copy';
        
        block.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1000);
            });
        });
    });

    // Add quick-fill buttons for test cases
    const testCases = document.querySelectorAll('.test-case');
    testCases.forEach(testCase => {
        const codeElement = testCase.querySelector('code');
        if (codeElement) {
            const button = document.createElement('button');
            button.textContent = 'Copy';
            button.className = 'copy-btn';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.fontSize = '0.8em';
            button.style.cursor = 'pointer';
            button.style.border = '1px solid #667eea';
            button.style.background = 'white';
            button.style.borderRadius = '3px';
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const text = codeElement.textContent;
                navigator.clipboard.writeText(text).then(() => {
                    this.textContent = 'Copied!';
                    setTimeout(() => {
                        this.textContent = 'Copy';
                    }, 1000);
                });
            });
            
            codeElement.parentNode.appendChild(button);
        }
    });

    // Add form validation feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const username = this.querySelector('#username');
            const password = this.querySelector('#password');
            
            if (username && password) {
                if (!username.value.trim() || !password.value.trim()) {
                    e.preventDefault();
                    alert('Please fill in both username and password fields.');
                }
            }
        });
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
