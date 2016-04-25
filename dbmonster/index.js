var yo = require('yo-yo')
var raf = require('raf')
var Monitoring = require('./monitor.js')
var getDatabases = require('./junkola-copied-from-ember.js')

function table (dbs) {
  return yo`<table class="table table-striped latest-data">
    <tbody>
    ${dbs.map(function (db) {
      return yo`<tr>
        <td class="dbname">
          ${db.name}
        </td>
        <td class="query-count">
          <span class="${db.countClassName}">
            ${db.queries.length}
          </span>
        </td>
        ${db.topFiveQueries.map(function (q) {
          return yo`<td class="Query ${q.className}">
            ${q.elapsed}
            <div class="popover left">
              <div class="popover-content">${q.query}</div>
              <div class="arrow"></div>
            </div>
          </td>`
        })}
      </tr>`
    })}
    </tbody>
  </table>`
}

var root = table(getDatabases())
document.body.appendChild(root)

raf(function loop () {
  yo.update(root, table(getDatabases()))
  Monitoring.renderRate.ping()
  raf(loop)
})
