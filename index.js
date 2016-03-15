var yo = require('yo-yo')
var updateWithEvents = require('./updateWithEvents')

var deep = 100
var count = 0

console.time('create tree')
var root = yo`<ul><li>root</li></ul>`
for (var i = 0; i < deep; i++) {
  root = createElement(root)
}
console.timeEnd('create tree')

document.body.appendChild(root)

var newroot = yo`<ul><li>newroot</li></ul>`
for (var i = 0; i < deep; i++) {
  newroot = createElement(newroot)
}

console.time('update')
yo.update(root, newroot)
console.timeEnd('update')

newroot = yo`<ul><li>newroot</li></ul>`
for (var i = 0; i < deep; i++) {
  newroot = createElement(newroot)
}

console.time('update with events')
updateWithEvents(root, newroot)
console.timeEnd('update with events')

function createElement (child) {
  return yo`<ul>
    <li>
      ${count++}
      ${child}
    </li>
  </ul>`
}
