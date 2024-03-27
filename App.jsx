import { React } from "./core/React.js";
// export const App = React.createElement("div", { id: "app" }, "Carl");
let i = 0
function Counter({num}) {
    function updateCount() {
        i++
        React.update()
    } 
    return <div>counter: {num}
        <button onClick={updateCount}>btn {i}</button>
    
    </div>
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
