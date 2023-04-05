/* typescript */

// import "react/jsx-runtime";
import React from "/node_modules/@types/react/index";
import ReactDOM from "/node_modules/@types/react-dom/index";

function App() {
  const [count, setCount] = React.useState(0);

  return <h1 onClick={ () => setCount(count + 1) }>
    Click me: { count } !
  </h1>;
}

ReactDOM.render(<App />, document.getElementById("root"));
