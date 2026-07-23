window.onload = function() {
    loadSavedData();
};

function saveAndUpdate() {
    updateResume();
    saveToLocalStorage();
}

function updateResume() {
    // 1. Basic Info
    document.getElementById('displayName').innerText = document.getElementById('nameInput').value || 'Your Name';
    document.getElementById('displayEmail').innerText = document.getElementById('emailInput').value || 'email@example.com';
    
    const phoneVal = document.getElementById('phoneInput').value;
    document.getElementById('displayPhone').innerText = phoneVal ? ` | ${phoneVal}` : '';

    // 2. LinkedIn & GitHub (Hide if empty)
    const linkedinVal = document.getElementById('linkedinInput').value.trim();
    const linkedinElem = document.getElementById('displayLinkedin');
    if (linkedinVal) {
        linkedinElem.innerText = ` | LinkedIn: ${linkedinVal}`;
    } else {
        linkedinElem.innerText = '';
    }

    const githubVal = document.getElementById('githubInput').value.trim();
    const githubElem = document.getElementById('displayGithub');
    if (githubVal) {
        githubElem.innerText = ` | GitHub: ${githubVal}`;
    } else {
        githubElem.innerText = '';
    }

    // 3. Summary Section
    const summaryVal = document.getElementById('summaryInput').value.trim();
    toggleSection('secSummary', summaryVal);
    document.getElementById('displaySummary').innerText = summaryVal;

    // 4. Skills Section
    const skillsVal = document.getElementById('skillsInput').value.trim();
    toggleSection('secSkills', skillsVal);
    document.getElementById('displaySkills').innerText = skillsVal;

    // 5. Dynamic Lists (Education, Experience, Achievements, Certifications)
    updateListSection('edu-input', 'displayEducation', 'secEdu');
    updateListSection('exp-input', 'displayExperience', 'secExp');
    updateListSection('ach-input', 'displayAchievements', 'secAch');
    updateListSection('cert-input', 'displayCertifications', 'secCert');
}

// Helper Function: Show or Hide Section
function toggleSection(sectionId, hasContent) {
    const sec = document.getElementById(sectionId);
    if (hasContent) {
        sec.classList.remove('hidden');
    } else {
        sec.classList.add('hidden');
    }
}

// Helper Function: Process Dynamic Lists
function updateListSection(inputClass, displayListId, sectionId) {
    const inputs = document.querySelectorAll('.' + inputClass);
    const displayList = document.getElementById(displayListId);
    displayList.innerHTML = '';
    let count = 0;

    inputs.forEach(input => {
        const val = input.value.trim();
        if (val !== '') {
            let li = document.createElement('li');
            li.innerText = val;
            displayList.appendChild(li);
            count++;
        }
    });

    toggleSection(sectionId, count > 0);
}

// Add New Field Functions
function addEducationField() {
    createInputField('educationList', 'edu-input', 'Degree / School details');
}

function addExperienceField() {
    createInputField('experienceList', 'exp-input', 'Job Title / Project details');
}

function addAchievementField() {
    createInputField('achievementList', 'ach-input', 'Achievement details');
}

function addCertificationField() {
    createInputField('certificationList', 'cert-input', 'Certification name & issuer');
}

function createInputField(containerId, className, placeholder) {
    const container = document.getElementById(containerId);
    const input = document.createElement('input');
    input.type = 'text';
    input.className = className;
    input.placeholder = placeholder;
    input.oninput = saveAndUpdate;
    container.appendChild(input);
}

function changeTemplate() {
    const selectedTemplate = document.getElementById('templateSelect').value;
    const preview = document.getElementById('resumePreview');
    preview.className = 'preview-section ' + selectedTemplate;
}

function saveToLocalStorage() {
    const formData = {
        name: document.getElementById('nameInput').value,
        email: document.getElementById('emailInput').value,
        phone: document.getElementById('phoneInput').value,
        linkedin: document.getElementById('linkedinInput').value,
        github: document.getElementById('githubInput').value,
        summary: document.getElementById('summaryInput').value,
        skills: document.getElementById('skillsInput').value
    };
    localStorage.setItem('resumeData', JSON.stringify(formData));
}

function loadSavedData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('nameInput').value = data.name || '';
        document.getElementById('emailInput').value = data.email || '';
        document.getElementById('phoneInput').value = data.phone || '';
        document.getElementById('linkedinInput').value = data.linkedin || '';
        document.getElementById('githubInput').value = data.github || '';
        document.getElementById('summaryInput').value = data.summary || '';
        document.getElementById('skillsInput').value = data.skills || '';
        updateResume();
    }
}

function downloadPDF() {
    const element = document.getElementById('resumePreview');
    const opt = {
        margin:       10,
        filename:     'Resume.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}