import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding: 0;
    margin: 0;
  }
`;

export const AppWrapper = styled.div`
  text-align: center;

  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;

    .App-logo {
      height: 40vmin;
    }

    .App-link {
      color: #09d3ac;
    }
  }
`;
