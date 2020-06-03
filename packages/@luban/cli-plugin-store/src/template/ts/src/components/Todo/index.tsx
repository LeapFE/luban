import React, { FunctionComponent } from "react";

import { AddTodo } from "./addTodo";
import { ToDoList } from "./todoList";

const Todo: FunctionComponent = () => {
  return (
    <div
      style={{
        border: "2px solid rgb(93, 93, 93)",
        borderRadius: "20px",
        padding: "0 20px",
        margin: "16px 0",
      }}
    >
      <h5>
        <span role="img" aria-label="img">
          🌰&nbsp;
        </span>
        A simple TODO application based on&nbsp;
        <a href="https://rematch.github.io/rematch">rematch</a>
      </h5>
      <AddTodo />
      <ToDoList />
    </div>
  );
};

export { Todo };
