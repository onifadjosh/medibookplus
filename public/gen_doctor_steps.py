import os

base_dir = '/home/plutodev/Documents/medibookplus/public'

with open(os.path.join(base_dir, 'register_doctor_credentials_step_3.html'), 'r') as f:
    template = f.read()

# For Basic Info:
# Replace "Step 3 of 5" -> "Step 1 of 5"
# Replace "60% Complete" -> "20% Complete"
# Replace width: 60% -> width: 20%
# Move active class from Professional Credentials to Basic Information

basic_info_html = template.replace('Step 3 of 5', 'Step 1 of 5').replace('60% Complete', '20% Complete').replace('width: 60%', 'width: 20%')
basic_info_html = basic_info_html.replace('Professional Credentials</h1>', 'Basic Information</h1>')
basic_info_html = basic_info_html.replace('<p class="text-body-sm font-body-sm text-on-surface-variant">We verify all medical practitioners to maintain our gold standard of clinical care.</p>', '<p class="text-body-sm font-body-sm text-on-surface-variant">Please provide your basic contact information to begin the credentialing process.</p>')

# Swap sidebar active states:
basic_info_html = basic_info_html.replace(
'''<li class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-label-sm font-label-sm">Basic Information</span>
</li>''',
'''<li class="flex items-center gap-2 text-primary font-semibold">
<span class="material-symbols-outlined text-sm">radio_button_checked</span>
<span class="text-label-sm font-label-sm">Basic Information</span>
</li>'''
)

basic_info_html = basic_info_html.replace(
'''<li class="flex items-center gap-2 text-primary font-semibold">
<span class="material-symbols-outlined text-sm">radio_button_checked</span>
<span class="text-label-sm font-label-sm">Professional Credentials</span>
</li>''',
'''<li class="flex items-center gap-2 text-outline">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span class="text-label-sm font-label-sm">Professional Credentials</span>
</li>'''
)

basic_info_html = basic_info_html.replace(
'''<li class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-label-sm font-label-sm">Account Security</span>
</li>''',
'''<li class="flex items-center gap-2 text-outline">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span class="text-label-sm font-label-sm">Account Security</span>
</li>'''
)

form_basic = '''<form class="space-y-xl" onsubmit="event.preventDefault(); window.location.href='register_doctor_account_security_step_2.html';">
<div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
<div class="space-y-xs col-span-1">
<label class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wide">First Name</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">person</span>
<input class="w-full pl-12 pr-md py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md input-focus-ring transition-all" required type="text" placeholder="John" />
</div></div>
<div class="space-y-xs col-span-1">
<label class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wide">Last Name</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">person</span>
<input class="w-full pl-12 pr-md py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md input-focus-ring transition-all" required type="text" placeholder="Doe" />
</div></div>
<div class="space-y-xs col-span-full">
<label class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wide">Email Address</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">mail</span>
<input class="w-full pl-12 pr-md py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md input-focus-ring transition-all" required type="email" placeholder="john.doe@example.com" />
</div></div>
<div class="space-y-xs col-span-full">
<label class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wide">Phone Number</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">call</span>
<input class="w-full pl-12 pr-md py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md input-focus-ring transition-all" required type="tel" placeholder="+1 (555) 000-0000" />
</div></div>
</div>
<div class="pt-lg flex flex-col md:flex-row items-center gap-md">
<button class="w-full md:w-auto px-xl py-3 rounded-lg border border-primary text-primary font-label-md hover:bg-primary-fixed transition-colors" type="button" onclick="window.location.href='register_role_selection_step_2.html'">Back</button>
<button class="w-full flex-grow py-3 rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2" type="submit">Continue to Step 2 <span class="material-symbols-outlined">arrow_forward</span></button>
</div>
</form>'''

# Replace form in basic info
import re
basic_info_html = re.sub(r'<form class="space-y-xl">.*?</form>', form_basic, basic_info_html, flags=re.DOTALL)
with open(os.path.join(base_dir, 'register_doctor_basic_info_step_1.html'), 'w') as f:
    f.write(basic_info_html)

# For Account Security:
account_sec_html = template.replace('Step 3 of 5', 'Step 2 of 5').replace('60% Complete', '40% Complete').replace('width: 60%', 'width: 40%')
account_sec_html = account_sec_html.replace('Professional Credentials</h1>', 'Account Security</h1>')
account_sec_html = account_sec_html.replace('<p class="text-body-sm font-body-sm text-on-surface-variant">We verify all medical practitioners to maintain our gold standard of clinical care.</p>', '<p class="text-body-sm font-body-sm text-on-surface-variant">Secure your account with a strong password.</p>')

account_sec_html = account_sec_html.replace(
'''<li class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-label-sm font-label-sm">Account Security</span>
</li>''',
'''<li class="flex items-center gap-2 text-primary font-semibold">
<span class="material-symbols-outlined text-sm">radio_button_checked</span>
<span class="text-label-sm font-label-sm">Account Security</span>
</li>'''
)

account_sec_html = account_sec_html.replace(
'''<li class="flex items-center gap-2 text-primary font-semibold">
<span class="material-symbols-outlined text-sm">radio_button_checked</span>
<span class="text-label-sm font-label-sm">Professional Credentials</span>
</li>''',
'''<li class="flex items-center gap-2 text-outline">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span class="text-label-sm font-label-sm">Professional Credentials</span>
</li>'''
)

form_acc = '''<form class="space-y-xl" onsubmit="event.preventDefault(); window.location.href='register_doctor_credentials_step_3.html';">
<div class="grid grid-cols-1 gap-lg">
<div class="space-y-xs col-span-full">
<label class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wide">Create Password</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">lock</span>
<input class="w-full pl-12 pr-md py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md input-focus-ring transition-all" required type="password" placeholder="••••••••" />
</div></div>
<div class="space-y-xs col-span-full">
<label class="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wide">Confirm Password</label>
<div class="relative">
<span class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">lock</span>
<input class="w-full pl-12 pr-md py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md input-focus-ring transition-all" required type="password" placeholder="••••••••" />
</div></div>
</div>
<div class="pt-lg flex flex-col md:flex-row items-center gap-md">
<button class="w-full md:w-auto px-xl py-3 rounded-lg border border-primary text-primary font-label-md hover:bg-primary-fixed transition-colors" type="button" onclick="window.location.href='register_doctor_basic_info_step_1.html'">Back</button>
<button class="w-full flex-grow py-3 rounded-lg bg-primary text-on-primary font-label-md hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2" type="submit">Continue to Step 3 <span class="material-symbols-outlined">arrow_forward</span></button>
</div>
</form>'''

account_sec_html = re.sub(r'<form class="space-y-xl">.*?</form>', form_acc, account_sec_html, flags=re.DOTALL)
with open(os.path.join(base_dir, 'register_doctor_account_security_step_2.html'), 'w') as f:
    f.write(account_sec_html)

