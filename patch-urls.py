import os
import glob
import re

js_files = glob.glob('frontend/js/*.js')
for file in js_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'main.js' in file:
        if 'window.BACKEND_URL' not in content:
            content = '// Set your live backend URL here after deploying to Render/Railway\nwindow.BACKEND_URL = "http://10.70.80.81:5001";\n\n' + content

    content = re.sub(r'function getBaseUrl\(\)\s*\{.*?\}', 'function getBaseUrl() { return window.BACKEND_URL; }', content, flags=re.DOTALL)
    
    content = re.sub(r'`http://\$\{host\}:5001(/.*?)`', r'window.BACKEND_URL + "\1"', content)
    content = re.sub(r'"http://[0-9\.]+?:5001(/.*?)"', r'window.BACKEND_URL + "\1"', content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print('API URLs updated successfully.')
