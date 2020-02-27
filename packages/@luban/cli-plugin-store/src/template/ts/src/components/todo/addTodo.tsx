import React, { FunctionComponent, FormEvent, useState, ChangeEvent, MouseEvent, CSSProperties } from "react";
import { useDispatch } from "react-redux";

import { Dispatch } from "../../models/store";

const AddTodo: FunctionComponent = () => {
  const dispatch = useDispatch<Dispatch>();

  const [value, setValue] = useState<string>("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
    asyncMode?: boolean,
  ): void => {
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const buttonStyle: CSSProperties = {
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
          onClick={(event: MouseEvent<HTMLButtonElement>) => handleSubmit(event, true)}
          type="button"
        >
          Async Add Todo(1 s delay)
        </button>
      </form>
    </div>
  );
};

export { AddTodo };
