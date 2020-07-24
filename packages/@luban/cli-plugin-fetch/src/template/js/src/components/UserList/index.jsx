import React, { useState } from "react";
import { useRequest } from "@luban-hooks/use-request";

import { getUserList, addUser, delUser } from "@/service/api/user";

const style = {
  height: "30px",
  outline: "none",
  border: "none",
  borderRadius: "4px",
  marginRight: "12px",
  fontSize: "16px",
};

const UserList = () => {
  const [value, setValue] = useState("");

  const { data: userList, run: fetchUserList } = useRequest(getUserList, {
    initialData: [],
    defaultParams: {},
    formatter: (res) => res.data.data,
  });

  const { run: putAddUser } = useRequest(addUser, {
    manual: true,
    onSuccess: (_, __, res) => {
      if (res.data.code === 1) {
        fetchUserList({});
        setValue("");
      }
    },
  });

  const { run: putDelUser } = useRequest(delUser, {
    manual: true,
    onSuccess: (_, __, res) => {
      if (res.data.code === 1) {
        fetchUserList({});
        setValue("");
      }
    },
  });

  const handleChange = (event) => {
    const {
      target: { value: searchKeyword },
    } = event;
    if (searchKeyword.length > 20) {
      return;
    }
    setValue(searchKeyword);
  };

  const handleSearch = () => {
    fetchUserList({ name: value });
  };

  const handleAddUser = () => {
    if (value) {
      putAddUser({ name: value });
    }
  };

  return (
    <div style={{ marginTop: "12px", width: "500px" }}>
      <div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          style={{ ...style, textIndent: "12px", width: "320px" }}
          placeholder="try input(just 20 chars) and check Network"
        />
        <button type="button" onClick={handleSearch} style={{ ...style, cursor: "pointer" }}>
          search
        </button>
        <button type="button" onClick={handleAddUser} style={{ ...style, cursor: "pointer" }}>
          add
        </button>
      </div>
      <ul style={{ padding: "0" }}>
        {userList.map((user) => {
          return (
            <li
              key={user.id}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span style={{ fontSize: "32px" }}>·</span>
              <span>{user.name}</span>
              <button
                type="button"
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  fontStyle: "normal",
                  color: "#ccc",
                  border: "none",
                  outline: "none",
                }}
                onClick={() => putDelUser({ id: user.id })}
              >
                delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export { UserList };
