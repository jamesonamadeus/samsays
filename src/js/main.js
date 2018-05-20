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

// Link Smooth Scroll
$(document).on('click', 'a[href^="#"]', function (event) {
  event.preventDefault();

  $('html, body').animate({
    scrollTop: $($.attr(this, 'href')).offset().top - 100
  }, 500);
});


(function () {
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
    [body, bannerNav, burgerContain, burgerNav].forEach(function (el) {
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

//Toggle Nav from Links
$(".link-togg").on("click", function () {
  $("body").removeClass("open");
  $(".nav-contain").removeClass("open");
  $(".nav-list").removeClass("open");
  $(".banner").removeClass("open");
});
