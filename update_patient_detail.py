import re

with open('public/doctor_patient_detail.html', 'r') as f:
    content = f.read()

# Add Medical Records section after Appointments section
appointments_section_end = content.find('</section>', content.find('Appointment History')) + len('</section>')

medical_records_html = """
                        <!-- Medical Records Section -->
                        <section class="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 custom-shadow overflow-hidden mt-xl">
                            <div class="p-lg border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
                                <h2 class="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary">medical_information</span>
                                    Medical Records
                                </h2>
                                <button onclick="openRecordModal()" class="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary/90 transition-colors">
                                    + Add Record
                                </button>
                            </div>
                            <div class="p-lg space-y-md" id="medical-records-list">
                                <p class="text-on-surface-variant text-center py-md italic">Loading medical records...</p>
                            </div>
                        </section>
"""

content = content[:appointments_section_end] + medical_records_html + content[appointments_section_end:]

# Add Modals before closing body
modals_html = """
    <!-- End Consultation Modal -->
    <dialog id="end-consultation-modal" class="bg-surface-container-lowest rounded-2xl shadow-lg p-0 backdrop:bg-black/50 w-full max-w-md border border-outline-variant/20">
        <div class="p-lg border-b border-outline-variant/10">
            <h3 class="font-title-lg text-on-surface">End Consultation</h3>
        </div>
        <div class="p-lg space-y-md">
            <div>
                <label class="block font-label-md text-on-surface mb-xs">Consultation Notes (Optional)</label>
                <textarea id="consultation-notes" class="w-full bg-surface text-on-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary h-24" placeholder="Enter closing notes..."></textarea>
            </div>
        </div>
        <div class="p-lg border-t border-outline-variant/10 flex justify-end gap-sm bg-surface-container-low">
            <button onclick="closeEndConsultationModal()" class="px-md py-2 rounded-lg font-label-md text-on-surface hover:bg-surface-container-highest transition-colors">Cancel</button>
            <button onclick="submitEndConsultation()" class="px-md py-2 rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors">End Session</button>
        </div>
    </dialog>

    <!-- Medical Record Modal -->
    <dialog id="medical-record-modal" class="bg-surface-container-lowest rounded-2xl shadow-lg p-0 backdrop:bg-black/50 w-full max-w-2xl border border-outline-variant/20">
        <div class="p-lg border-b border-outline-variant/10">
            <h3 class="font-title-lg text-on-surface">Add Medical Record</h3>
        </div>
        <div class="p-lg space-y-md max-h-[60vh] overflow-y-auto">
            <div>
                <label class="block font-label-md text-on-surface mb-xs">Diagnosis *</label>
                <input type="text" id="record-diagnosis" class="w-full bg-surface text-on-surface border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary" placeholder="e.g. Seasonal malaria">
            </div>
            
            <div class="grid grid-cols-2 gap-md">
                <div>
                    <label class="block font-label-md text-on-surface mb-xs">Blood Pressure</label>
                    <input type="text" id="record-bp" class="w-full bg-surface border border-outline-variant rounded-lg p-sm" placeholder="120/80">
                </div>
                <div>
                    <label class="block font-label-md text-on-surface mb-xs">Heart Rate</label>
                    <input type="number" id="record-hr" class="w-full bg-surface border border-outline-variant rounded-lg p-sm" placeholder="72">
                </div>
                <div>
                    <label class="block font-label-md text-on-surface mb-xs">Temperature (C)</label>
                    <input type="number" step="0.1" id="record-temp" class="w-full bg-surface border border-outline-variant rounded-lg p-sm" placeholder="37.0">
                </div>
                <div>
                    <label class="block font-label-md text-on-surface mb-xs">Weight (kg)</label>
                    <input type="number" id="record-weight" class="w-full bg-surface border border-outline-variant rounded-lg p-sm" placeholder="70">
                </div>
            </div>

            <div>
                <label class="block font-label-md text-on-surface mb-xs">Clinical Notes</label>
                <textarea id="record-notes" class="w-full bg-surface text-on-surface border border-outline-variant rounded-lg p-sm h-24" placeholder="Advised rest and follow-up..."></textarea>
            </div>
        </div>
        <div class="p-lg border-t border-outline-variant/10 flex justify-end gap-sm bg-surface-container-low">
            <button onclick="closeRecordModal()" class="px-md py-2 rounded-lg font-label-md text-on-surface hover:bg-surface-container-highest transition-colors">Cancel</button>
            <button onclick="submitMedicalRecord()" class="px-md py-2 rounded-lg font-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors">Save Record</button>
        </div>
    </dialog>
"""

content = content.replace('</body>', modals_html + '\n</body>')

