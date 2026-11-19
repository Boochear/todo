var list = document.getElementById("todo");
var count = document.getElementById("count");

function pad(n) {
  return n < 10 ? "0" + n : "" + n;
}

function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

var now = new Date();
var today =
  now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

fetch("todo.json", { cache: "no-store" })
  .then(function (r) {
    return r.json();
  })
  .then(function (items) {
    var done = 0;
    items.sort(function (a, b) {
      var x = a.date || "9999-12-31";
      var y = b.date || "9999-12-31";
      return x < y ? 1 : x > y ? -1 : 0;
    });
    var frag = document.createDocumentFragment();
    items.forEach(function (it) {
      var future = it.hidden || !it.date || it.date > today;
      var p = (it.date || "????-??-??").split("-");
      if (!future) done++;
      var li = el("li", "todo-item" + (future ? " is-future" : " is-done"));

      var when = el("div", "todo-when");
      when.appendChild(el("span", "todo-day", p[2] + "." + p[1] + "." + p[0]));

      var body = el("div", "todo-body");
      body.appendChild(el("span", "todo-text", future ? "???" : it.event));
      if (!future && it.desc)
        body.appendChild(el("span", "todo-desc", it.desc));

      li.appendChild(when);
      li.appendChild(body);
      if (!future && it.link) {
        li.classList.add("is-link");
        li.addEventListener("click", function () {
          window.open(it.link, "_blank", "noopener");
        });
      }
      frag.appendChild(li);
    });
    list.appendChild(frag);
    count.textContent = done;
  })
  .catch(function () {
    list.innerHTML =
      '<li class="todo-item"><span class="todo-text">—</span></li>';
  });

var visits = document.getElementById("visits");
var ctrl = new AbortController();
setTimeout(function () {
  ctrl.abort();
}, 8000);

fetch("https://abacus.jasoncameron.dev/hit/boochear-todo/visits", {
  signal: ctrl.signal,
})
  .then(function (r) {
    return r.json();
  })
  .then(function (d) {
    visits.textContent = d.value;
  })
  .catch(function () {
    visits.textContent = "—";
  });

(function () {
  var rain = document.getElementById("rain");
  if (!rain || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var n = innerWidth < 600 ? 18 : 36;
  var frag = document.createDocumentFragment();

  for (var i = 0; i < n; i++) {
    var d = document.createElement("i");
    var near = Math.random() < 0.35;
    var dur = near ? 2.2 + Math.random() * 1.5 : 4 + Math.random() * 3;

    d.className = near ? "drop near" : "drop";
    d.style.left = Math.random() * 100 + "%";
    d.style.height =
      (near ? 70 + Math.random() * 60 : 40 + Math.random() * 40) + "px";
    d.style.animationDuration = dur + "s";
    d.style.animationDelay = -Math.random() * dur + "s";
    frag.appendChild(d);
  }

  rain.appendChild(frag);

  document.addEventListener("visibilitychange", function () {
    rain.classList.toggle("paused", document.hidden);
  });
})();
