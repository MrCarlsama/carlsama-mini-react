import { React } from "./core/React.js";
// export const App = React.createElement("div", { id: "app" }, "Carl");

function Counter({num}) {
    return <div>counter: {num}</div>
}


export const App = <div id='app'>
    <div>
        Carl
        <div>aaaa</div>
        Carl 2
        <Counter num={10}></Counter>
        <Counter num={20}></Counter>
    </div>
    
</div>
