import re

files = ['public/index.html', 'public/solutions.html', 'public/resources.html', 'public/contact_us.html']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()

    inactive_desktop = 'class="text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md px-2 py-1 rounded"'
    active_desktop = 'class="text-primary border-b-2 border-primary font-body-md text-body-md py-1"'
    c_desk = active_desktop if 'contact_us' in filepath else inactive_desktop

    inactive_mobile = 'class="text-secondary font-title-md py-2 border-b border-outline-variant/30"'
    active_mobile = 'class="text-primary font-title-md py-2 border-b border-outline-variant/30"'
    c_mob = active_mobile if 'contact_us' in filepath else inactive_mobile

    def replacer(m):
        if 'font-body-md' in m.group(0):
            return f'{m.group(0)}\n            <a {c_desk} href="contact_us.html">Contact</a>'
        elif 'font-title-md' in m.group(0):
            return f'{m.group(0)}\n        <a href="contact_us.html" {c_mob}>Contact</a>'
        return m.group(0)
        
    # The negative lookahead ensures we only replace if 'Contact' is not immediately after 'Resources'
    content = re.sub(r'<a[^>]+>Resources</a>(?!\s*<a[^>]+>Contact</a>)', replacer, content)

    with open(filepath, 'w') as f:
        f.write(content)

