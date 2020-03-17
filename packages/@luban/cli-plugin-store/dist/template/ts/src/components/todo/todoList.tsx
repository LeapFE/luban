/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Dispatch, RootState } from "@/models/store";

import { TodoItem } from "@/models/todo";

const ToDoList: FunctionComponent = () => {
  const todoList = useSelector((state: RootState) => {
    return state.todo;
  });

  const dispatch = useDispatch<Dispatch>();

  return (
    <ul style={{ listStyle: "none" }}>
      {todoList.map((todo: TodoItem) => {
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
