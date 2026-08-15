import re

# 1 & 2. Fix resources.html (Read Guide & FAQ)
with open('public/resources.html', 'r') as f:
    res = f.read()

# Replace span with a tag for Read Guide
res = re.sub(r'<span class="inline-flex items-center gap-xs text-primary font-title-md text-title-md hover:underline[^>]*>(Read Guide <span class="material-symbols-outlined text-\[16px\]">arrow_forward</span>)</span>', r'<a href="javascript:void(0)" class="inline-flex items-center gap-xs text-primary font-title-md text-title-md hover:underline">\1</a>', res)

# Add hidden to faq-answer
res = res.replace('class="faq-answer px-xl pb-xl"', 'class="faq-answer px-xl pb-xl hidden"')

# Modify toggleFaq
new_toggle_faq = """function toggleFaq(btn) {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            if(answer) answer.classList.toggle('hidden');
            if(icon) icon.classList.toggle('rotate-180');
        }"""
res = re.sub(r'function toggleFaq\(btn\) \{.*?\}', new_toggle_faq, res, flags=re.DOTALL)

with open('public/resources.html', 'w') as f:
    f.write(res)

# 3. Add Contact to Nav Links
files = ['public/index.html', 'public/solutions.html', 'public/resources.html', 'public/contact_us.html']
for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if '>Contact</a>' not in content:
        inactive = 'class="text-secondary hover:bg-surface-container-high transition-colors font-body-md text-body-md px-2 py-1 rounded"'
        active = 'class="text-primary border-b-2 border-primary font-body-md text-body-md py-1"'
        c_class = active if 'contact_us' in filepath else inactive
        
        content = re.sub(
            r'(<a[^>]+href="resources\.html"[^>]*>Resources</a>)',
            r'\1\n            <a ' + c_class + r' href="contact_us.html">Contact</a>',
            content, count=1
        )
        
        mobile_inactive = 'class="text-secondary font-title-md py-2 border-b border-outline-variant/30"'
        mobile_active = 'class="text-primary font-title-md py-2 border-b border-outline-variant/30"'
        c_mobile_class = mobile_active if 'contact_us' in filepath else mobile_inactive
        
        # Second match is usually mobile menu if it exists
        content = re.sub(
            r'(<a[^>]+href="resources\.html"[^>]*>Resources</a>)(?=\s*<a[^>]+href="login_secure_entry\.html)',
            r'\1\n        <a href="contact_us.html" ' + c_mobile_class + r'>Contact</a>',
            content
        )
        
        with open(filepath, 'w') as f:
            f.write(content)
