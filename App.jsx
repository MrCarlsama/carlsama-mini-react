import { React } from "./core/React.js";
// export const App = React.createElement("div", { id: "app" }, "Carl");
let i = 0;
let bool = false;
function Counter({ num }) {
  const update = React.update();
  function updateCount() {
    update();
    i++;
  }
  return (
    <div>
      counter: {num}
      <button onClick={updateCount}>btn {i}</button>
    </div>
  );
}

function ShowBar() {
  function Foo() {
    return <div>Foo</div>;
  }
  const update = React.update();
  function updateShowBar() {
    bool = !bool;
    update();
  }
  const bar = <p>bar</p>;
  return (
    // <div>
    //   <button onClick={updateShowBar}>change</button>
    //   {bool ? <Foo /> : bar}
    // </div>
    <div>
      <button onClick={updateShowBar}>change</button>
      {bool && <Foo />}
      <div>1</div>
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
