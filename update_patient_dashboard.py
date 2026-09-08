with open('public/patient_dashboard_enhanced_home.html', 'r') as f:
    content = f.read()

# Add Medical Records Section after Appointments Section
appointments_end = content.find('</section>', content.find('Upcoming Appointments')) + len('</section>')

medical_records_html = """
<!-- Medical Records Section -->
<section class="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 custom-shadow overflow-hidden mt-xl" id="medical-records-section">
    <div class="p-lg border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
        <h2 class="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">medical_information</span>
            My Medical Records
        </h2>
    </div>
    <div class="p-lg space-y-md" id="patient-medical-records-list">
        <p class="text-on-surface-variant text-center py-md italic">Loading medical records...</p>
    </div>
</section>
"""

content = content[:appointments_end] + medical_records_html + content[appointments_end:]

# Add script to fetch medical records
js_logic = """
        // Fetch Medical Records
        async function fetchMedicalRecords() {
            const container = document.getElementById('patient-medical-records-list');
            try {
                const res = await window.API.medicalRecords.getMine();
                if(res.success && res.data && res.data.records) {
                    if (res.data.records.length === 0) {
                        container.innerHTML = '<p class="text-on-surface-variant text-center italic">No medical records found.</p>';
                    } else {
                        container.innerHTML = res.data.records.map(rec => {
                            const date = new Date(rec.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                            const docName = rec.doctor ? `Dr. ${rec.doctor.firstName} ${rec.doctor.lastName}` : 'Unknown Doctor';
                            return `
                                <div class="bg-surface rounded-xl p-md border border-outline-variant/20 mb-md">
                                    <div class="flex justify-between items-start mb-sm">
                                        <div>
                                            <h4 class="font-title-md text-on-surface font-semibold">${rec.diagnosis}</h4>
                                            <p class="font-label-sm text-primary">Consulted by: ${docName}</p>
                                        </div>
                                        <span class="font-label-sm text-on-surface-variant">${date}</span>
                                    </div>
                                    <p class="font-body-md text-on-surface mb-sm">${rec.notes || 'No clinical notes provided.'}</p>
                                    ${rec.vitals ? `
                                    <div class="bg-surface-container-lowest p-sm rounded-lg flex gap-md font-body-sm text-on-surface-variant mt-sm">
                                        ${rec.vitals.bloodPressure ? `<span>BP: ${rec.vitals.bloodPressure}</span>` : ''}
                                        ${rec.vitals.heartRate ? `<span>HR: ${rec.vitals.heartRate}</span>` : ''}
                                        ${rec.vitals.temperature ? `<span>Temp: ${rec.vitals.temperature}°C</span>` : ''}
                                        ${rec.vitals.weight ? `<span>Wt: ${rec.vitals.weight}kg</span>` : ''}
                                    </div>` : ''}
                                </div>
                            `;
                        }).join('');
                    }
                } else {
                    container.innerHTML = '<p class="text-error text-center">Failed to load medical records.</p>';
                }
            } catch (err) {
                console.error(err);
                container.innerHTML = '<p class="text-error text-center">Error fetching medical records.</p>';
            }
        }
        
        fetchMedicalRecords();
"""

content = content.replace("document.getElementById('closeCardModal').onclick = () => document.getElementById('digitalCardModal').classList.add('hidden');", "document.getElementById('closeCardModal').onclick = () => document.getElementById('digitalCardModal').classList.add('hidden');" + js_logic)

with open('public/patient_dashboard_enhanced_home.html', 'w') as f:
    f.write(content)
