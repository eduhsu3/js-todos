//영어복수표현 s 를 사용하지 않는다. totoList 하지않는다. --> 모든것은 todo 로한다.
let todoArray = [];

const spreadData = {
    id: null,
    isDone: false,
};

//=====================================================
//=====================================================

// 로컬 스토리지에 저장
function saveLocalStorage() {
    localStorage.setItem('todoList', JSON.stringify(todoArray));
}

// 로컬 스토리지에서 불러오기
function getLocalStorage() {
    const storageData = localStorage.getItem('todoList');
    if (storageData) {
        todoArray = JSON.parse(storageData);
    }
}

//=====================================================
//=====================================================

const dataControl = {
    getData: function () {
        getLocalStorage();
        return todoArray;
    },

    addData: function (prmTodo) {
        todoArray.push(prmTodo);
    },
    removeData: function (prmUID) {
        todoArray = todoArray.filter((item) => item.id !== prmUID);
    },
};

//=====================================================
//=====================================================

//input 엔터키처리
const inputEle = document.getElementById('todo-input');
inputEle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

//UID 제너레이터
function generateUID() {
    const date = new Date();
    return date.getTime().toString();
}
//추가
function addTodo() {
    const inputEle = document.getElementById('todo-input');
    const inputValue = inputEle.value.trim();

    if (inputValue === '') {
        alert('할 일을 입력해주세요.');
        inputEle.focus();
        return;
    }

    dataControl.addData({
        ...spreadData,
        id: generateUID(),
        text: inputValue,
    });

    inputEle.value = '';
    saveLocalStorage();
    updateTodoList();
    //console.table(todoArray);
}
//삭제
function removeTodo(prmUID) {
    dataControl.removeData(prmUID);
    saveLocalStorage();
    updateTodoList();
    //console.table(todoArray);
}

//isDone
function changeIsDone(prmUID) {
    const foundTodo = dataControl.getData().find((item) => item.id === prmUID);
    foundTodo.isDone = !foundTodo.isDone;
    saveLocalStorage();
    updateTodoList();
    //console.table(todoArray);
}

//할일 글 수정
function changeText(prmUID, originText) {
    const modifiedText = prompt('할일 수정', originText);
    if (modifiedText !== null) {
        const trimedText = modifiedText.trim();
        if (trimedText !== '' && trimedText !== originText) {
            const foundTodo = dataControl.getData().find((item) => item.id === prmUID);
            foundTodo.text = trimedText;
            saveLocalStorage();
            updateTodoList();
            //console.table(todoArray);
        }
    }
}

//화면업데이트
function updateTodoList() {
    const ul = document.getElementById('todo-list');
    const template = document.getElementById('todo-item-template').content;
    ul.innerHTML = '';
    dataControl.getData().forEach((item) => {
        const clone = document.importNode(template, true);
        clone.querySelector('.todo-item').id = item.id;
        clone.querySelector('.text').innerText = item.text;
        clone.querySelector('.delete-btn').addEventListener('click', () => removeTodo(item.id));
        clone.querySelector('.modify-btn').addEventListener('click', function () {
            thisUID = this.closest('.todo-item').id;
            changeText(thisUID, item.text);
        });
        clone.querySelector('.is-done-checkbox').checked = item.isDone;
        clone.querySelector('.is-done-checkbox').addEventListener('change', function (e) {
            //e.stopPropagation();
            thisUID = this.closest('.todo-item').id;
            changeIsDone(thisUID);
        });

        ul.appendChild(clone);
    });
}

//최초 로컬스토리지 데이터 가져와서 화면그려주기
getLocalStorage();
updateTodoList();

//=====================================================
//=====================================================

// 시간과 날짜를 업데이트하는 함수
function updateDateTime() {
    const now = new Date();
    const dateElement = document.getElementById('date');
    const dayElement = document.getElementById('day');
    const timeElement = document.getElementById('time');
    const weatherElement = document.getElementById('weather');

    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dayOfWeek = now.getDay(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 요일을 문자열로 변환
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeekStr = weekdays[dayOfWeek];

    // 날짜 출력
    dateElement.textContent = `${year}년 ${month}월 ${day}일`;

    // 요일 출력
    dayElement.textContent = `(${dayOfWeekStr}요일)`;

    // 시간 출력
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    timeElement.textContent = formattedTime;
}

// 1초마다 실행
setInterval(updateDateTime, 1000);
// 최초 한번 실행
updateDateTime();

//=====================================================
//=====================================================

// 날씨 업데이트 함수
function updateWeather() {
    const weatherElement = document.getElementById('weather');
    const iconSection = document.querySelector('.icon');
    const apiKey = 'f66b13dcadd6f056d8dea5ea8d68eed7';
    const city = 'Daegu'; // 날씨를 가져올 도시 이름
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=kr&units=metric`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            const weatherDescription = data.weather[0].description;
            weatherElement.textContent = `날씨: ${weatherDescription}`;
            const icon = data.weather[0].icon;
            const iconURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            iconSection.setAttribute('src', iconURL);
        })
        .catch((error) => {
            console.error('날씨 정보를 가져오는 중 에러 발생:', error);
            weatherElement.textContent = '날씨 정보를 가져올 수 없습니다.';
        });
}
updateWeather();
