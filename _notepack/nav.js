(function () {
  var host = document.querySelector(".np-nav-tree");
  if (!host || !window.NP_NAV) return;
  var root = document.body.getAttribute("data-np-root") || "";
  var current = document.body.getAttribute("data-np-page") || "";
  function render(nodes, parent) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.c) {
        var wrap = document.createElement("div");
        wrap.className = "np-nav-folder";
        var btn = document.createElement("button");
        btn.type = "button";
        var arrow = document.createElement("span");
        arrow.className = "np-nav-arrow";
        arrow.textContent = "\u25B8";
        btn.appendChild(arrow);
        btn.appendChild(document.createTextNode(n.t));
        btn.addEventListener("click", function (ev) {
          var f = ev.currentTarget.parentNode;
          f.className = f.className.indexOf("np-open") >= 0
            ? f.className.replace(/ ?np-open/, "")
            : f.className + " np-open";
        });
        var kids = document.createElement("div");
        kids.className = "np-nav-children";
        render(n.c, kids);
        wrap.appendChild(btn);
        wrap.appendChild(kids);
        parent.appendChild(wrap);
      } else {
        var a = document.createElement("a");
        a.className = "np-nav-item";
        a.href = root + n.u;
        var label = document.createElement("span");
        label.className = "np-nav-label";
        label.textContent = n.t;
        a.appendChild(label);
        if (n.b) {
          // Obsidian-style file-type chip so base pages stand out
          var tag = document.createElement("span");
          tag.className = "np-nav-tag";
          tag.textContent = "BASE";
          a.appendChild(tag);
        }
        if (n.u === current) {
          a.className += " np-current";
          // expand every ancestor folder so the current page is visible
          var p = parent;
          while (p && p !== host) {
            if (p.className && p.className.indexOf("np-nav-folder") >= 0 &&
                p.className.indexOf("np-open") < 0) {
              p.className += " np-open";
            }
            p = p.parentNode;
          }
        }
        parent.appendChild(a);
      }
    }
  }
  render(NP_NAV.tree, host);
  // walk np-nav-children ancestors too (folders wrap children in a div)
  var cur = host.querySelector(".np-current");
  if (cur) {
    var p = cur.parentNode;
    while (p && p !== host) {
      if (p.className && p.className.indexOf("np-nav-folder") >= 0 &&
          p.className.indexOf("np-open") < 0) {
        p.className += " np-open";
      }
      p = p.parentNode;
    }
  }
  // mobile drawer
  var btn = document.querySelector(".np-nav-btn");
  if (btn) {
    btn.addEventListener("click", function () {
      document.body.classList.toggle("np-nav-open");
    });
  }
  var backdrop = document.querySelector(".np-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", function () {
      document.body.classList.remove("np-nav-open");
    });
  }
})();
