let allTasks = [];
let activeEditTask = null;
const url = 'http://localhost:5000';
const fetchHeaders = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
}

window.onload = async () => {
  try {
    input = document.getElementById('add-task');
    const resp = await fetch(`${url}/tasks`);
    const result = await resp.json();
    console.log(result);
    allTasks = result;
    render();
  } catch {
    console.error('Task retrieval error');
  }
}

const taskAdd = async () => {
  try {
    const input = document.getElementById("add-task");
    const input2 = document.getElementById("add-task2")
    if (!input) {
      return;
    }

    const resp = await fetch(`${url}/tasks`, {
      method: 'POST',
      headers: fetchHeaders,
      body: JSON.stringify({
        text: input.value,
        cost: input2.value,
        date: new Date().toLocaleDateString('ru')
      })
    });

    const result = await resp.json();
    allTasks.unshift(result);
    input.value = '';
    input2.value = '';
    render();
  } catch {
    console.error('Task send error');
  }
}


const cancelEdit = (item) => {
  activeEditTask = null
  render();
}

const onDeleteTask = async (_id) => {
  try {
    const resp = await fetch(`${url}/task/${_id} `, {
      method: 'DELETE',
      headers: fetchHeaders
    });

    const result = await resp.json();
    if (result.deletedCount > 0) {
      allTasks = allTasks.filter(item => (item._id !== _id));
    }

    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
  } catch {
    console.error('Failed delete task');
  }
}

const updateTaskText = async (_id) => {
  try {
    const input = document.querySelector(`#task-${_id} input`);
    if (!input || !input.value) {
      return;
    }

    const resp = await fetch(`${url}/task/${_id}/text`, {
      method: 'PATCH',
      headers: fetchHeaders,
      body: JSON.stringify({
        text: input.value,
      })
    });

    const result = await resp.json();

    allTasks.forEach(item => {
      if (item._id === result._id) {
        item.text = result.text;
      }
    });
    render();
  } catch {
    console.error('Fail to change text');
  }
}

const updateTaskCost = async (_id) => {
  try {
    const input = document.querySelector(`#task__cost_input-${_id}`);
    if (!input || !input.value) {
      return;
    }

    const resp = await fetch(`${url}/task/${_id}/cost`, {
      method: 'PATCH',
      headers: fetchHeaders,
      body: JSON.stringify({
        cost: input.value,
      })
    });

    const result = await resp.json();

    allTasks.forEach(item => {
      if (item._id === result._id) {
        item.cost = result.cost;
      }
    });
    render();
  } catch {
    console.error('Fail to change cost');
  }
}

const updateTaskDate = async (_id) => {
  try {
    const input = document.querySelector(`#task__date_input-${_id}`);
    if (!input || !input.value) {
      return;
    }

    const resp = await fetch(`${url}/task/${_id}/date`, {
      method: 'PATCH',
      headers: fetchHeaders,
      body: JSON.stringify({
        date: input.value
      })
    });
    const result = await resp.json();

    allTasks.forEach(item => {
      if (item._id === result._id) {
        item.date = result.date;
      }
    });
    render();
  } catch {
    console.error('Fail to change date');
  }
}

const allDelete = async () => {
  try {
    const resp = await fetch(`${url}/tasks`, {
      method: 'DELETE',
    })
    allTasks = [];
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    render();
  } catch {
    console.error('Failed delete tasks');
  }
}

const editTask = (item) => {
  const { _id, text, cost, date } = item
  const task = document.getElementById(`task-${_id}`);

  const cancel = document.createElement('img');
  const buttonCancelEdit = document.createElement('button');
  const buttonDoneTask = document.createElement('button');
  const imageDone = document.createElement('img');
  const newTask = document.createElement('div');
  const newText = document.createElement('input');
  const newCost = document.createElement('input');
  const newDate = document.createElement('input');
  newCost.type = 'number';
  const buttonsNewTask = document.createElement('div');

  newDate.id = `task__date_input-${_id}`;
  newDate.className = 'tasl__input_date';
  newDate.value = date;
  newText.id = `task__text_input-${_id}`;
  newText.className = 'task__input_text';
  newText.value = text;
  newCost.id = `task__cost_input-${_id}`;
  newCost.className = 'task__input_cost';
  newCost.value = cost;
  newTask.className = 'header__task';
  newTask.id = `task-${_id}`;

  imageDone.src = 'img/done.svg';
  buttonDoneTask.id = `task_button_done${_id}`;
  imageDone.alt = '';
  buttonDoneTask.onclick = () => {
    updateTaskCost(_id);
    updateTaskDate(_id);
    updateTaskText(_id);
  };
  buttonDoneTask.append(imageDone);

  cancel.src = 'img/cancel.svg';
  buttonCancelEdit.id = `task_cancel${_id}`;
  cancel.alt = '';
  buttonCancelEdit.onclick = (item) => {
    cancelEdit(item);
  };
  buttonCancelEdit.append(cancel);

  buttonsNewTask.append(buttonDoneTask);
  buttonsNewTask.append(buttonCancelEdit);
  newTask.append(newText, newDate, newCost, buttonsNewTask);
  task.replaceWith(newTask)
}

const render = () => {
  const content = document.getElementById('content-page');
  content.replaceChildren([]);
  let allSum = document.createElement('h4');
  let sum = 0;
  for (let i = 0; i < allTasks.length; i++) {
    sum += allTasks[i].cost;
  }
  allSum.className = 'allSum';
  allSum.innerText = `Итого: ${sum} p`;
  content.append(allSum);


  allTasks.forEach((item, index) => {
    const { text, cost, _id, date } = item;

    const container = document.createElement('div');
    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    const task = document.createElement('div');
    task.className = 'task-div'
    container.id = `task-${_id}`;
    container.className = 'task-container';

    const newText = document.createElement('p');
    const newCost = document.createElement('p');
    const newDate = document.createElement('p');
    newDate.innerText = date;
    newCost.innerText = cost + 'p';
    newText.innerText = `${index + 1}) Магазин "${text}"`;
    newText.className = 'text-task';
    newCost.className = 'cost-task';
    newDate.className = 'date-task'

    const imageEdit = document.createElement('img');
    const buttonEditTask = document.createElement('button');
    buttonEditTask.className = 'buttonEdit'
    imageEdit.src = 'img/edit.svg';
    buttonEditTask.id = `task_button_edit${_id}`;
    imageEdit.alt = '';
    buttonEditTask.onclick = () => {
      editTask(item);
    };
    buttonEditTask.append(imageEdit);

    const imageDelete = document.createElement('img');
    const buttonDeleteTask = document.createElement('button');
    imageDelete.src = 'img/delete.svg';
    buttonDeleteTask.id = `task_button_delete${_id}`
    imageDelete.alt = '';
    buttonDeleteTask.onclick = () => {
      onDeleteTask(_id);
    };
    buttonDeleteTask.append(imageDelete);

    buttons.append(buttonEditTask, buttonDeleteTask)
    task.append(newText, newDate, newCost, buttons);
    container.append(task);
    content.append(container);
  });

}

