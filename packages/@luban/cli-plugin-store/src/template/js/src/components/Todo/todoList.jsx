import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ToDoList = () => {
  const todoList = useSelector((state) => {
    return state.todo;
  });

  const dispatch = useDispatch();

  return (
    <ul style={{ listStyle: "none" }}>
      {todoList.map((todo) => {
        return (
          <li
            key={todo.id}
            onClick={() => {
              return dispatch.todo.toggleTodo(todo.id);
            }}
          >
            <span role="img" aria-label="img">
              {!todo.completed ? "✅" : "❌"}
            </span>
            <span
              style={{
                display: "inline-block",
                width: "300px",
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button
              style={{ marginLeft: "16px" }}
              onClick={() => dispatch.todo.delTodo(todo.id)}
              type="button"
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export { ToDoList };
