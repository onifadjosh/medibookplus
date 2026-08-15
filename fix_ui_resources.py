import re

with open('public/resources.html', 'r') as f:
    res = f.read()

res = re.sub(r'<span class="inline-flex items-center gap-xs text-primary font-title-md text-title-md hover:underline[^>]*>(Read Guide <span class="material-symbols-outlined text-\[16px\]">arrow_forward</span>)</span>', r'<a href="javascript:void(0)" class="inline-flex items-center gap-xs text-primary font-title-md text-title-md hover:underline">\1</a>', res)

res = res.replace('class="faq-answer px-xl pb-xl"', 'class="faq-answer px-xl pb-xl hidden"')

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
