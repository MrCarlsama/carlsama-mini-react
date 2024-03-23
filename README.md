# 项目名称

简短的项目描述

## day 1

### 第一节

拆解
1. 先写死 vdom 和 dom 渲染
2. 写活 vdom 和 写死 dom渲染
3. 动态 vdom 和 dom 渲染
4. 模仿 React API
5. 目录结构拆解



### 第二节
#### 拆解
1. 创建 vite 原生 js 项目，使其可以加载 jsx
2. 改造文件 main.js App.js
3. 从 createElement 写法 改成 JSX 语法

#### 思考题
**Q：当 DOM 树非常庞大的话，执行 render 函数会出现什么情况？**
A：首先由于疯狂调用浏览器API createElement 会创建许多新的 DOM 对象，这会消耗一定的内存，当 DOM 树特别庞大的时候，大量内存可能导致浏览器变卡或者崩溃。且由于浏览器需要花费时间渲染新创建的 DOM 元素，会花费大量时间渲染，也会让浏览器变卡。也是为什么React或者Vue都选择虚拟DOM的原因之一。
