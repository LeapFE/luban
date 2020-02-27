import React, { useState } from "react";
import { useDispatch } from "react-redux";

const AddTodo = () => {
  const dispatch = useDispatch();

  const [value, setValue] = useState("");

  const handleSubmit = (event, asyncMode) => {
    event.preventDefault();

    if (!value.trim()) {
      return;
    }

    setValue("");

    if (asyncMode) {
      dispatch.todo.asyncAddTodo(value);
      return;
    }

    dispatch.todo.addTodo(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const buttonStyle = {
    height: "30px",
    marginRight: "10px",
    borderRadius: "6px",
    outline: "none",
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input style={buttonStyle} value={value} onChange={handleChange} />
        <button style={{ cursor: "pointer", ...buttonStyle }} type="submit">
          Add Todo
        </button>
        <button
          style={{ cursor: "pointer", ...buttonStyle }}
          onClick={(event) => handleSubmit(event, true)}
          type="button"
        >
          Async Add Todo(1 s delay)
        </button>
      </form>
    </div>
  );
};

export { AddTodo };
