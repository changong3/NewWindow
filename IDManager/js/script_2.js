const loginSignupContainer = document.getElementById("login-signup-container");
const inputContainer = document.getElementById("input-container");
const listContainer = document.getElementById("list-container");
const idList = document.getElementById("id-list");
const loginMessage = document.getElementById("login-message");

let selectedIndex = -1;

// 로그인 버튼 클릭 시
document.getElementById("login-btn").addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    loginSignupContainer.style.display = "none";
    listContainer.style.display = "block";
    displayIdList();
  } else {
    loginMessage.textContent = "아이디 또는 비밀번호가 일치하지 않습니다.";
  }
});

// 회원가입 버튼 클릭 시
document.getElementById('signup-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        loginMessage.textContent = '이미 사용 중인 아이디입니다.';
        document.getElementById('user-list-btn').style.display = 'block'; // 사용자 목록 버튼 표시
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    loginMessage.textContent = '회원가입이 완료되었습니다.';
    loginSignupContainer.style.display = 'none';
    inputContainer.style.display = 'block';
});

// 등록 사용자 목록 버튼 클릭 시
document.getElementById('user-list-btn').addEventListener('click', () => {
    loginSignupContainer.style.display = 'none';
    userListContainer.style.display = 'block';
    displayUserList();
});

// 등록 사용자 목록 표시 함수
function displayUserList() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.username}</td>
            <td><input type="checkbox" class="select-user" data-index="${index}"></td>
        `;
        userList.appendChild(row);
    });
}

// 사용자 수정 버튼 클릭 시
document.getElementById('edit-user-btn').addEventListener('click', () => {
    const selected = document.querySelector('.select-user:checked');
    if (selected) {
        selectedIndex = parseInt(selected.dataset.index);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const selectedUser = users[selectedIndex];

        document.getElementById('username').value = selectedUser.username;
        document.getElementById('password').value = selectedUser.password;

        userListContainer.style.display = 'none';
        loginSignupContainer.style.display = 'block';
    } else {
        alert('수정할 사용자를 선택하세요.');
    }
});

// 사용자 삭제 버튼 클릭 시
document.getElementById('delete-user-btn').addEventListener('click', () => {
    const selected = document.querySelector('.select-user:checked');
    if (selected) {
        const index = parseInt(selected.dataset.index);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        displayUserList();
    } else {
        alert('삭제할 사용자를 선택하세요.');
    }
});

// 취소 버튼 클릭 시 (아이디 입력 창에서)
document.getElementById("cancel-btn").addEventListener("click", () => {
  inputContainer.style.display = "none";
  loginSignupContainer.style.display = "block";
});

// 저장 버튼 클릭 시 (아이디 입력 창에서)
document.getElementById("save-btn").addEventListener("click", () => {
  const companyName = document.getElementById("companyName").value;
  const siteName = document.getElementById("siteName").value;
  const userId = document.getElementById("userId").value;
  const userPw = document.getElementById("userPw").value;
  const memo = document.getElementById("memo").value;

  const newId = { companyName, siteName, userId, userPw, memo };
  const ids = JSON.parse(localStorage.getItem("ids")) || [];

  if (selectedIndex === -1) {
    ids.push(newId);
  } else {
    ids[selectedIndex] = newId;
    selectedIndex = -1;
  }

  localStorage.setItem("ids", JSON.stringify(ids));

  displayIdList();
  inputContainer.style.display = "none";
  listContainer.style.display = "block";
});

// 아이디 목록 표시 함수
function displayIdList() {
  const data = JSON.parse(localStorage.getItem("ids")) || [];
  idList.innerHTML = "";
  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.companyName}</td>
            <td>${item.siteName}</td>
            <td>${item.userId}</td>
            <td><input type="password" value="${
              item.userPw
            }" class="pw-input"> <input type="checkbox" class="show-pw"></td>
            <td><input type="checkbox" class="select-item" data-index="${index}"></td>
        `;
    idList.appendChild(row);

    row.querySelector(".show-pw").addEventListener("change", (e) => {
      const pwInput = row.querySelector(".pw-input");
      pwInput.type = e.target.checked ? "text" : "password";
    });
  });
}

// 아이디 추가 버튼 클릭 시
document.getElementById("add-btn").addEventListener("click", () => {
  inputContainer.style.display = "block";
  listContainer.style.display = "none";
  // 입력 창 초기화
  document.getElementById("companyName").value = "";
  document.getElementById("siteName").value = "";
  document.getElementById("userId").value = "";
  document.getElementById("userPw").value = "";
  document.getElementById("memo").value = "";
});

// 아이디 수정 버튼 클릭 시
document.getElementById("edit-btn").addEventListener("click", () => {
  const selected = document.querySelector(".select-item:checked");
  if (selected) {
    selectedIndex = parseInt(selected.dataset.index);
    const ids = JSON.parse(localStorage.getItem("ids")) || [];
    const selectedId = ids[selectedIndex];

    document.getElementById("companyName").value = selectedId.companyName;
    document.getElementById("siteName").value = selectedId.siteName;
    document.getElementById("userId").value = selectedId.userId;
    document.getElementById("userPw").value = selectedId.userPw;
    document.getElementById("memo").value = selectedId.memo;

    inputContainer.style.display = "block";
    listContainer.style.display = "none";
  } else {
    alert("수정할 아이디를 선택하세요.");
  }
});

// 아이디 삭제 버튼 클릭 시
document.getElementById("delete-btn").addEventListener("click", () => {
  const selected = document.querySelector(".select-item:checked");
  if (selected) {
    const index = parseInt(selected.dataset.index);
    const ids = JSON.parse(localStorage.getItem("ids")) || [];
    ids.splice(index, 1);
    localStorage.setItem("ids", JSON.stringify(ids));
    displayIdList();
  } else {
    alert("삭제할 아이디를 선택하세요.");
  }
});

// 초기 목록 표시
displayIdList();