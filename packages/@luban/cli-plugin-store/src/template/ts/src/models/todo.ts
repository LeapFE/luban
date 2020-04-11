import { Dispatch } from "./index";

export type TodoItem = { id: number; text: string; completed: boolean };
export type TodoState = Array<TodoItem>;

export const delay = (ms: number): Promise<void> => {
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
  ] as TodoState,
  reducers: {
    addTodo: (state: TodoState, todoItem: string): TodoState => {
      const newTodoList = Array.from(state);
      let id = 1;
      if (newTodoList.length !== 0) {
        id = state[state.length - 1].id + 1;
      }
      newTodoList.push({ id, text: todoItem, completed: false });
      return newTodoList;
    },
    toggleTodo: (state: TodoState, id: number): TodoState => {
      return state.map((todoItem: TodoItem) => {
        return todoItem.id === id ? { ...todoItem, completed: !todoItem.completed } : todoItem;
      });
    },
    delTodo: (state: TodoState, id: number): TodoState => {
      return state.filter((todoItem: TodoItem) => {
        return todoItem.id !== id;
      });
    },
  },
  effects: (dispatch: Dispatch) => {
    return {
      async asyncAddTodo(todoItem: string): Promise<void> {
        await delay(1000);
        dispatch.todo.addTodo(todoItem);
      },
    };
  },
};
