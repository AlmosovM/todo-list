var td = {

    init: function () {
        td.InpuItem = document.getElementById("itemInput")
        td.addTask = document.getElementById("button");
        td.addTask.addEventListener("click", td.addTodo);


        td.List = document.getElementById("List");
        td.filter = document.getElementById("filterid");
        td.filter.addEventListener("change", td.filterTask);
        td.hider = document.getElementById("hideCompleted");
        td.hider.addEventListener("change", td.hidechoosen);

        td.secondcounter = 1;
        td.todotask;
        td.filtereditems;
        td.todoleft;

        td.filtered = [];
        td.todisplay = [];
        td.completed = [];
        td.taskleft = 0;
        td.todos = [];
        td.updatedarr = [];
        td.updatedarr = JSON.parse(localStorage.getItem('numberOftodos'));// updatedarr is arr like keys of todo values
        if (td.updatedarr != null) {
            td.todocounter = td.updatedarr.length;

            for (j = 0; j < td.updatedarr.length; j++) {
                td.todos.push(JSON.parse(localStorage.getItem(td.updatedarr[j])));
            }
        }
        else {
            td.todocounter = 0;

            td.updatedarr = [];
        }

        //localStorage.clear();
        td.fillTodoTasks(td.todos);

    },

    addTodo: function () {
        td.taskleft = 0;
        td.previousels = document.getElementsByClassName('contain');

        while (td.previousels.length > 0) {// clear all tasks
            td.previousels[0].parentNode.removeChild(td.previousels[0]);
        }

        td.todos.push(td.InpuItem.value);
        td.updatedarr.push(td.todocounter);//updatedarr is a key indicator
        td.todocounter++;

        td.fillTodoTasks(td.todos);// recreate all old tasks with the new one
        td.storeTodoTasks(td.todos);
        td.InpuItem.value = "";
    },



    storeTodoTasks: function (arr) {
        for (i = 0; i < arr.length; i++) {
            localStorage.setItem(i, JSON.stringify(arr[i]));// i is a key, todos[i] - value
        }
        localStorage.setItem('numberOftodos', JSON.stringify(td.updatedarr));
    },

    fillTodoTasks: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            td.createItem(arr[i], td.updatedarr[i]);
        }
    },


    createItem: function (x, z) {
        var container = document.createElement('div');
        var leftitem = document.createElement('div');
        leftitem.setAttribute("class", "leftitem");
        container.setAttribute("class", "contain");
        container.setAttribute("id", "contain" + z);// will be filtered according that id

        var button = document.createElement("button");
        button.innerText = "remove";
        button.setAttribute("class", 'removebutton');
        button.setAttribute("id", z);
        button.addEventListener('click', td.DeleteItem)

        var input = document.createElement("input");
        input.type = "checkbox";
        input.setAttribute("id", "in" + z);
        input.setAttribute("class", "inputbox");
        input.addEventListener('change', td.signAscompleted);// to set or remove complteded status

        td.taskleft++;
        td.printTodosnumber(td.taskleft);

        var item = document.createElement("div");// todo text- description
        item.innerText = x;
        item.setAttribute("class", 'task');
        item.setAttribute("id", "sp" + z);

        leftitem.append(input);
        leftitem.append(item);

        container.append(leftitem);
        container.append(button);
        td.List.append(container);

        td.InpuItem.focus()
    },

    printTodosnumber: function (number, filtered = 0) {
        if (filtered === 0) {
            td.msg = `You have in Total ${number} todo left`;
        }
        else {
            td.msg = `You have in Total ${td.taskleft} todo left. You filter ${filtered} tasks.`;
        }

        document.getElementById('todosleft').innerHTML = td.msg;
    },

    signAscompleted: function (e) {

        if (e.target.checked) {
            td.taskleft--;
            e.target.classList.add('signed');

        }
        else {
            td.taskleft++;
            e.target.classList.remove("signed");
        }
        if (td.filtered.length === 0) {
            td.printTodosnumber(td.taskleft);
        }
        else {
            td.printTodosnumber(td.taskleft, td.filtered.length);
        }

    },

    DeleteItem: function (el) {

        var x = el.target.id;
        var spanText = document.getElementById("sp" + x);
        var toremove = spanText.innerHTML;
        var y = document.getElementById("in" + x);

        if (!y.classList.contains("signed")) {
            td.taskleft--;
        }
        td.printTodosnumber(td.taskleft);

        document.getElementById('contain' + x).remove();
        localStorage.removeItem(x);

        var index = td.updatedarr.indexOf(parseInt(x));
        if (index !== -1) td.updatedarr.splice(index, 1);

        var indextodo = td.todos.indexOf(toremove);
        if (indextodo !== -1) td.todos.splice(indextodo, 1);

        localStorage.setItem('numberOftodos', JSON.stringify(td.updatedarr));
    },

    filterTask: function () {

        td.todos = [];// empty array to get updated one - inthecase some todo was deleted

        for (j = 0; j < td.updatedarr.length; j++) {
            td.todos.push(JSON.parse(localStorage.getItem(td.updatedarr[j])));// fill todo by getting items from local by key
        }
        td.updatedarr = JSON.parse(localStorage.getItem('numberOftodos'));// array of keys

        td.gettodoitem(td.todos, td.filter.value);

        while (td.todisplay.length > 0) {// remove all items from todisplay array
            td.todisplay.pop();
        }

        var listtodisplay = document.getElementsByClassName('contain');// all todos
        if (td.filtered.length !== 0) {// in case there some todos match filter - display none all todos
            for (j = 0; j < listtodisplay.length; j++) {
                listtodisplay[j].style.display = 'none';
            }

            for (i = 0; i < td.filtered.length; i++) { // loop for case that there some match of todos to filter

                td.todisplay.push("contain" + td.filtered[i]);// todo container id- with that id todo container will be displayed
                var g = document.getElementById(td.todisplay[i]);
                if (!g.classList.contains('hidden')) {
                    g.style.display = "flex";
                }

            }
        }

        else {// in case no todo match filter - display flex all todos
            for (j = 0; j < listtodisplay.length; j++) {
                if (!listtodisplay[j].classList.contains('hidden')) {
                    listtodisplay[j].style.display = 'flex';
                }
            }
        }

        if (td.filtered.length > 0 && td.filter.value !== "") {
            td.printTodosnumber(td.taskleft, td.filtered.length);
        }
        else if (td.filtered.length === 0 && td.filter.value !== "") {
            td.filtereditems = "Not found any tasks according the filter.";
            document.getElementById('todosleft').innerHTML = td.filtereditems;
        }
        else {
            td.printTodosnumber(td.taskleft);
        }



    },

    gettodoitem: function (arr, text) {
        while (td.filtered.length > 0) {
            td.filtered.pop();
        }
        if (text !== "") {

            for (i = 0; i < arr.length; i++) {
                if (arr[i].includes(text)) {

                    td.filtered.push(td.updatedarr[i]);
                }
            }
        }
    },


    hidechoosen: function (e) {

        if (e.target.checked) {
            var completedtasks = document.getElementsByClassName('signed');
            completed = [];
            for (h = 0; h < completedtasks.length; h++) {
                {
                    completed.push("contain" + completedtasks[h].id.slice(2));// completed is array of contain1,contain2 for example
                }
                for (t = 0; t < completed.length; t++) {
                    var hidecompleted = document.getElementById(completed[t]);
                    hidecompleted.style.display = "none";
                    hidecompleted.classList.add('hidden');
                }
            }
        }
        else {
            var completedtasks = document.getElementsByClassName('signed');
            completed = [];
            for (h = 0; h < completedtasks.length; h++) {
                {
                    completed.push("contain" + completedtasks[h].id.slice(2));// completed is array of contain1,contain2 for example
                }
                for (t = 0; t < completed.length; t++) {
                    var hidecompleted = document.getElementById(completed[t]);
                    hidecompleted.style.display = "flex";
                    hidecompleted.classList.remove('hidden');
                }
            }
        }
    },



}
window.addEventListener("load", td.init);