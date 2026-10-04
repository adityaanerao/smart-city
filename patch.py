import re

with open('c:/Users/asus/Desktop/smart city/frontend/analysis.html', 'r', encoding='utf-8') as f:
    html = f.read()

sidebar = '''
    <!-- Sidebar Navigation -->
    <nav class="sidebar">
        <div class="sidebar-logo">
            <div class="logo-icon">✨</div>
            <span>Smart City</span>
        </div>
        <ul class="nav-menu">
            <li><a href="index.html"><span class="icon">📊</span> Dashboard</a></li>
            <li><a href="site-setup.html"><span class="icon">🏗️</span> Site Setup</a></li>
            <li><a href="analysis.html" class="active"><span class="icon">🧠</span> Analysis</a></li>
        </ul>
        <div class="sidebar-footer">
            <div class="status-indicator">
                <span class="dot pulse"></span>
                <span>Systems Online</span>
            </div>
        </div>
    </nav>
'''

html = re.sub(r'<nav class="navbar">.*?</nav>', sidebar, html, flags=re.DOTALL)

html = html.replace('<main class="analysis-page">', '<main class="main-content">')
html = html.replace('<div class="container">', '<div class="container" style="display: flex; flex-direction: column; gap: 24px; max-width: 1400px; margin: 0 auto;">')

fonts = '''<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/modern-dashboard.css">'''
    
html = html.replace('<link rel="stylesheet" href="css/style.css">', fonts)

with open('c:/Users/asus/Desktop/smart city/frontend/analysis.html', 'w', encoding='utf-8') as f:
    f.write(html)
