import os, glob, shutil, re

source_dir = 'a_dm_in'
dest_dir = 'public'

html_files = glob.glob(os.path.join(source_dir, 'admin_*.html'))
html_files += [os.path.join(source_dir, 'scripts.js')]

for filepath in html_files:
    filename = os.path.basename(filepath)
    dest_path = os.path.join(dest_dir, filename)
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    if filename.endswith('.html'):
        # Inject API script if not present
        if 'api.js' not in content:
            content = content.replace('</body>', '    <script src="api.js"></script>\n</body>')
        
        # Also need to link scripts.js which is now in same dir but named admin_scripts.js?
        # Actually, public already has scripts.js. Let's rename it to admin_scripts.js.
        content = content.replace('src="scripts.js"', 'src="admin_scripts.js"')
    
    # Save the file
    if filename == 'scripts.js':
        dest_path = os.path.join(dest_dir, 'admin_scripts.js')
        
    with open(dest_path, 'w') as f:
        f.write(content)

print(f"Moved and updated {len(html_files)} files.")
