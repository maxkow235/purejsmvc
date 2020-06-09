import '../styles/index.scss';

class Model {
  constructor() {
    this.todos = [];
    if (typeof localStorage.getItem('todos') !== null)
      localStorage.setItem('todos', JSON.stringify(this.todos));
    else this.todos = JSON.parse(localStorage.getItem('todos'));
  }

  bindRenderTodos(callback) {
    this.renderTodos = callback;
  }

  refreshLocalTodos(todos) {
    this.renderTodos(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addTodo(description) {
    const prevItem = this.todos[this.todos.length - 1];
    this.todos.push({
      id: prevItem ? prevItem.id + 1 : 1,
      description,
    });
    this.refreshLocalTodos(this.todos);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.refreshLocalTodos(this.todos);
  }
}

class View {
  constructor() {
    this.listContainer = document.querySelector('div#listWrapper');
    this.form = document.querySelector('#addTodoForm');
  }

  renderTodos(todos) {
    let listHTML = 'No todos Found';
    if (todos.length > 0)
      listHTML = todos
        .map(
          (todo) =>
            `<div id="${todo.id}" class="todo"><span class="todo-description">${todo.description}</span><button class="delete-btn">X</button></div>`
        )
        .join('');

    this.listContainer.innerHTML = listHTML;
  }

  onAddTodo(handler) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = this.form.children[0].value;
      if (description !== '') handler(description);
    });
  }

  onDeleteTodo(handler) {
    this.listContainer.addEventListener('click', (e) => {
      if (e.srcElement.className === 'delete-btn') {
        const id = parseInt(e.target.parentElement.id);

        handler(id);
      }
    });
  }
}

class Controller {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.model.bindRenderTodos(this.view.renderTodos.bind(this.view));

    this.view.renderTodos(this.model.todos);
    this.initEnvents();
  }

  initEnvents() {
    this.view.onAddTodo(this.model.addTodo.bind(this.model));
    this.view.onDeleteTodo(this.model.deleteTodo.bind(this.model));
  }
}

const app = new Controller(new View(), new Model());
