//Change Navbar Background on Scroll
window.onscroll = function() {
  var bnr = document.querySelector("#banner");

  if (window.pageYOffset >= 50) {
    bnr.classList.add("banner--scroll");
    bnr.classList.remove("banner--top");
  } else {
    bnr.classList.add("banner--top");
    bnr.classList.remove("banner--scroll");
  }
};

//smooth scrolling
var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  offset: 100,
  easing: "easeInOutQuad"
});

(function() {
  //nav brgr
  var body = document.body;
  var linkToggle = document.getElementsByClassName("link-togg")[0];
  var bannerNav = document.getElementsByClassName("banner")[0];
  var navToggle = document.getElementsByClassName("nav-togg")[0];
  var burgerMenu = document.getElementsByClassName("nav-menu")[0];
  var burgerContain = document.getElementsByClassName("nav-contain")[0];
  var burgerNav = document.getElementsByClassName("nav-list")[0];

  if (document.addEventListener) {
    document.addEventListener("click", handleClick, false);
  } else if (document.attachEvent) {
    document.attachEvent("onclick", handleClick);
  }

  function handleClick(event) {
    event = event || window.event;
    event.target = event.target || event.srcElement;

    var element = event.target;

    while (element) {
      if (/nav-togg/.test(element.className)) {
        toggle(element);
        break;
      }

      element = element.parentNode;
    }
  }

  function toggle() {
    [body, bannerNav, burgerContain, burgerNav].forEach(function(el) {
      el.classList.toggle("open");
    });
  }

  // Lozad - Initialize library
  lozad(".lozad", {
    load: function(el) {
      el.src = el.dataset.src;
      el.onload = function() {
        el.classList.add("fade");
      };
    }
  }).observe();
})();

//Toggle Nav from Links
$(".link-togg").on("click", function() {
  $("body").removeClass("open");
  $(".nav-contain").removeClass("open");
  $(".nav-list").removeClass("open");
  $(".banner").removeClass("open");
});

//jQuery Modal
$("#modal").iziModal();

//Maitreapp
!(function(m, a, i, t, r, e) {
  if (m.Maitre) return;
  (r = m.Maitre = {}),
    (r.uuid = t),
    (r.loaded = 0),
    (r.base_url = i),
    (r.queue = []),
    (m.mtr = function() {
      r.queue.push(arguments);
    });
  (e = a.getElementsByTagName("script")[0]), (c = a.createElement("script"));
  (c.async = !0),
    (c.src = i + "/widget/" + t + ".js"),
    e.parentNode.insertBefore(c, e);
})(window, document, "https://maitreapp.co", "MF2e360f47bb");
