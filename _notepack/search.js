(function () {
  var input = document.querySelector(".np-search-input");
  var box = document.querySelector(".np-search-results");
  if (!input || !box || !window.NP_INDEX) return;
  var root = document.body.getAttribute("data-np-root") || "";
  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    if (!q) { box.hidden = true; box.innerHTML = ""; return; }
    var hits = [];
    for (var i = 0; i < NP_INDEX.length && hits.length < 20; i++) {
      var e = NP_INDEX[i];
      var ti = e.t.toLowerCase().indexOf(q);
      var xi = e.x ? e.x.toLowerCase().indexOf(q) : -1;
      if (ti >= 0 || xi >= 0) {
        var snip = xi >= 0 ? e.x.slice(Math.max(0, xi - 30), xi + 60) : "";
        hits.push({ e: e, s: snip, ti: ti });
      }
    }
    hits.sort(function (a, b) { return (a.ti < 0 ? 1 : 0) - (b.ti < 0 ? 1 : 0); });
    box.innerHTML = hits.length
      ? hits.map(function (h) {
          return '<a class="np-search-hit" href="' + root + h.e.u + '">' +
            '<div class="np-hit-t">' + esc(h.e.t) + "</div>" +
            (h.s ? '<div class="np-hit-x">' + esc(h.s) + "</div>" : "") +
            "</a>";
        }).join("")
      : '<div class="np-search-none">' + esc(window.NP_NORESULTS || "-") + "</div>";
    box.hidden = false;
  });
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (t !== input && !(box.contains && box.contains(t))) { box.hidden = true; }
  });
})();
