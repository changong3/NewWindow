const loginSignupContainer = document.getElementById('login-signup-container');
const inputContainer = document.getElementById('input-container');
const listContainer = document.getElementById('list-container');
const idList = document.getElementById('id-list');

let selectedIndex = -1;

document.getElementById('signup-btn').addEventListener('click', () => {
    loginSignupContainer.style.display = 'none';
    inputContainer.style.display = 'block';
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    loginSignupContainer.style.display = 'block';
    inputContainer.style.display = 'none';
});

document.getElementById('save-btn').addEventListener('click', () => {
    const companyName = document.getElementById('companyName').value;
    const siteName = document.getElementById('siteName').value;
    const userId = document.getElementById('userId').value;
    const userPw = document.getElementById('userPw').value;

    const newId = { companyName, siteName, userId, userPw };
    const ids = JSON.parse(localStorage.getItem('ids')) || [];

    if (selectedIndex === -1) {
        ids.push(newId);
    } else {
        ids[selectedIndex] = newId;
        selectedIndex = -1;
    }

    localStorage.setItem('ids', JSON.stringify(ids));

    displayIdList();
    inputContainer.style.display = 'none';
    listContainer.style.display = 'block';
});

function displayIdList() {
    const data = JSON.parse(localStorage.getItem('ids')) || [];
    idList.innerHTML = '';
    data.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.companyName}</td>
            <td>${item.siteName}</td>
            <td>${item.userId}</td>
            <td><input type="password" value="${item.userPw}" class="pw-input"> <input type="checkbox" class="show-pw"></td>
            <td><input type="checkbox" class="select-item" data-index="${index}"></td>
        `;
        idList.appendChild(row);

        row.querySelector('.show-pw').addEventListener('change', (e) => {
            const pwInput = row.querySelector('.pw-input');
            pwInput.type = e.target.checked ? 'text' : 'password';
        });
    });
}

document.getElementById('add-btn').addEventListener('click', () => {
    inputContainer.style.display = 'block';
    listContainer.style.display = 'none';
});

document.getElementById('edit-btn').addEventListener('click', () => {
    const selected = document.querySelector('.select-item:checked');
    if (selected) {
        selectedIndex = parseInt(selected.dataset.index);
        const ids = JSON.parse(localStorage.getItem('ids')) || [];
        const selectedId = ids[selectedIndex];

        document.getElementById('companyName').value = selectedId.companyName;
        document.getElementById('siteName').value = selectedId.siteName;
        document.getElementById('userId').value = selectedId.userId;
        document.getElementById('userPw').value = selectedId.userPw;

        inputContainer.style.display = 'block';
        listContainer.style.display = 'none';
    } else {
        alert('수정할 아이디를 선택하세요.');
    }
});

document.getElementById('delete-btn').addEventListener('click', () => {
    const selected = document.querySelector('.select-item:checked');
    if (selected) {
        const index = parseInt(selected.dataset.index);
        const ids = JSON.parse(localStorage.getItem('ids')) || [];
        ids.splice(index, 1);
        localStorage.setItem('ids', JSON.stringify(ids));
        displayIdList();
    } else {
        alert('삭제할 아이디를 선택하세요.');
    }
});

displayIdList();