# Update script to include Consultation and Medical Record logic
script_replacement = """
                        // Populate appointments
                        const tbody = document.getElementById('appointments-tbody');
                        if (appointments.length === 0) {
                            tbody.innerHTML = '<tr><td colspan="3" class="p-lg text-center text-on-surface-variant italic">No appointments found.</td></tr>';
                        } else {
                            tbody.innerHTML = appointments.map(appt => {
                                let statusClass = 'bg-surface-container-highest text-on-surface';
                                if (appt.status === 'confirmed') statusClass = 'bg-primary-container text-on-primary-container';
                                if (appt.status === 'in_progress') statusClass = 'bg-yellow-100 text-yellow-800';
                                if (appt.status === 'completed') statusClass = 'bg-green-100 text-green-800';
                                if (appt.status === 'cancelled') statusClass = 'bg-error/10 text-error';

                                const date = new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                                
                                let actionBtn = '';
                                if (appt.status === 'confirmed') {
                                    actionBtn = `<button onclick="startConsultation('${appt._id}')" class="ml-sm px-xs py-1 text-xs bg-primary text-on-primary rounded hover:bg-primary/90">Start</button>`;
                                } else if (appt.status === 'in_progress') {
                                    actionBtn = `<button onclick="openEndConsultationModal('${appt._id}')" class="ml-sm px-xs py-1 text-xs bg-error text-onError rounded hover:bg-error/90">End</button>`;
                                }

                                return `
                                    <tr>
                                        <td class="px-lg py-md font-body-md text-on-surface">
                                            <div class="font-semibold">${date}</div>
                                            <div class="text-sm text-on-surface-variant">${appt.timeSlot || ''}</div>
                                        </td>
                                        <td class="px-lg py-md font-body-md text-on-surface-variant">${appt.visitType || 'General'}</td>
                                        <td class="px-lg py-md">
                                            <span class="px-sm py-1 rounded-full font-label-sm capitalize ${statusClass}">${appt.status}</span>
                                            ${actionBtn}
                                        </td>
                                    </tr>
                                `;
                            }).join('');
                        }

                        // Fetch Medical Records
                        loadMedicalRecords(patientId);
"""

# Replace the appointment mapping part
import re
content = re.sub(r'// Populate appointments.*?}\);', script_replacement + '\n                } else {', content, flags=re.DOTALL)

# Let's write the global functions
global_funcs = """
        let currentPatientId = null;
        let currentApptId = null;

        document.addEventListener('DOMContentLoaded', async () => {
"""

content = content.replace("document.addEventListener('DOMContentLoaded', async () => {", global_funcs)

script_end_repl = """
        function handleLogout() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login_secure_entry.html';
        }

        async function loadMedicalRecords(patientId) {
            currentPatientId = patientId;
            const container = document.getElementById('medical-records-list');
            try {
                const res = await window.API.medicalRecords.getForPatient(patientId);
                if (res.success && res.data && res.data.records) {
                    if (res.data.records.length === 0) {
                        container.innerHTML = '<p class="text-on-surface-variant text-center italic">No medical records found.</p>';
                    } else {
                        container.innerHTML = res.data.records.map(rec => {
                            const date = new Date(rec.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                            return `
                                <div class="bg-surface rounded-xl p-md border border-outline-variant/20">
                                    <div class="flex justify-between items-start mb-sm">
                                        <h4 class="font-title-md text-on-surface font-semibold">${rec.diagnosis}</h4>
                                        <span class="font-label-sm text-on-surface-variant">${date}</span>
                                    </div>
                                    <p class="font-body-md text-on-surface mb-sm">${rec.notes || 'No notes provided.'}</p>
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
                }
            } catch (err) {
                console.error(err);
                container.innerHTML = '<p class="text-error text-center">Failed to load medical records.</p>';
            }
        }

        async function startConsultation(apptId) {
            try {
                const res = await window.API.doctorRole.appointments.startConsultation(apptId);
                if(res.success) {
                    alert('Consultation started successfully!');
                    window.location.reload();
                } else {
                    alert(res.message);
                }
            } catch (err) {
                alert(err.message || 'Error starting consultation');
            }
        }

        function openEndConsultationModal(apptId) {
            currentApptId = apptId;
            document.getElementById('end-consultation-modal').showModal();
        }

        function closeEndConsultationModal() {
            document.getElementById('end-consultation-modal').close();
            currentApptId = null;
        }

        async function submitEndConsultation() {
            if(!currentApptId) return;
            const notes = document.getElementById('consultation-notes').value;
            try {
                const res = await window.API.doctorRole.appointments.endConsultation(currentApptId, notes);
                if(res.success) {
                    alert('Consultation ended!');
                    window.location.reload();
                } else {
                    alert(res.message);
                }
            } catch (err) {
                alert(err.message || 'Error ending consultation');
            }
        }

        function openRecordModal() {
            document.getElementById('medical-record-modal').showModal();
        }

        function closeRecordModal() {
            document.getElementById('medical-record-modal').close();
        }

        async function submitMedicalRecord() {
            const diagnosis = document.getElementById('record-diagnosis').value;
            if(!diagnosis) return alert('Diagnosis is required');
            
            const bp = document.getElementById('record-bp').value;
            const hr = document.getElementById('record-hr').value;
            const temp = document.getElementById('record-temp').value;
            const weight = document.getElementById('record-weight').value;
            const notes = document.getElementById('record-notes').value;

            const vitals = {};
            if(bp) vitals.bloodPressure = bp;
            if(hr) vitals.heartRate = Number(hr);
            if(temp) vitals.temperature = Number(temp);
            if(weight) vitals.weight = Number(weight);

            const payload = {
                patientId: currentPatientId,
                diagnosis,
                notes
            };
            if(Object.keys(vitals).length > 0) payload.vitals = vitals;

            try {
                const res = await window.API.medicalRecords.create(payload);
                if(res.success) {
                    closeRecordModal();
                    alert('Medical record created!');
                    loadMedicalRecords(currentPatientId);
                } else {
                    alert(res.message);
                }
            } catch (err) {
                alert(err.message || 'Error creating record');
            }
        }
"""

content = content.replace('function handleLogout() {', script_end_repl)

with open('public/doctor_patient_detail.html', 'w') as f:
    f.write(content)
