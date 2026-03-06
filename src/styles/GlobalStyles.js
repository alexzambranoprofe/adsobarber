import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  /* ===== RESET BASICO ===== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ===== VARIABLES DE COLOR (SENA) ===== */
  :root {
    --primary-green: #39A900;
    --secondary-green: #2E8700;
    --light-gray: #F5F7F6;
    --dark-gray: #333333;
    --white: #FFFFFF;
  }

  /* ===== HTML Y BODY ===== */
  html, body {
    height: 100%;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--light-gray);
    color: var(--dark-gray);
    line-height: 1.5;
  }

  /* ===== LINKS ===== */
  a {
    text-decoration: none;
    color: inherit;
  }

  /* ===== IMAGENES ===== */
  img {
    max-width: 100%;
    display: block;
  }

  /* ===== LISTAS ===== */
  ul {
    list-style: none;
  }

  /* ===== BOTONES ===== */
  button {
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

`;

export default GlobalStyles;
