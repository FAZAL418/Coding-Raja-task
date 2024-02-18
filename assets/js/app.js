// Regular expressions for validation
const strRegex = /^[a-zA-Z\s]*$/; // Only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const digitRegex = /^\d+$/; // Only digits

// Main form and valid input types
const mainForm = document.getElementById('cv-form');
const validType = { TEXT: 'text', TEXT_EMP: 'text_emp', EMAIL: 'email', PHONENO: 'phoneno', ANY: 'any' };

// Functions to fetch user inputs and validate form data
const fetchValues = (attrs, ...nodeLists) => nodeLists[0].map((_, i) => Object.fromEntries(attrs.map((attr, j) => [attr, nodeLists[j][i].value])));
const validateFormData = (elem, elemType, elemName) => {
    const trimValue = elem.value.trim();
    if (elemType === validType.TEXT && (!strRegex.test(trimValue) || trimValue.length === 0)) addErrMsg(elem, elemName);
    if (elemType === validType.TEXT_EMP && !strRegex.test(trimValue)) addErrMsg(elem, elemName);
    if (elemType === validType.EMAIL && (!emailRegex.test(trimValue) || trimValue.length === 0)) addErrMsg(elem, elemName);
    if (elemType === validType.PHONENO && (!phoneRegex.test(trimValue) || trimValue.length === 0)) addErrMsg(elem, elemName);
    if (elemType === validType.ANY && trimValue.length === 0) addErrMsg(elem, elemName);
    else removeErrMsg(elem);
};

// Functions to display and validate error messages
const addErrMsg = (formElem, formElemName) => formElem.nextElementSibling.innerHTML = `${formElemName} is invalid`;
const removeErrMsg = (formElem) => formElem.nextElementSibling.innerHTML = "";

// Function to show list data
const showListData = (listData, listContainer) => {
    listContainer.innerHTML = "";
    listData.forEach(listItem => {
        const itemElem = document.createElement('div');
        itemElem.classList.add('preview-item');
        for (const key in listItem) {
            const subItemElem = document.createElement('span');
            subItemElem.classList.add('preview-item-val');
            subItemElem.innerHTML = `${listItem[key]}`;
            itemElem.appendChild(subItemElem);
        }
        listContainer.appendChild(itemElem);
    });
};

// Function to get user inputs
const getUserInputs = () => {
    const achievementsTitleElem = document.querySelectorAll('.achieve_title');
    const achievementsDescriptionElem = document.querySelectorAll('.achieve_description');
    const expTitleElem = document.querySelectorAll('.exp_title');
    // More elements...

    return {
        firstname: mainForm.firstname.value,
        // Other fields...
        achievements: fetchValues(['achieve_title', 'achieve_description'], achievementsTitleElem, achievementsDescriptionElem),
        experiences: fetchValues(['exp_title', 'exp_organization', 'exp_location', 'exp_start_date', 'exp_end_date', 'exp_description'], expTitleElem, /* More elements... */),
        // Other data...
    };
};

// Function to display CV
const displayCV = (userData) => {
    // Displaying CV data
};

// Function to generate CV
const generateCV = () => {
    const userData = getUserInputs();
    const doc = new jsPDF();
    let yPos = 20;

    // Personal Information Section
    doc.setFontSize(16);
    doc.text(20, yPos, 'Personal Information');
    yPos += 10;
    doc.setFontSize(12);
    doc.text(20, yPos, `Full Name: ${userData.firstname} ${userData.lastname}`);
    yPos += 7;
    doc.text(20, yPos, `Designation: ${userData.designation}`);
    yPos += 7;
    doc.text(20, yPos, `Email: ${userData.email}`);
    yPos += 7;
    doc.text(20, yPos, `Phone No: ${userData.phoneno}`);
    yPos += 15;

    // Achievements Section
    doc.setFontSize(16);
    doc.text(20, yPos, 'Achievements');
    yPos += 10;
    userData.achievements.forEach((achievement, index) => {
        if (index < 3) { // Display only first 3 achievements
            doc.setFontSize(12);
            doc.text(20, yPos, `${achievement.achieve_title}: ${achievement.achieve_description}`);
            yPos += 7;
        }
    });
    yPos += 10;

    // Experiences Section
    doc.setFontSize(16);
    doc.text(20, yPos, 'Experiences');
    yPos += 10;
    userData.experiences.forEach((experience, index) => {
        if (index < 3) { // Display only first 3 experiences
            doc.setFontSize(12);
            doc.text(20, yPos, `${experience.exp_title} at ${experience.exp_organization}`);
            yPos += 7;
        }
    });
    yPos += 10;

    // Education Section
    doc.setFontSize(16);
    doc.text(20, yPos, 'Education');
    yPos += 10;
    userData.educations.forEach((education, index) => {
        if (index < 3) { // Display only first 3 educations
            doc.setFontSize(12);
            doc.text(20, yPos, `${education.edu_school}, ${education.edu_degree}`);
            yPos += 7;
        }
    });

    // Save the PDF
    doc.save('resume.pdf');
};

// Function to preview image
const previewImage = () => {
    const oFReader = new FileReader();
    oFReader.readAsDataURL(mainForm.image.files[0]);
    oFReader.onload = (ofEvent) => { document.getElementById('image_dsp').src = ofEvent.target.result; };
};

// Function to print CV
const printCV = () => { window.print(); };
