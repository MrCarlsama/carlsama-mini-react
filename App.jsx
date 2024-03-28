import { React } from "./core/React.js";
// export const App = React.createElement("div", { id: "app" }, "Carl");
let i = 0;
let bool = false;
function Counter({ num }) {
  function updateCount() {
    i++;
    React.update();
  }
  return (
    <div>
      counter: {num}
      <button onClick={updateCount}>btn {i}</button>
    </div>
  );
}
function updateShowBar() {
  bool = !bool;
  React.update();
}
function ShowBar() {
  function Foo() {
    return <div>Foo</div>;
  }

  const bar = <p>bar</p>;
  return (
    <div>
      <button onClick={updateShowBar}>change</button>
      {bool ? <Foo /> : bar}
    </div>
  );
}

export const App = (
  <div id="app">
    <div>
      Carl
      <div>aaaa</div>
      <ShowBar />
      <Counter num={10}></Counter>
      <Counter num={20}></Counter>
    </div>
  </div>
);
