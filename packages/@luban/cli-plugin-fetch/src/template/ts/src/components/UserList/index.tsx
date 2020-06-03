import React, { FunctionComponent, ChangeEvent, useState, CSSProperties } from "react";
import { useRequest } from "@luban-hooks/use-request";

import { AxiosResponse } from "axios";
import { ResponseData } from "@/service/interface/public";
import { UserItem } from "@/service/interface/user";

import { getUserList, addUser, delUser } from "@/service/api/user";

const style: CSSProperties = {
  height: "30px",
  outline: "none",
  border: "none",
  borderRadius: "4px",
  marginRight: "12px",
  fontSize: "16px",
};

const UserList: FunctionComponent = () => {
  const [value, setValue] = useState<string>("");

  const { data: userList, run: fetchUserList } = useRequest(getUserList, {
    initialData: [],
    defaultParams: {},
    formatter: (res: AxiosResponse<ResponseData<UserItem[]>>) => res.data.data,
  });

  const { run: putAddUser } = useRequest(addUser, {
    onSuccess: (res) => {
      if (res.code === 1) {
        fetchUserList({});
        setValue("");
      }
    },
  });

  const { run: putDelUser } = useRequest(delUser, {
    onSuccess: (res) => {
      if (res.code === 1) {
        fetchUserList({});
        setValue("");
      }
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    if (value.length > 20) {
      return;
    }
    setValue(value);
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
