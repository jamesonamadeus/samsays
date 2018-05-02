//Change Navbar Background on Scroll
window.onscroll = function () {
  var bnr = document.querySelector("#banner");

  if (window.pageYOffset >= 100) {
    bnr.classList.add("banner--scroll");
    bnr.classList.remove("banner--top");
  } else {
    bnr.classList.add("banner--top");
    bnr.classList.remove("banner--scroll");
  }
};

(function () {
  //smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      document.querySelector(this.getAttribute('href')).scrollIntoView({
        top: 200,
        behavior: 'smooth'
      });
    });
  });

  //nav brgr
  var body = document.body;
  var linkToggle = document.getElementsByClassName("link-togg")[0];
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
    [body, burgerContain, burgerNav].forEach(function (el) {
      el.classList.toggle("open");
    });
  }

  // Lozad - Initialize library
  lozad(".lozad", {
    load: function (el) {
      el.src = el.dataset.src;
      el.onload = function () {
        el.classList.add("fade");
      };
    }
  }).observe();
})();
