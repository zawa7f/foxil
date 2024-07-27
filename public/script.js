document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = window.location.pathname === '/admin.html';
    
    const fetchCodes = () => {
        fetch('/codes')
            .then(response => response.json())
            .then(data => {
                const codesList = document.getElementById('codes-list');
                codesList.innerHTML = '';
                data.forEach(code => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${code.code}: ${code.description} `;
                    
                    if (isAdminPage) {
                        const editButton = document.createElement('button');
                        editButton.textContent = 'Edit';
                        editButton.onclick = () => populateEditForm(code);
                        listItem.appendChild(editButton);
                    }

                    codesList.appendChild(listItem);
                });
            });
    };

    const populateEditForm = (code) => {
        const oldCodeInput = document.getElementById('old-code');
        const newCodeInput = document.getElementById('new-code');
        const newDescriptionInput = document.getElementById('new-description');

        oldCodeInput.value = code.code;
        newCodeInput.value = code.code;
        newDescriptionInput.value = code.description;
    };

    if (isAdminPage || window.location.pathname === '/page1.html') {
        fetchCodes();
    }

    if (isAdminPage) {
        const addForm = document.getElementById('add-code-form');
        addForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(addForm);
            fetch('/add-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: formData.get('code'),
                    description: formData.get('description')
                })
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    addForm.reset();
                    fetchCodes();
                });
        });

        const editForm = document.getElementById('edit-code-form');
        editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(editForm);
            fetch('/edit-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldCode: formData.get('old-code'),
                    newCode: formData.get('new-code'),
                    newDescription: formData.get('new-description')
                })
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    editForm.reset();
                    fetchCodes();
                })
                .catch(error => {
                    alert('Error: ' + error);
                });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const codeForm = document.getElementById('code-form');
    const errorMessage = document.getElementById('error-message');

    codeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(codeForm);
        const enteredCode = formData.get('code');

        fetch('/codes')
            .then(response => response.json())
            .then(data => {
                const codeEntry = data.find(code => code.code === enteredCode);
                if (codeEntry) {
                    window.location.href = codeEntry.url; // Redirect to the URL associated with the code
                } else {
                    errorMessage.textContent = 'Invalid code. Please try again.';
                }
            })
            .catch(error => {
                errorMessage.textContent = 'Error fetching codes.';
            });
    });
});
