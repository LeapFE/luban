export const delay = (ms) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
};

export const todo = {
  state: [
    {
      id: 1,
      text: "eating",
      completed: false,
    },
    {
      id: 2,
      text: "sleep",
      completed: false,
    },
  ],
  reducers: {
    addTodo: (state, todoItem) => {
      const newTodoList = Array.from(state);
      let id = 1;
      if (newTodoList.length !== 0) {
        id = state[state.length - 1].id + 1;
      }
      newTodoList.push({ id, text: todoItem, completed: false });
      return newTodoList;
    },
    toggleTodo: (state, id) => {
      return state.map((todoItem) => {
        return todoItem.id === id ? { ...todoItem, completed: !todoItem.completed } : todoItem;
      });
    },
    delTodo: (state, id) => {
      return state.filter((todoItem) => {
        return todoItem.id !== id;
      });
    },
  },
  effects: (dispatch) => {
    return {
      async asyncAddTodo(todoItem) {
        await delay(1000);
        dispatch.todo.addTodo(todoItem);
      },
    };
  },
};
