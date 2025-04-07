const loginSignupContainer = document.getElementById("login-signup-container");
const inputContainer = document.getElementById("input-container");
const listContainer = document.getElementById("list-container");
const userListContainer = document.getElementById("user-list-container");
const idList = document.getElementById("id-list");
const userList = document.getElementById("user-list");
const loginMessage = document.getElementById("login-message");

// 사용 시간 설정 관련 요소
const timeSettingInput = document.getElementById('timeSetting');
const setTimeButton = document.getElementById('setTime');
const usageTimeDisplay = document.getElementById('usage-time-display');

let selectedIndex = -1;
let editMode = false;

// 사용 시간 관련 변수
let usageTimeLimit = localStorage.getItem('usageTimeLimit') ? parseInt(localStorage.getItem('usageTimeLimit')) : 0;
let startTime = null;
let elapsedTime = localStorage.getItem('elapsedTime') ? parseInt(localStorage.getItem('elapsedTime')) : 0;
let intervalId = null;

// Service Worker 등록
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service_worker.js')
        .then(registration => console.log('Service worker registration successful:', registration))
        .catch(error => console.log('Service worker registration failed:', error));
}

// DOM 로드 완료 시 실행
document.addEventListener("DOMContentLoaded", () => {
    // 사용 시간 설정 버튼 이벤트 리스너
    if (setTimeButton) {
        setTimeButton.addEventListener('click', () => {
            const timeInputValue = parseInt(timeSettingInput.value);
            if (!isNaN(timeInputValue) && timeInputValue > 0) {
                usageTimeLimit = timeInputValue;
                localStorage.setItem('usageTimeLimit', usageTimeLimit);
                elapsedTime = 0;
                localStorage.setItem('elapsedTime', elapsedTime);
                startTracking();
                updateUsageTimeDisplay();
            } else {
                alert('유효한 사용 시간을 입력해주세요.');
                timeSettingInput.value = usageTimeLimit || 0;
            }
        });
    }

    // 로그인 버튼 클릭 시
    document.getElementById("login-btn").addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            loginSignupContainer.style.display = "none";
            listContainer.style.display = "block";
            displayIdList();
        } else {
            loginMessage.textContent = "아이디 또는 비밀번호가 일치하지 않습니다.";
        }
    });

    // 회원가입 버튼 클릭 시
    document.getElementById("signup-btn").addEventListener("click", () => {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.find(u => u.username === username)) {
            loginMessage.textContent = "이미 사용 중인 아이디입니다.";
            document.getElementById("user-list-btn").style.display = "block";
            return;
        }

        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        loginMessage.textContent = "회원가입이 완료되었습니다.";
        loginSignupContainer.style.display = "none";
        inputContainer.style.display = "block";
        clearInputFields();
    });

    // 등록 사용자 목록 버튼 클릭 시
    document.getElementById("user-list-btn").addEventListener("click", () => {
        loginSignupContainer.style.display = "none";
        userListContainer.style.display = "block";
        displayUserList();
    });

    // 아이디 추가 버튼 클릭 시
    document.getElementById("add-btn").addEventListener("click", () => {
        inputContainer.style.display = "block";
        listContainer.style.display = "none";
        userListContainer.style.display = "none";
        clearInputFields();
    });

    // 아이디 저장 버튼 클릭 시
    document.getElementById("save-id-btn").addEventListener("click", () => {
        const companyName = document.getElementById("companyName").value;
        const siteName = document.getElementById("siteName").value;
        const userId = document.getElementById("userId").value;
        const userPw = document.getElementById("userPw").value;
        const memo = document.getElementById("memo").value;

        if (companyName && siteName && userId && userPw && memo) {
            const ids = JSON.parse(localStorage.getItem("ids")) || [];
            ids.push({ companyName, siteName, userId, userPw, memo });
            localStorage.setItem("ids", JSON.stringify(ids));
            inputContainer.style.display = "none";
            listContainer.style.display = "block";
            displayIdList();
        } else {
            alert("모든 필드를 입력하세요: 회사명, 사이트명, 아이디, 비밀번호, 메모");
        }
    });

    // 아이디 수정 버튼 클릭 시
    document.getElementById("edit-btn").addEventListener("click", () => {
        const selected = document.querySelector(".select-item:checked");
        if (selected) {
            selectedIndex = parseInt(selected.dataset.index);
            const ids = JSON.parse(localStorage.getItem("ids")) || [];
            if (editMode) {
                const companyName = document.getElementById("companyName").value;
                const siteName = document.getElementById("siteName").value;
                const userId = document.getElementById("userId").value;
                const userPw = document.getElementById("userPw").value;
                const memo = document.getElementById("memo").value;

                ids[selectedIndex] = { companyName, siteName, userId, userPw, memo };
                localStorage.setItem("ids", JSON.stringify(ids));
                editMode = false;
                document.getElementById("edit-btn").textContent = "아이디 수정";
                inputContainer.style.display = "none";
                listContainer.style.display = "block";
                displayIdList();
            } else {
                editMode = true;
                document.getElementById("edit-btn").textContent = "수정 확정";
                inputContainer.style.display = "block";
                listContainer.style.display = "none";
                const item = ids[selectedIndex];
                document.getElementById("companyName").value = item.companyName;
                document.getElementById("siteName").value = item.siteName;
                document.getElementById("userId").value = item.userId;
                document.getElementById("userPw").value = item.userPw;
                document.getElementById("memo").value = item.memo;
            }
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

    // 취소 버튼 클릭 시
    document.getElementById("cancel-btn").addEventListener("click", () => {
        inputContainer.style.display = "none";
        listContainer.style.display = "block";
        clearInputFields();
        if (editMode) {
            editMode = false;
            document.getElementById("edit-btn").textContent = "아이디 수정";
        }
    });

    // 사용자 수정 버튼 클릭 시
    document.getElementById("edit-user-btn").addEventListener("click", () => {
        const selected = document.querySelector(".select-user:checked");
        if (selected) {
            if (!editMode) {
                editMode = true;
                document.getElementById("edit-user-btn").textContent = "수정 확정";
                const usernameSpan = selected.closest("tr").querySelector(".username");
                const passwordSpan = selected.closest("tr").querySelector(".password");
                usernameSpan.style.display = "none";
                passwordSpan.style.display = "none";
                selected.closest("tr").querySelector(".username-input").style.display = "block";
                selected.closest("tr").querySelector(".password-input").style.display = "block";
            } else {
                editMode = false;
                document.getElementById("edit-user-btn").textContent = "사용자 수정";
                const usernameInput = selected.closest("tr").querySelector(".username-input");
                const passwordInput = selected.closest("tr").querySelector(".password-input");
                const usernameSpan = selected.closest("tr").querySelector(".username");
                const passwordSpan = selected.closest("tr").querySelector(".password");

                const newUsername = usernameInput.value;
                const newPassword = passwordInput.value;

                const index = parseInt(selected.dataset.index);
                const users = JSON.parse(localStorage.getItem("users")) || [];
                users[index].username = newUsername;
                users[index].password = newPassword;
                localStorage.setItem("users", JSON.stringify(users));

                usernameSpan.textContent = newUsername;
                passwordSpan.textContent = newPassword;
                usernameSpan.style.display = "block";
                passwordSpan.style.display = "block";
                usernameInput.style.display = "none";
                passwordInput.style.display = "none";

                displayUserList();
            }
        } else {
            alert("수정할 사용자를 선택하세요.");
        }
    });

    // 사용자 삭제 버튼 클릭 시
    document.getElementById("delete-user-btn").addEventListener("click", () => {
        const selected = document.querySelector(".select-user:checked");
        if (selected) {
            const index = parseInt(selected.dataset.index);
            const users = JSON.parse(localStorage.getItem("users")) || [];
            users.splice(index, 1);
            localStorage.setItem("users", JSON.stringify(users));
            displayUserList();
        } else {
            alert("삭제할 사용자를 선택하세요.");
        }
    });

    // 처음 버튼 클릭 시
    document.getElementById("home-btn").addEventListener("click", () => {
        userListContainer.style.display = "none";
        loginSignupContainer.style.display = "block";
        inputContainer.style.display = "none";
        listContainer.style.display = "none";
    });
});

// 입력 필드 초기화 함수
function clearInputFields() {
    document.querySelectorAll(".input").forEach(input => input.value = "");
}

// 사용 시간 관련 함수들
function startTracking() {
    if (intervalId) clearInterval(intervalId);
    startTime = Date.now() - elapsedTime;
    intervalId = setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
    elapsedTime = Date.now() - startTime;
    localStorage.setItem('elapsedTime', elapsedTime);
    updateUsageTimeDisplay();
    checkUsageLimit();
}

function updateUsageTimeDisplay() {
    if (usageTimeDisplay) {
        const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
        usageTimeDisplay.textContent = `현재 사용 시간: ${elapsedMinutes}분 / ${usageTimeLimit}분`;
    }
}

function checkUsageLimit() {
    const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
    if (usageTimeLimit > 0 && elapsedMinutes >= usageTimeLimit) {
        clearInterval(intervalId);
        alert('설정된 사용 시간을 초과했습니다!');
    }
}

window.addEventListener('load', () => {
    if (usageTimeLimit > 0 && localStorage.getItem('startTime')) {
        startTime = parseInt(localStorage.getItem('startTime'));
        startTracking();
    } else if (usageTimeLimit > 0 && !localStorage.getItem('elapsedTime')) {
        startTracking();
    }
    updateUsageTimeDisplay();
    timeSettingInput.value = usageTimeLimit || 0;
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('startTime', Date.now() - elapsedTime);
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
            <td><input type="password" value="${item.userPw}" class="pw-input"> <input type="checkbox" class="show-pw"></td>
            <td>${item.memo}</td>
            <td><input type="checkbox" class="select-item" data-index="${index}"></td>
        `;
        idList.appendChild(row);

        row.querySelector(".show-pw").addEventListener("change", (e) => {
            const pwInput = row.querySelector(".pw-input");
            pwInput.type = e.target.checked ? "text" : "password";
        });
    });
}

// 사용자 목록 표시 함수
function displayUserList() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    userList.innerHTML = "";
    users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="username">${user.username}</span><input type="text" class="username-input" value="${user.username}" style="display: none;"></td>
            <td>${user.username}</td>
            <td><span class="password">${user.password}</span><input type="password" class="password-input" value="${user.password}" style="display: none;"></td>
            <td><input type="checkbox" class="select-user" data-index="${index}"></td>
        `;
        userList.appendChild(row);
    });
}