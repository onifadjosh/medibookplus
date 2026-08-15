import re

files = ['public/index.html', 'public/solutions.html', 'public/resources.html', 'public/contact_us.html']
for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Desktop nav
    desktop_res_match = re.search(r'(<a[^>]+>Resources</a>)', content)
    if desktop_res_match and 'nav class="hidden md:flex items-center gap-lg"' in content and 'href="contact_us.html">Contact</a>' not in content.split('nav class="hidden md:flex items-center gap-lg"')[1].split('</nav>')[0]:
        inactive = 'class="text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md px-2 py-1 rounded"'
        active = 'class="text-primary border-b-2 border-primary font-body-md text-body-md py-1"'
        c_class = active if 'contact_us' in filepath else inactive
        
        # Replace the first instance (desktop)
        content = re.sub(
            r'(<a[^>]+>Resources</a>)',
            r'\1\n            <a ' + c_class + r' href="contact_us.html">Contact</a>',
            content, count=1
        )
        
        # Replace the second instance (mobile) if it exists
        mobile_inactive = 'class="text-secondary font-title-md py-2 border-b border-outline-variant/30"'
        mobile_active = 'class="text-primary font-title-md py-2 border-b border-outline-variant/30"'
        c_mobile_class = mobile_active if 'contact_us' in filepath else mobile_inactive
        
        # Only replace if there is a second instance
        content = re.sub(
            r'(<a[^>]+>Resources</a>)',
            r'\1\n        <a href="contact_us.html" ' + c_mobile_class + r'>Contact</a>',
            content, count=1
        ) 

        with open(filepath, 'w') as f:
            f.write(content)
