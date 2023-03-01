(() => {

    let tasks = [];
    let tasksItem = '';

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.setAttribute("disabled", "disabled");
        button.textContent = 'Добавить дело';

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(elem) {
        let item = document.createElement('li');

        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('bitton');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        item.textContent = elem.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (elem.done) {
            item.classList.add('list-group-item-success');
        }

        doneButton.addEventListener('click', () => {
            item.classList.toggle('list-group-item-success');

            for (const items of tasks) {
                if (items.id === elem.id) {
                    items.done = !items.done;
                }
            }
            addTask(tasks, tasksItem);
        });
        deleteButton.addEventListener('click', () => {
            if (confirm('Вы уверены?')) {
                item.remove();

                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i].id === elem.id) {
                        tasks.splice(i, 1);
                    }
                }
                addTask(tasks, tasksItem);
            }
        });

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton
        }
    }

    function addTask(array, keyTask) {
        localStorage.setItem(keyTask, JSON.stringify(array))
    }

    function createTodoApp(container, title, keyTask, def = []) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        tasksItem = keyTask;
        tasks = def;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if (localStorage.getItem(tasksItem)) {
            tasks = JSON.parse(localStorage.getItem(tasksItem));
        }

        for (const itemLocal of tasks) {
            let todoItem = createTodoItem(itemLocal);
            todoList.append(todoItem.item);
        }

        todoItemForm.form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            };

            let task = {
                id: new Date().getTime(),
                name: todoItemForm.input.value,
                done: false
            };

            let todoItem = createTodoItem(task);

            tasks.push(task);

            addTask(tasks, tasksItem);

            todoList.append(todoItem.item);

            todoItemForm.input.value = '';
            document.querySelector('.btn-primary').setAttribute("disabled", "disabled");
        });

        todoItemForm.input.addEventListener('keyup', () => {
            if (todoItemForm.input.value) {
                document.querySelector('.btn-primary').removeAttribute("disabled");
            } else {
                document.querySelector('.btn-primary').setAttribute("disabled", "disabled");
            }
        });
    }

    window.createTodoApp = createTodoApp;
})();
