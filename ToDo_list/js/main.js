const toDoList = {
    tasks: [],
    counterObj: {
        counter: 0
    },

    newTask(text) {
        let isNotUnique = false;
        this.tasks.forEach(elem => {
            if (elem.text === text) {
                isNotUnique = true;
            }
        });

        if (isNotUnique) {
            console.log('Такая запись уже есть');
            return -1;
        } else {
            this.tasks.push({
                UniqueID: ++this.counterObj.counter,
                status: false,
                time: new Date().getTime(),
                text: text
            });
        }
    },


    deleteTask(UniqueID) {
        let deletedIndex = this.findAnIndex(UniqueID);
        if (deletedIndex === -1) {
            console.log('Вы пытаетесь удалить несуществующую запись');
        } else {
            let answer = confirm('Удалить запись?');
            if (answer) {
                this.tasks.splice(deletedIndex, 1)
            } else {
                console.log('отмена');
                return -1;
            }
        }
    },

    editTask(UniqueID, newText) {
        let editedIndex = this.findAnIndex(UniqueID);
        let isNotUnique = false;
        this.tasks.forEach(elem => {
            if (elem.text === newText) {
                isNotUnique = true;
            }
        });

        if (editedIndex === -1) {
            console.log('Вы пытаетесь редактировать несуществующую запись');
            return -2;
        } else if (isNotUnique) {
            console.log('Такая запись уже есть');
            return -1;
        } else {
            let answer = confirm('Изменить запись?');
            if (answer) {
                this.tasks[editedIndex].text = newText;
            } else {
                return -3;
            }
        }
    },

    completeThisTask(UniqueID) {
        let completeIndex = this.findAnIndex(UniqueID);
        if (completeIndex === -1) {
            console.log('Вы пытаетесь выполнить несуществующую запись');
        } else {
            this.tasks[completeIndex].status = true;
        }
    },

    unCompleteThisTask(UniqueID) {
        let completeIndex = this.findAnIndex(UniqueID);

        if (completeIndex === -1) {
            console.log('Вы пытаетесь отменить выполнение несуществующей записи');
        } else {
            this.tasks[completeIndex].status = false;
        }
    },

    findAnIndex(UniqueID) {
        let resIndex = this.tasks.findIndex((element, index) => {
            return element.UniqueID === UniqueID;
        });
        return resIndex;
    },

    totalCompletedTasks() {
        let result = this.tasks.reduce((acum, elem) => {
            if (elem.status === true) {
                acum++
            }
            return acum
        }, 0);
        return result;
    },

    totalneedToDoTasks() {
        let result = this.tasks.reduce((acum, elem) => {
            if (elem.status === false) {
                acum++
            }
            return acum
        }, 0);
        return result;
    },

    totalInfo() {
        let resArr = [];
        resArr.push(['total', this.tasks.length]);
        resArr.push(['completed', this.totalCompletedTasks()]);
        resArr.push(['needToDo', this.totalneedToDoTasks()]);

        return resArr;
    },

};


Object.freeze(toDoList);


addNewTaskButton.onclick = function () {
    let access = document.getElementById("main");
    let task = prompt('Введите задачу', 'новая задача');
    if (task === null || task === undefined) {
        console.log('отмена');
        return
    }
    let func = toDoList.newTask(task);
    let ID = toDoList.counterObj.counter;
    if (func === -1) {
        alert('такая задача уже есть');
    } else {
        access.innerHTML += `
        <div class="task-self" id="task-self${ID}"> 
            <div class="number" id="number${ID}">${ID}</div> 
            <div class="task" id="task${ID}">${task}</div> 
            <div class="option">
                <div> <button class="delete-button">&#10006;</button></div> 
                <div> <button class="flag-button" id='flag${ID}'>&#10004;	</button></div>
                <div> <button class="edit-button">&#9998;</button></div>
            </div> 
        </div>`;
        setAllInfo();

    }
}


main.onclick = function (event) {
    if (event.target.className === 'delete-button') {
        return
    };


};

main.onclick = function (event) {
    if (event.target.className !== 'edit-button' &&
        event.target.className !== 'delete-button' &&
        event.target.className !== 'flag-button'
    ) {
        return;
    };

    //ограничим область действия
    let task = event.target.closest('.task-self');

    //выймем ID из общего таска
    let id = Number(task.querySelector('.number').innerText);

    if (event.target.className === 'delete-button') {
        let del = toDoList.deleteTask(id);
        if (del === -1) {
            return
        } else {
            task.remove();
            setAllInfo();
        }
    } else if (event.target.className === 'edit-button') {
        //найдем положение текста
        let text = document.getElementById(`task${id}`);

        let newText = prompt('Введите задачу', text.innerText);
        if (newText === null || newText === undefined) {
            console.log('просто отмена', newText);
            return
        };

        let func = toDoList.editTask(id, newText);
        if (func === -1) {
            alert('такая задача уже есть');
        } else if (func === -2) {
            console.log('Вы пытаетесь редактировать несуществующую запись');
        } else if (func === -3) {
            console.log('отмена изменения');
        } else {
            text.innerHTML = newText;
        };

    } else if (event.target.className === 'flag-button') {
        let index = toDoList.findAnIndex(id);
        let flag = toDoList.tasks[index].status;
        console.log(flag);



        if (flag === false) {
            toDoList.completeThisTask(id);
            let access = document.getElementById(`flag${id}`);
            access.style.backgroundColor = "green";
            setAllInfo();




        } else {
            toDoList.unCompleteThisTask(id);
            let access = document.getElementById(`flag${id}`);
            access.style.backgroundColor = "red";
            setAllInfo()
        };


    };








};


function setAllInfo() {
    let allTasks = document.getElementById(`total-amount`);
    allTasks.innerHTML = toDoList.tasks.length;

    let needToDo = document.getElementById(`total-need-to-do`);
    needToDo.innerHTML = toDoList.totalneedToDoTasks();

    let completed = document.getElementById(`total-complete`);
    completed.innerHTML = toDoList.totalCompletedTasks();
};