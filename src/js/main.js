//Change Navbar Background on Scroll
window.onscroll = function() {
  var bnr = document.querySelector("#banner");

  if (window.pageYOffset >= 100) {
    bnr.classList.add("banner--scroll");
    bnr.classList.remove("banner--top");
  } else {
    bnr.classList.add("banner--top");
    bnr.classList.remove("banner--scroll");
  }
};

//lozad
// Initialize library
lozad(".lozad", {
  load: function(el) {
    el.src = el.dataset.src;
    el.onload = function() {
      el.classList.add("fade");
    };
  }
}).observe();
