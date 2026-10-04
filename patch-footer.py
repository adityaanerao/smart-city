import os
import re

footer_html = '''        <footer class="app-footer">
            <p>Smart City Planning & Analysis © <span id="currentYear"></span></p>
        </footer>
    </main>'''

files = ['index.html', 'site-setup.html', 'analysis.html']
for filename in files:
    filepath = os.path.join('c:/Users/asus/Desktop/smart city/frontend', filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove any existing <footer> block
    content = re.sub(r'<footer.*?>.*?</footer>', '', content, flags=re.DOTALL)
    
    # Replace </main> with footer + </main>
    if '</main>' in content:
        content = content.replace('</main>', footer_html)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Footers added to all files.')
