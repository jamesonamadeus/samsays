(function() {
  var u = function() {
    var n, y, C, D, z, p;
    var g = {
      referrer: !1,
      source: !1,
      campaign: !1,
      fingerprinting: !1,
      session: !1
    };
    var E = (n = !1);
    var f = {};
    var u = (y = !1);
    var F = (z = !0);
    var A = (p = !1);
    mtr = function() {
      if (0 < arguments.length) {
        var a = arguments[0].toLowerCase();
        "identify" == a
          ? f.identify(arguments[1], arguments[2])
          : "track" == a && f.track(arguments[1], arguments[2]);
      } else console.warn("[Maitre] mtr function can't be empty");
    };
    mtg = function(a) {
      return document.createElement(a);
    };
    mtid = function(a) {
      return document.getElementById(a);
    };
    f.identify = function(a, b) {
      if (Maitre.config.settings.recaptcha.enable)
        (g.session = !0),
          console.warn(
            "[Maitre] Identify() disabled because Recaptcha is enabled."
          );
      else if (a)
        if (a.email && "" != a.email.trim()) {
          var c = f.tools.readCookie("__maitre-session-" + Maitre.uuid);
          b || !c
            ? ((c = {
                test_mode: p,
                check_status: !1,
                one_click_signup: !0,
                name: a.name,
                email: a.email,
                extra_field: a.extra_field,
                extra_field_2: a.extra_field_2,
                terms_conditions: a.terms,
                uuid: Maitre.uuid,
                host: Maitre.config.defaults.default_url,
                referrer: Maitre.referrer,
                source: Maitre.source,
                campaign: Maitre.campaign,
                fingerprint: Maitre.fingerprint,
                recaptcha: D,
                require_leaderboard:
                  Maitre.config.settings.sharing.leaderboard.show,
                upsert: a.upsert
              }),
              f.tools.ajax.request(
                f.tools.getWidgetUrl() + "/post",
                "POST",
                c,
                function(b) {
                  "error" == b.response
                    ? Maitre.config.callbacks.hasOwnProperty("error") &&
                      (console.error(b.message),
                      Maitre.config.callbacks.error(a))
                    : "subscriber_not_created" != b.response &&
                      ((Maitre.response = b.response),
                      (Maitre.optin_data = b.data),
                      (Maitre.confirmation_links = b.confirmation_links),
                      p || f.tools.storeSignupCookie(!0),
                      Maitre.config.callbacks.hasOwnProperty(
                        "subscriberLoaded"
                      ) &&
                        Maitre.config.callbacks.subscriberLoaded(
                          b.response,
                          b.data
                        ));
                  g.session = !0;
                },
                function(b) {
                  Maitre.config.callbacks.hasOwnProperty("error")
                    ? (console.error("[Maitre] Identify() error."),
                      Maitre.config.callbacks.error(a))
                    : alert(Maitre.config.settings.alerts.server_problem);
                }
              ))
            : ((g.session = !0),
              console.warn(
                "[Maitre] Identify() has not been used because this user has already been identified."
              ));
        } else
          console.error("[Maitre] Email is missing for Identify function.");
      else console.warn("[Maitre] Identify function is missing data.");
    };
    f.track = function(a, b) {
      if (a) {
        var c = "__maitre-conversion-" + a + "-" + Maitre.uuid;
        if (f.tools.readCookie(c))
          console.log(
            "[Maitre] Event '" +
              a +
              "' wasn't tracked because this user has already triggered it in the past."
          );
        else if (
          Maitre.referrer &&
          k.settings.sharing.rewards.list.find(function(b) {
            return b.event_name == a;
          })
        ) {
          var d = {
            uuid: Maitre.uuid,
            event: a,
            ref_code: Maitre.referrer,
            subscriber: f.tools.readCookie("__maitre-session-" + Maitre.uuid),
            fingerprint: Maitre.fingerprint,
            source: Maitre.source,
            data: b
          };
          f.tools.ajax.request(
            f.tools.getWidgetUrl() + "/track_event",
            "POST",
            d,
            function(b) {
              "event_created" == b.response || "event_retrieved" == b.response
                ? ((Maitre.event_data = b.data),
                  f.tools.createCookie(c, b.data.id, 3650),
                  console.info("[Maitre] Event '" + a + "' tracked."),
                  Maitre.config.callbacks.hasOwnProperty("afterConversion") &&
                    Maitre.config.callbacks.afterConversion(b.data))
                : console.warn(b.message);
            },
            function(a) {
              console.error(a);
            }
          );
        }
      } else console.error("[Maitre] Event name is missing.");
    };
    f.loadFingerPrint = function() {
      "undefined" !== typeof Fingerprint2
        ? new Fingerprint2().get(function(a, b) {
            Maitre.fingerprint = a;
            g.fingerprinting = !0;
          })
        : setTimeout(loadFingerPrint, 50);
    };
    f.loadReCaptcha = function() {
      y = !0;
      C = grecaptcha.render("MaitreCaptcha", {
        sitekey: Maitre.config.settings.recaptcha.public_key,
        size: "invisible",
        callback: function(a) {
          D = a;
          data = f.tools.getFormValues();
          Maitre.form.submit(data);
        }
      });
      console.info("[Maitre] ReCaptcha has been added to the page.");
    };
    f.loadFacebookPixel = function() {
      u = !0;
      fbq("init", Maitre.config.settings.facebook_pixel.id);
      fbq("track", "PageView");
      console.info("[Maitre] Facebook Pixel has been added to the page.");
    };
    f.libraries = {
      fp: function() {
        if ("undefined" === typeof window.Fingerprint2) {
          var a = mtg("script");
          a.setAttribute("type", "text/javascript");
          a.async = !0;
          a.setAttribute(
            "src",
            "https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.6.1/fingerprint2.min.js"
          );
          a.readyState
            ? (a.onreadystatechange = function() {
                ("complete" != this.readyState &&
                  "loaded" != this.readyState) ||
                  f.loadFingerPrint();
              })
            : ((a.onload = f.loadFingerPrint),
              (a.onerror = function() {
                g.fingerprinting = !0;
              }));
          (
            document.getElementsByTagName("head")[0] || document.documentElement
          ).appendChild(a);
        } else f.loadFingerPrint();
      },
      facebook_pixel: function() {
        if ("undefined" === typeof window.fbq) {
          if (!window.fbq) {
            var a = (window.fbq = function() {
              a.callMethod
                ? a.callMethod.apply(a, arguments)
                : a.queue.push(arguments);
            });
            window._fbq ||
              ((window._fbq = a),
              (a.push = a),
              (a.loaded = !0),
              (a.version = "2.0"));
            a.queue = [];
            var b = mtg("script");
            b.async = !0;
            b.src = "https://connect.facebook.net/en_US/fbevents.js";
            (
              document.getElementsByTagName("head")[0] ||
              document.documentElement
            ).appendChild(b);
            var c = setInterval(function() {
              var a = !1;
              try {
                a = "undefined" !== typeof fbq;
              } catch (e) {
                console.log("Error while loading Facebook Pixel ", e);
              }
              a && (clearInterval(c), f.loadFacebookPixel());
            }, 100);
          }
        } else f.loadFacebookPixel();
      },
      recaptcha: function() {
        if ("undefined" === typeof __google_recaptcha_client) {
          var a = mtg("script");
          a.setAttribute("type", "text/javascript");
          a.async = !0;
          a.setAttribute(
            "src",
            "https://www.google.com/recaptcha/api.js?render=explicit"
          );
          (
            document.getElementsByTagName("head")[0] || document.documentElement
          ).appendChild(a);
          var b = setInterval(function() {
            var a = !1;
            try {
              a =
                "undefined" !== typeof grecaptcha &&
                "function" == typeof grecaptcha.render;
            } catch (d) {
              console.log("Error while loading ReCaptcha ", d);
            }
            a && (clearInterval(b), f.loadReCaptcha());
          }, 100);
        } else f.loadReCaptcha();
      }
    };
    f.tools = {
      getOriginalHost: function() {
        return window.location != window.parent.location
          ? document.referrer
          : window.location.href;
      },
      getDefaultUrl: function(a) {
        return a.default_url && "" != a.default_url.trim()
          ? a.default_url
          : this.getOriginalHost().split("?")[0];
      },
      getWidgetUrl: function() {
        return Maitre.base_url + "/widget/" + Maitre.uuid;
      },
      getReferrer: function() {
        if (this.readCookie("__maitre-session-" + Maitre.uuid)) g.referrer = !0;
        else {
          var a = "__maitre-referrer-" + Maitre.uuid,
            b = this.readCookie(a);
          if (b) (Maitre.referrer = b), (g.referrer = !0);
          else {
            var c = this.getParams("mwr");
            c
              ? this.ajax.request(
                  this.getWidgetUrl() + "/check_referral_code",
                  "POST",
                  { uuid: Maitre.uuid, ref_code: c },
                  function(b) {
                    "ok" == b.response
                      ? ((Maitre.referrer = c), f.tools.createCookie(a, c, 90))
                      : console.error(b.message);
                    g.referrer = !0;
                  },
                  function(a) {
                    console.error(a.message);
                  }
                )
              : (g.referrer = !0);
          }
        }
      },
      getSource: function() {
        if (!this.readCookie("__maitre-session-" + Maitre.uuid)) {
          var a = "__maitre-source-" + Maitre.uuid,
            b = this.readCookie(a),
            c = this.getParams("source"),
            d = this.getParams("mws"),
            e = this.getParams("utm_source");
          if (b) Maitre.source = b;
          else {
            if (
              Maitre.config.defaults.source &&
              "" != Maitre.config.defaults.source.trim()
            )
              var h = Maitre.config.defaults.source;
            else
              c
                ? (h = c)
                : d
                ? (h = d)
                : e
                ? (h = e)
                : document.referrer &&
                  ((h = document.createElement("a")),
                  (h.href = document.referrer),
                  (h = h.hostname));
            (Maitre.source = h) && f.tools.createCookie(a, h, 90);
          }
        }
        g.source = !0;
      },
      getCampaign: function() {
        if (!this.readCookie("__maitre-session-" + Maitre.uuid)) {
          var a,
            b = "__maitre-campaign-" + Maitre.uuid,
            c = this.readCookie(b),
            d = this.getParams("campaign"),
            e = this.getParams("mwc"),
            h = this.getParams("utm_campaign");
          c
            ? (Maitre.campaign = c)
            : (Maitre.config.defaults.campaign &&
              "" != Maitre.config.defaults.campaign.trim()
                ? (a = Maitre.config.defaults.campaign)
                : d
                ? (a = d)
                : e
                ? (a = e)
                : h && (a = h),
              (Maitre.campaign = a) && f.tools.createCookie(b, a, 90));
        }
        g.campaign = !0;
      },
      getSessionCookie: function(a) {
        if (g.referrer) {
          if (!g.session_cookie) {
            var b = f.tools.readCookie("__maitre-session-" + Maitre.uuid);
            b &&
              this.ajax.request(
                this.getWidgetUrl() + "/check_subscriber",
                "POST",
                {
                  uuid: Maitre.uuid,
                  subscriber_id: b,
                  require_leaderboard:
                    Maitre.config.settings.sharing.leaderboard.show
                },
                function(b) {
                  "error" != b.response
                    ? ((Maitre.optin_data = b.data),
                      (Maitre.response = b.response),
                      (Maitre.confirmation_links = b.confirmation_links),
                      a && Maitre.sharing.open(),
                      Maitre.config.callbacks.hasOwnProperty(
                        "subscriberLoaded"
                      ) &&
                        Maitre.config.callbacks.subscriberLoaded(
                          b.response,
                          b.data
                        ))
                    : "error" == b.response &&
                      f.tools.eraseCookie("__maitre-session-" + Maitre.uuid);
                },
                function(a) {
                  console.error(a);
                }
              );
          }
        } else setTimeout(this.getSessionCookie, 50);
      },
      getIdentity: function() {
        var a = Maitre.queue.filter(function(a) {
          return "identify" == a[0];
        });
        0 < a.length ? f.identify(a[0][1], a[0][2]) : (g.session = !0);
      },
      getParams: function(a) {
        var b = {};
        (window.location != window.parent.location
          ? window.parent.location
          : window.location
        ).search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(a, d, e) {
          b[decodeURIComponent(d)] = decodeURIComponent(e);
        });
        return a ? b[a] : b;
      },
      verify_tracking_code: function() {
        var a = mtg("div");
        a.id = "mtr-popup-verify-container";
        var b = mtg("div");
        b.classList = "mtr-popup-verify-close";
        b.innerText = "\u00d7";
        b.addEventListener("click", function(b) {
          b.preventDefault();
          a.remove();
        });
        a.appendChild(b);
        b = mtg("div");
        b.classList = "mtr-popup-verify-status";
        a.appendChild(b);
        b = mtg("div");
        b.classList = "mtr-popup-verify-text-container";
        var c = mtg("h3");
        c.innerText = "Ma\u00eetre installation verified.";
        b.appendChild(c);
        c = mtg("p");
        c.innerText =
          "The Ma\u00eetre tracking code has been properly installed on this page.";
        b.appendChild(c);
        a.appendChild(b);
        document.getElementsByTagName("body")[0].appendChild(a);
      },
      getFormValues: function(a) {
        var b = a ? a : mtid("mtr-optin-form");
        a = b.querySelector("[name='email']");
        var c = b.querySelector("[name='name']"),
          d = b.querySelector("[name='extra_field']"),
          e = b.querySelector("[name='extra_field_2']");
        b = b.querySelector("[name='terms']");
        return {
          name: c ? c.value : null,
          email: a ? a.value : null,
          extra_field: d ? d.value : null,
          extra_field_2: e ? e.value : null,
          terms: b ? b.checked : null
        };
      },
      createCookie: function(a, b, c) {
        var d = new Date();
        d.setTime(d.getTime() + 864e5 * c);
        c = "; expires=" + d.toUTCString();
        document.cookie = a + "=" + b + c + "; path=/";
      },
      readCookie: function(a) {
        a += "=";
        for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
          for (var d = b[c]; " " == d.charAt(0); ) d = d.substring(1, d.length);
          if (0 == d.indexOf(a)) return d.substring(a.length, d.length);
        }
        return null;
      },
      eraseCookie: function(a) {
        this.createCookie(a, "", -1);
      },
      storeSignupCookie: function(a) {
        var b = "__maitre-session-" + Maitre.uuid;
        if (
          "subscriber_created" == Maitre.response ||
          "subscriber_retrieved" == Maitre.response
        )
          if (!this.readCookie(b) || a)
            this.eraseCookie(b),
              this.createCookie(b, Maitre.optin_data.id, 365);
      },
      ajax: {
        xhr: null,
        request: function(a, b, c, d, e, f) {
          this.xhr ||
            (this.xhr = window.ActiveX
              ? new ActiveXObject("Microsoft.XMLHTTP")
              : new XMLHttpRequest());
          var h = this.xhr;
          h.onreadystatechange = function() {
            4 === h.readyState && 200 === h.status
              ? d(JSON.parse(h.responseText))
              : 4 === h.readyState &&
                (e ? e() : console.error("[Maitre] Ajax calls has failed."));
          };
          h.onerror = function() {
            e ? e() : console.error("[Maitre] Ajax calls has failed.");
          };
          this.xhr.open(b, a, !0);
          this.xhr.setRequestHeader("Content-Type", "application/json");
          f && this.xhr.setRequestHeader("Authorization", f);
          this.xhr.send(JSON.stringify(c));
        }
      },
      extend: function() {
        for (var a = 1; a < arguments.length; a++)
          for (var b in arguments[a])
            arguments[a].hasOwnProperty(b) &&
              ("object" === typeof arguments[0][b] &&
              "object" === typeof arguments[a][b]
                ? this.extend(arguments[0][b], arguments[a][b])
                : (arguments[0][b] = arguments[a][b]));
        return arguments[0];
      },
      numberWithCommas: function(a) {
        return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      copyToClipboard: function(a, b) {
        if (document.body.createTextRange) {
          var c = document.body.createTextRange();
          c.moveToElementText(a);
          c.select();
        } else if (window.getSelection && document.createRange) {
          a.readOnly = !1;
          c = document.createRange();
          c.selectNodeContents(a);
          var d = window.getSelection();
          d.removeAllRanges();
          d.addRange(c);
          ("TEXTAREA" != a.nodeName && "INPUT" != a.nodeName) || a.select();
          a.setSelectionRange &&
            navigator.userAgent.match(/ipad|ipod|iphone/i) &&
            (a.setSelectionRange(0, 999999), (a.readOnly = !0));
        }
        try {
          var e = document.execCommand("copy");
        } catch (m) {
          e = !1;
        }
        if (e) {
          var f = b.textContent;
          b.textContent = "Copied";
          E = !0;
          setTimeout(function() {
            b.textContent = f;
            E = !1;
          }, 500);
          console.info("[Maitre] Referral link copied to clipboard.");
        }
      },
      mobileCheck: function() {
        var a = !1,
          b = navigator.userAgent || navigator.vendor || window.opera;
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            b
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            b.substr(0, 4)
          )
        )
          a = !0;
        return a;
      },
      checkOneClickSignup: function() {
        var a =
          Maitre.config.defaults.hasOwnProperty("email") &&
          "" != Maitre.config.defaults.email.trim()
            ? Maitre.config.defaults.email.trim()
            : this.getParams(Maitre.config.settings.one_click_signup.email);
        a &&
          ((a = {
            email: a,
            name:
              Maitre.config.defaults.hasOwnProperty("name") &&
              "" != Maitre.config.defaults.name.trim()
                ? Maitre.config.defaults.name.trim()
                : this.getParams(Maitre.config.settings.one_click_signup.name),
            extra_field:
              Maitre.config.defaults.hasOwnProperty("extra_field") &&
              "" != Maitre.config.defaults.extra_field.trim()
                ? Maitre.config.defaults.extra_field.trim()
                : this.getParams(
                    Maitre.config.settings.one_click_signup.extra_field
                  ),
            extra_field_2:
              Maitre.config.defaults.hasOwnProperty("extra_field_2") &&
              "" != Maitre.config.defaults.extra_field_2.trim()
                ? Maitre.config.defaults.extra_field_2.trim()
                : this.getParams(
                    Maitre.config.settings.one_click_signup.extra_field_2
                  )
          }),
          (A = !0),
          Maitre.form.submit(a));
      },
      addLinkForCommonEmails: function() {
        var a = Maitre.optin_data
            ? Maitre.optin_data.email.split("@")[1]
            : "email.com",
          b = "",
          c = Maitre.config.settings.sharing.verification.text_email;
        "gmail.com" == a || "googlemail.com" == a
          ? (b = "https://gmail.com")
          : "yahoo.com" == a || "ymail.com" == a
          ? (b = "https://mail.yahoo.com")
          : "hotmail.com" == a ||
            "live.com" == a ||
            "outlook.com" == a ||
            "msn.com" == a ||
            "hotmail.co.uk" == a
          ? (b = "https://mail.live.com")
          : "icloud.com" == a || "me.com" == a || "mac.com" == a
          ? (b = "https://www.icloud.com/#mail")
          : "aol.com" == a && (b = "https://mail.aol.com");
        "" != b &&
          (c = c.replace(
            Maitre.config.settings.sharing.verification.email_replace,
            "<a href='" +
              b +
              "' target='_blank'>" +
              Maitre.config.settings.sharing.verification.email_replace +
              "</a>"
          ));
        return c;
      },
      lightenColor: function(a, b) {
        var c = parseInt(a, 16),
          d = Math.round(2.55 * b),
          e = (c >> 16) + d,
          f = ((c >> 8) & 255) + d;
        c = (c & 255) + d;
        return (
          16777216 +
          65536 * (255 > e ? (1 > e ? 0 : e) : 255) +
          256 * (255 > f ? (1 > f ? 0 : f) : 255) +
          (255 > c ? (1 > c ? 0 : c) : 255)
        )
          .toString(16)
          .slice(1);
      },
      sendEMail: function(a, b, c, d, e) {
        this.ajax.request(
          k.settings.lambda.email_endpoint,
          "POST",
          {
            TEMPLATE_ID: k.settings.lambda.template_id,
            CAMPAIGN_ID: Maitre.uuid + "-confirmation_email",
            RECIPIENT: [{ address: a }],
            SUBSTITUTION_DATA: { name: b, confirmation_link: c }
          },
          function(a) {
            a.success
              ? console.log("[Maitre] Email sent successfully.")
              : console.warn("[Maitre] Failed to send email.\nLog: " + a);
            d && d();
          },
          function(a) {
            console.error(
              "[Maitre] There was a problem sending the confirmation email. " +
                a
            );
            e && e();
          },
          k.settings.lambda.email_authorization
        );
      },
      sendSMS: function(a, b, c, d) {
        this.ajax.request(
          k.settings.lambda.sms_endpoint,
          "POST",
          {
            body: k.settings.lambda.sms_body,
            confirmation_link: b,
            to: a,
            from: k.settings.lambda.sms_from
          },
          function(a) {
            "queued" == a.status
              ? console.log("[Maitre] SMS sent successfully.")
              : console.error("[Maitre] Failed to send SMS.\nLog: " + a);
            c && c();
          },
          function(a) {
            console.error("[Maitre] There was a problem sending the SMS. " + a);
            d && d();
          },
          k.settings.lambda.sms_authorization
        );
      }
    };
    f.callbacks = {
      success: function(a) {
        mtid("mtr-form-submit-button") &&
          ((mtid("mtr-form-submit-button").disabled = !1),
          (mtid("mtr-form-submit-button").innerHTML = n
            ? Maitre.config.settings.form.submit_button.check_position
            : Maitre.config.settings.form.submit_button.text));
        "server_problem" == a.response
          ? Maitre.config.callbacks.hasOwnProperty("serverProblem")
            ? (console.log(
                "[Ma\u00eetre] Custom serverProblem callback called."
              ),
              Maitre.config.callbacks.serverProblem())
            : alert(Maitre.config.settings.alerts.server_problem)
          : "failed_recaptcha_test" == a.response
          ? Maitre.config.callbacks.hasOwnProperty("failedRecaptcha")
            ? (console.log(
                "[Ma\u00eetre] Custom failedRecaptcha callback called."
              ),
              Maitre.config.callbacks.failedRecaptcha())
            : alert(Maitre.config.settings.alerts.failed_recaptcha)
          : "subscriber_not_found" == a.response
          ? Maitre.config.callbacks.hasOwnProperty("subscriberNotFound")
            ? (console.log(
                "[Ma\u00eetre] Custom subscriberNotFound callback called."
              ),
              Maitre.config.callbacks.subscriberNotFound())
            : alert(Maitre.config.settings.alerts.subscriber_not_found)
          : "email_not_valid" == a.response
          ? Maitre.config.callbacks.hasOwnProperty("emailNotValid")
            ? (console.log(
                "[Ma\u00eetre] Custom emailNotValid callback called."
              ),
              Maitre.config.callbacks.emailNotValid(a.reason))
            : alert(a.reason)
          : Maitre.sharing.open();
      },
      processQueue: function() {
        var a = Maitre.queue.filter(function(a) {
          return "track" == a[0];
        });
        if (0 < a.length) {
          for (var b = 0; b < a.length; b++) f.track(a[b][1], a[b][2]);
          Maitre.queue = [];
        }
      }
    };
    Maitre.form = {
      incomplete: function(a) {
        var b = a.querySelector("[name='email']"),
          c = a.querySelector("[name='name']"),
          d = a.querySelector("[name='extra_field']"),
          e = a.querySelector("[name='extra_field_2']");
        a = a.querySelector("[name='terms']");
        var f = /^[+][0-9]{1,3}[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{3,8}$/;
        return "" == b.value.trim() ||
          (Maitre.config.settings.form.name.require &&
            "" == c.value.trim() &&
            !n) ||
          (Maitre.config.settings.form.extra_field.require &&
            "" == d.value.trim() &&
            !n) ||
          (Maitre.config.settings.form.extra_field_2.require &&
            "" == e.value.trim() &&
            !n)
          ? "form_incomplete"
          : !Maitre.config.settings.form.terms_conditions.require ||
            a.checked ||
            n
          ? !Maitre.config.settings.sharing.verification.sms_confirmation ||
            f.test(d.value) ||
            n
            ? "valid"
            : "invalid_phone_number"
          : "terms_not_accepted";
      },
      submit: function(a) {
        if (a.email && "" != a.email.trim()) {
          var b = {
            test_mode: p,
            check_status: n,
            one_click_signup: A,
            name: a.name,
            email: a.email,
            extra_field: a.extra_field,
            extra_field_2: a.extra_field_2,
            terms_conditions: a.terms,
            uuid: Maitre.uuid,
            host: Maitre.config.defaults.default_url,
            referrer: Maitre.referrer,
            source: Maitre.source,
            campaign: Maitre.campaign,
            fingerprint: Maitre.fingerprint,
            recaptcha: D,
            require_leaderboard: Maitre.config.settings.sharing.leaderboard.show
          };
          f.tools.ajax.request(
            f.tools.getWidgetUrl() + "/post",
            "POST",
            b,
            function(b) {
              "error" == b.response
                ? Maitre.config.callbacks.hasOwnProperty("error")
                  ? (console.error(b.message), Maitre.config.callbacks.error(a))
                  : alert(Maitre.config.settings.alerts.subscriber_not_found)
                : ((Maitre.response = b.response),
                  (Maitre.optin_data = b.data),
                  (Maitre.confirmation_links = b.confirmation_links),
                  p || f.tools.storeSignupCookie(),
                  Maitre.config.callbacks.hasOwnProperty("success")
                    ? Maitre.config.callbacks.success(b)
                    : f.callbacks.success(b),
                  u && fbq("track", "Lead"),
                  "subscriber_created" != b.response ||
                    p ||
                    A ||
                    (k.settings.sharing.verification.sms_confirmation
                      ? f.tools.sendSMS(a.extra_field, b.confirmation_links.sms)
                      : f.tools.sendEMail(
                          a.email,
                          a.name,
                          b.confirmation_links.email
                        )),
                  Maitre.config.callbacks.hasOwnProperty("afterSuccess") &&
                    Maitre.config.callbacks.afterSuccess(b));
            },
            function(b) {
              Maitre.config.callbacks.hasOwnProperty("error")
                ? (console.error("[Maitre] There seems to be an error"),
                  Maitre.config.callbacks.error(a))
                : alert(Maitre.config.settings.alerts.server_problem);
            }
          );
          mtid("mtr-form-submit-button") &&
            ((mtid("mtr-form-submit-button").disabled = !1),
            (mtid("mtr-form-submit-button").innerHTML =
              Maitre.config.settings.form.submit_button.text));
          Maitre.config.settings.recaptcha.enable && y && grecaptcha.reset(C);
        } else console.error("[Maitre] You must specifiy an email address.");
      },
      regenerate: function(a) {
        a && (Maitre.config = f.tools.extend(Maitre.config, a));
        a = Maitre.generate.form();
        mtid(Maitre.config.defaults.form_container_id).innerHTML = "";
        mtid(Maitre.config.defaults.form_container_id).appendChild(a);
      }
    };
    Maitre.sharing = {
      open: function() {
        var a = Maitre.generate.sharing_screen();
        if (Maitre.config.settings.sharing.popup) Maitre.generate.popup(a);
        else {
          var b = mtid(Maitre.config.defaults.sharing_screen_container_id);
          if (b) (b.innerHTML = ""), b.appendChild(a);
          else if ((b = mtid(Maitre.config.defaults.form_container_id)))
            (b.innerHTML = ""), b.appendChild(a);
        }
      },
      regenerate: function(a) {
        a && (Maitre.config = f.tools.extend(Maitre.config, a));
        return Maitre.generate.sharing_screen();
      }
    };
    Maitre.floating_button = {
      regenerate: function(a) {
        a && (Maitre.config = f.tools.extend(Maitre.config, a));
        return Maitre.generate.floating_button();
      }
    };
    Maitre.generate = {
      stylesheet: function(a) {
        var b = mtg("style");
        b.type = "text/css";
        b.innerHTML = a;
        document.getElementsByTagName("head")[0].appendChild(b);
      },
      form: function() {
        var a = mtg("div");
        a.id = "mtr-optin-form";
        var b = mtg("form");
        b.id = "mtr-form";
        b.setAttribute("method", "POST");
        b.setAttribute("autocomplete", "off");
        b.setAttribute("action", "#");
        b.style.borderTopColor = Maitre.config.settings.form.border;
        if (
          null != Maitre.config.settings.form.cover &&
          "" != Maitre.config.settings.form.cover
        ) {
          var c = mtg("div");
          c.id = "mtr-form-cover";
          c.style.backgroundImage =
            "url('" + Maitre.config.settings.form.cover + "')";
          b.appendChild(c);
        }
        Maitre.config.settings.recaptcha.enable &&
          ((c = mtg("div")), (c.id = "MaitreCaptcha"), b.appendChild(c));
        "" != Maitre.config.settings.form.header.text.trim() &&
          ((c = mtg("h2")),
          (c.id = "mtr-form-header"),
          (c.innerText = Maitre.config.settings.form.header.text),
          (c.style.color = Maitre.config.settings.form.header.color),
          b.appendChild(c));
        c = mtg("div");
        c.id = "mtr-form-fields";
        if (Maitre.config.settings.form.name.require) {
          var d = mtg("div");
          d.id = "mtr-form-field-name";
          d.className = "mtr-form-field";
          var e = mtg("input");
          e.id = "mtr-form-input-name";
          e.setAttribute("type", "text");
          e.setAttribute("name", "name");
          e.setAttribute("required", "true");
          e.setAttribute(
            "placeholder",
            Maitre.config.settings.form.name.placeholder
          );
          e.addEventListener("focus", function() {
            e.style.borderColor = Maitre.config.settings.design.colors.primary;
          });
          e.addEventListener("blur", function() {
            e.style.borderColor = "#cccccc";
          });
          Maitre.config.defaults.hasOwnProperty("name") &&
            e.setAttribute("value", Maitre.config.defaults.name);
          d.appendChild(e);
        }
        if (Maitre.config.settings.form.extra_field.require) {
          var h = mtg("div");
          h.id = "mtr-form-field-extra";
          h.className = "mtr-form-field";
          var m = mtg("input");
          m.id = "mtr-form-input-extra-field";
          Maitre.config.settings.sharing.verification.sms_confirmation
            ? (m.setAttribute("type", "tel"),
              m.setAttribute(
                "pattern",
                "^[+][0-9]{1,3}[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{3,8}$"
              ))
            : m.setAttribute("type", "text");
          m.setAttribute("name", "extra_field");
          m.setAttribute("required", "true");
          m.setAttribute(
            "placeholder",
            Maitre.config.settings.form.extra_field.placeholder
          );
          m.addEventListener("focus", function() {
            m.style.borderColor = Maitre.config.settings.design.colors.primary;
          });
          m.addEventListener("blur", function() {
            m.style.borderColor = "#cccccc";
          });
          Maitre.config.defaults.hasOwnProperty("extra_field") &&
            m.setAttribute("value", Maitre.config.defaults.extra_field);
          h.appendChild(m);
        }
        if (Maitre.config.settings.form.extra_field_2.require) {
          var q = mtg("div");
          q.id = "mtr-form-field-extra-2";
          q.className = "mtr-form-field";
          var l = mtg("input");
          l.id = "mtr-form-input-extra-field-2";
          l.setAttribute("type", "text");
          l.setAttribute("name", "extra_field_2");
          l.setAttribute("required", "true");
          l.setAttribute(
            "placeholder",
            Maitre.config.settings.form.extra_field_2.placeholder
          );
          l.addEventListener("focus", function() {
            l.style.borderColor = Maitre.config.settings.design.colors.primary;
          });
          l.addEventListener("blur", function() {
            l.style.borderColor = "#cccccc";
          });
          Maitre.config.defaults.hasOwnProperty("extra_field_2") &&
            l.setAttribute("value", Maitre.config.defaults.extra_field_2);
          q.appendChild(l);
        }
        var v = mtg("div");
        v.id = "mtr-form-field-email";
        v.className = "mtr-form-field";
        var r = mtg("input");
        r.id = "mtr-form-input-email";
        r.setAttribute("type", "email");
        r.setAttribute("name", "email");
        r.setAttribute("required", "true");
        r.setAttribute(
          "placeholder",
          Maitre.config.settings.form.email.placeholder
        );
        r.addEventListener("focus", function() {
          r.style.borderColor = Maitre.config.settings.design.colors.primary;
        });
        r.addEventListener("blur", function() {
          r.style.borderColor = "#cccccc";
        });
        Maitre.config.defaults.hasOwnProperty("email") &&
          r.setAttribute("value", Maitre.config.defaults.email);
        v.appendChild(r);
        var g = mtg("div");
        g.id = "mtr-form-field-submit";
        g.className = "mtr-form-field";
        var t = mtg("button");
        t.id = "mtr-form-submit-button";
        t.setAttribute("type", "submit");
        t.innerHTML = Maitre.config.settings.form.submit_button.text;
        t.style.backgroundColor =
          Maitre.config.settings.form.submit_button.color;
        g.appendChild(t);
        if (Maitre.config.settings.form.terms_conditions.require) {
          var p = mtg("div");
          p.id = "mtr-form-field-tc";
          p.className = "mtr-form-field";
          var B = mtg("input");
          B.id = "mtr-form-tc-checkbox";
          B.setAttribute("type", "checkbox");
          B.setAttribute("name", "terms");
          var u = mtg("label");
          u.id = "mtr-form-tc-text";
          u.setAttribute("for", "mtr-form-tc-checkbox");
          u.innerText = Maitre.config.settings.form.terms_conditions.text;
          var x = mtg("a");
          x.id = "mtr-form-tc-link";
          x.setAttribute(
            "href",
            Maitre.config.settings.form.terms_conditions.url
          );
          x.setAttribute("target", "_blank");
          x.innerText = "\ud83d\udd17";
          p.appendChild(B);
          p.appendChild(u);
          p.appendChild(x);
        }
        Maitre.config.settings.form.name.require && c.appendChild(d);
        Maitre.config.settings.form.extra_field.require && c.appendChild(h);
        Maitre.config.settings.form.extra_field_2.require && c.appendChild(q);
        c.appendChild(v);
        Maitre.config.settings.form.terms_conditions.require &&
          c.appendChild(p);
        c.appendChild(g);
        v = mtg("div");
        v.id = "mtr-form-status-container";
        var w = mtg("a");
        w.id = "mtr-form-status";
        w.addEventListener("click", function(a) {
          a.preventDefault();
          f.tools.readCookie("__maitre-session-" + Maitre.uuid)
            ? f.tools.getSessionCookie(!0)
            : (Maitre.config.settings.form.name.require &&
                (n
                  ? (e.setAttribute("required", !0),
                    (d.style.display = "block"))
                  : (e.removeAttribute("required"),
                    (d.style.display = "none"))),
              Maitre.config.settings.form.extra_field.require &&
                (n
                  ? (m.setAttribute("required", !0),
                    (h.style.display = "block"))
                  : (m.removeAttribute("required"),
                    (h.style.display = "none"))),
              Maitre.config.settings.form.extra_field_2.require &&
                (n
                  ? (q.setAttribute("required", !0),
                    (q.style.display = "block"))
                  : (l.removeAttribute("required"),
                    (q.style.display = "none"))),
              Maitre.config.settings.form.terms_conditions.require &&
                (p.style.display = n ? "block" : "none"),
              n || r.focus(),
              (t.innerText = n
                ? Maitre.config.settings.form.submit_button.text
                : Maitre.config.settings.form.submit_button.check_position),
              (w.innerText = n
                ? Maitre.config.settings.form.status.text
                : Maitre.config.settings.form.status.back),
              (n = !n));
        });
        w.setAttribute("href", "#");
        w.innerHTML = Maitre.config.settings.form.status.text;
        v.appendChild(w);
        b.appendChild(c);
        b.appendChild(v);
        b.addEventListener("submit", function(a) {
          a.preventDefault();
          t.innerText = Maitre.config.settings.form.submit_button.submitting;
          t.disabled = !0;
          form_validity = Maitre.form.incomplete(b);
          "valid" == form_validity
            ? Maitre.config.settings.recaptcha.enable && y
              ? grecaptcha.execute(C)
              : ((data = f.tools.getFormValues(b)), Maitre.form.submit(data))
            : ("form_incomplete" == form_validity
                ? alert(Maitre.config.settings.alerts.form_incomplete)
                : "terms_not_accepted" == form_validity
                ? alert(Maitre.config.settings.alerts.terms_conditions)
                : "invalid_phone_number" == form_validity &&
                  alert(Maitre.config.settings.alerts.invalid_phone_number),
              (t.disabled = !1),
              (t.innerText = n
                ? Maitre.config.settings.form.submit_button.check_position
                : Maitre.config.settings.form.submit_button.text));
        });
        (k.settings.design.powered_by ||
          Maitre.config.settings.design.powered_by) &&
          b.appendChild(Maitre.generate.poweredBy("form"));
        Maitre.config.settings.recaptcha.enable &&
          "" != Maitre.config.settings.recaptcha.public_key.trim() &&
          f.libraries.recaptcha();
        a.appendChild(b);
        return a;
      },
      sharing_screen: function() {
        var a = mtg("div");
        a.id = "mtr-sharing-screen";
        a.style.borderTopColor = Maitre.config.settings.design.colors.primary;
        var b = mtg("div");
        b.id = "mtr-sharing-body";
        var c = mtg("div");
        c.id = "mtr-sharing-main-container";
        var d = mtg("div");
        d.id = "mtr-sharing-head";
        var e = mtg("h2");
        e.id = "mtr-sharing-header";
        e.innerHTML = Maitre.config.settings.sharing.header.text;
        e.style.color = Maitre.config.settings.sharing.header.color;
        d.appendChild(e);
        Maitre.config.settings.sharing.subheader.text &&
          "" != Maitre.config.settings.sharing.subheader.text.trim() &&
          ((e = mtg("h3")),
          (e.id = "mtr-sharing-subheader"),
          (e.innerHTML = Maitre.config.settings.sharing.subheader.text),
          (e.style.color = Maitre.config.settings.sharing.subheader.color),
          c.appendChild(e),
          d.appendChild(e));
        c.appendChild(d);
        if ("subscriber_retrieved" != Maitre.response && !A) {
          d = mtg("div");
          d.id = "mtr-sharing-verification-container";
          if (
            "subscriber_not_verified" == Maitre.response ||
            "subscriber_not_verified_sms" == Maitre.response
          )
            d.className = "maitre-reminder";
          e = mtg("p");
          e.id = "mtr-sharing-verification";
          e.innerHTML =
            "subscriber_not_verified" == Maitre.response
              ? Maitre.config.settings.sharing.verification.reminder_email
              : "subscriber_not_verified_sms" == Maitre.response
              ? Maitre.config.settings.sharing.verification.reminder_sms
              : Maitre.config.settings.sharing.verification.sms_confirmation
              ? Maitre.config.settings.sharing.verification.text_sms
              : f.tools.addLinkForCommonEmails();
          d.appendChild(e);
          if ("subscriber_not_verified" == Maitre.response) {
            var h = mtg("a");
            h.id = "mtr-sharing-verification-resend-email";
            h.href = "#";
            h.innerHTML =
              Maitre.config.settings.sharing.verification.resend_email;
            h.addEventListener("click", function(a) {
              a.preventDefault();
              z &&
                ((h.innerHTML =
                  Maitre.config.settings.sharing.verification.resending_email),
                f.tools.sendEMail(
                  Maitre.optin_data.email,
                  Maitre.optin_data.name,
                  Maitre.confirmation_links.email,
                  function(a) {
                    h.innerHTML =
                      Maitre.config.settings.sharing.verification.email_resent;
                    z = !1;
                  },
                  function(a) {
                    h.innerHTML =
                      Maitre.config.settings.sharing.verification.email_resent;
                    z = !1;
                    console.error(Maitre.config.settings.alerts.server_problem);
                  }
                ));
            });
            d.appendChild(h);
          } else if ("subscriber_not_verified_sms" == Maitre.response) {
            var m = mtg("a");
            m.id = "mtr-sharing-verification-resend-sms";
            m.href = "#";
            m.innerHTML =
              Maitre.config.settings.sharing.verification.resend_sms;
            m.addEventListener("click", function(a) {
              a.preventDefault();
              F &&
                ((m.innerHTML =
                  Maitre.config.settings.sharing.verification.resending_sms),
                f.tools.sendSMS(
                  Maitre.optin_data.extra_field,
                  Maitre.confirmation_links.sms,
                  function(a) {
                    m.innerHTML =
                      Maitre.config.settings.sharing.verification.sms_resent;
                    F = !1;
                  },
                  function(a) {
                    m.innerHTML =
                      Maitre.config.settings.sharing.verification.sms_resent;
                    F = !1;
                    console.error(Maitre.config.settings.alerts.server_problem);
                  }
                ));
            });
            d.appendChild(m);
          }
          b.appendChild(d);
        }
        Maitre.config.settings.sharing.leaderboard.show
          ? ((d = mtg("div")),
            (d.id = "mtr-sharing-leaderboard"),
            (d.innerHTML =
              "sweepstake" == k.settings.tool
                ? Maitre.generate.ranking()
                : Maitre.generate.leaderboard()),
            c.appendChild(d))
          : ((d = mtg("div")),
            (d.id = "mtr-sharing-subscriber-position-container"),
            (e = mtg("h4")),
            (e.id = "mtr-sharing-people-referred"),
            (e.innerHTML = f.tools.numberWithCommas(
              Maitre.optin_data ? Maitre.optin_data.people_referred : 1
            )),
            (e.style.color = Maitre.config.settings.design.colors.primary),
            d.appendChild(e),
            (e = mtg("p")),
            (e.id = "mtr-sharing-people-referred-text"),
            (e.innerHTML = Maitre.config.settings.sharing.people_referred),
            (e.style.color = Maitre.config.settings.design.colors.primary),
            d.appendChild(e),
            c.appendChild(d));
        var q = mtg("div");
        q.id = "mtr-sharing-socials-container";
        d = mtg("p");
        d.id = "mtr-sharing-instructions";
        d.innerHTML = Maitre.config.settings.sharing.instructions;
        q.appendChild(d);
        d = mtg("div");
        d.id = "mtr-sharing-plain-container";
        var l = mtg("input");
        l.id = "mtr-sharing-plain-link";
        l.readOnly = !0;
        l.setAttribute("type", "text");
        l.value = Maitre.generate.referralLink();
        var g = mtg("button");
        g.id = "mtr-sharing-link-button";
        g.innerHTML = "Copy";
        g.style.backgroundColor = Maitre.config.settings.design.colors.primary;
        g.addEventListener("click", function(a) {
          E || (a.preventDefault(), f.tools.copyToClipboard(l, g));
        });
        d.appendChild(l);
        d.appendChild(g);
        q.appendChild(d);
        "Facebook;Twitter;Whatsapp;Facebook Messenger;Email;Linkedin;Reddit;Telegram;Line"
          .split(";")
          .forEach(function(a) {
            var b = a.replace(" ", "-").toLowerCase();
            if (
              Maitre.config.settings.sharing.socials[
                a.replace(" ", "_").toLowerCase()
              ].show
            ) {
              var c = mtg("div");
              c.id = "mtr-sharing-social-" + b;
              c.className = "mtr-sharing-social";
              c.setAttribute("data-url", Maitre.generate.socialSharingLink(b));
              "Whatsapp" == a && (c.className += " show-mobile");
              c.addEventListener("click", function(d) {
                "email" == b || "whatsapp" == b || "facebook-messenger" == b
                  ? (window.location = c.getAttribute("data-url"))
                  : window.open(c.getAttribute("data-url"));
                Maitre.optin_data &&
                  f.tools.ajax.request(
                    f.tools.getWidgetUrl() + "/click",
                    "POST",
                    { subscriber_id: Maitre.optin_data.id, social: b },
                    function(b) {
                      console.log(
                        "[Maitre] Tracked click on " + a + " button."
                      );
                    },
                    function(a) {
                      console.error(
                        "[Maitre] Error while clicking social sharing buttons: " +
                          a
                      );
                    }
                  );
              });
              q.appendChild(c);
            }
          });
        c.appendChild(q);
        0 < Maitre.config.settings.sharing.rewards.list.length &&
          ((d = mtg("div")),
          (d.id = "mtr-sharing-rewards"),
          Maitre.config.settings.sharing.rewards.header &&
            ((e = mtg("h3")),
            (e.id = "mtr-sharing-rewards-header"),
            (e.innerText = Maitre.config.settings.sharing.rewards.header),
            d.appendChild(e)),
          (e = mtg("div")),
          (e.id = "mtr-sharing-rewards-list-container"),
          e.appendChild(
            "leadmagnet" == k.settings.tool || "custom" == k.settings.tool
              ? Maitre.generate.bonusList()
              : Maitre.generate.rewardsList()
          ),
          d.appendChild(e),
          c.appendChild(d));
        (k.settings.design.powered_by ||
          Maitre.config.settings.design.powered_by) &&
          c.appendChild(Maitre.generate.poweredBy("sharing"));
        b.appendChild(c);
        a.appendChild(b);
        return a;
      },
      leaderboard: function() {
        var a =
            "<thead><tr><th class='mtr-lb-position'>" +
            Maitre.config.settings.sharing.leaderboard.position +
            "</th><th class='mtr-lb-subscriber'>" +
            Maitre.config.settings.sharing.leaderboard.subscriber +
            "</th><th class='mtr-lb-points'>" +
            Maitre.config.settings.sharing.leaderboard.points +
            "</th></tr></thead>",
          b = "",
          c = "",
          d =
            !p && Maitre.optin_data
              ? Maitre.optin_data.leaderboard.ranking
              : Maitre.generate.testLeaderboard(),
          e = Maitre.optin_data
            ? Maitre.optin_data.email
            : "john.smith@email.com";
        d.forEach(function(a, d) {
          c = a.email == e ? " class='mtr-lb-highlight'" : "";
          b +=
            "<tr" +
            c +
            "><td>" +
            f.tools.numberWithCommas(a.position) +
            "</td><td>" +
            a.email +
            "</td><td>" +
            f.tools.numberWithCommas(a.points) +
            "</td></tr>";
        });
        return (
          "<table id='mtr-lb-table' cellpadding='0' cellspacing='0'>" +
          a +
          "<tbody>" +
          b +
          "</tbody></table><div id='mtr-lb-footnote'>" +
          Maitre.config.settings.sharing.leaderboard.footnote +
          "</div>"
        );
      },
      ranking: function() {
        var a =
            "<thead><tr><th class='mtr-lb-subscriber sweepstake'>" +
            Maitre.config.settings.sharing.leaderboard.subscriber +
            "</th><th class='mtr-lb-points'>" +
            Maitre.config.settings.sharing.leaderboard.points +
            "</th></tr></thead>",
          b = "",
          c = "",
          d = p
            ? Maitre.generate.testLeaderboard()
            : Maitre.optin_data.leaderboard.ranking,
          e = Maitre.optin_data
            ? Maitre.optin_data.email
            : "john.smith@email.com";
        d.forEach(function(a, d) {
          c = a.email == e ? " class='mtr-lb-highlight'" : "";
          b +=
            "<tr" +
            c +
            "><td>" +
            a.email +
            "</td><td>" +
            f.tools.numberWithCommas(a.points) +
            "</td></tr>";
        });
        return (
          "<table id='mtr-lb-table' cellpadding='0' cellspacing='0'>" +
          a +
          "<tbody>" +
          b +
          "</tbody></table><div id='mtr-lb-footnote'>" +
          Maitre.config.settings.sharing.leaderboard.footnote +
          "</div>"
        );
      },
      testLeaderboard: function() {
        var a = [
          {
            position: 32,
            name: "",
            email: "test*************.com",
            points: 3,
            people_referred: 21
          },
          {
            position: 33,
            name: "",
            email: "test*************.com",
            points: 4,
            people_referred: 18
          },
          {
            position: 34,
            name: "",
            email: "test*************.com",
            points: 4,
            people_referred: 5
          }
        ];
        a.push({
          position: 35,
          name: Maitre.optin_data ? Maitre.optin_data.name : "John Smith",
          email: Maitre.optin_data
            ? Maitre.optin_data.email
            : "john.smith@email.com",
          points: 1,
          people_referred: 1
        });
        a.push({
          position: 36,
          name: "",
          email: "test*************.com",
          points: 4,
          people_referred: 2
        });
        a.push({
          position: 37,
          name: "",
          email: "test*************.com",
          points: 4,
          people_referred: 0
        });
        a.push({
          position: 38,
          name: "",
          email: "test*************.com",
          points: 5,
          people_referred: 0
        });
        return a;
      },
      popup: function(a) {
        var b = mtid("mtr-popup-body");
        if (b) (b.innerHTML = ""), b.appendChild(a);
        else {
          var c = mtg("div");
          c.id = "mtr-popup-container";
          b = mtg("div");
          b.id = "mtr-popup-body";
          b.appendChild(a);
          var d = document.getElementsByTagName("body")[0];
          d.className += " noscroll";
          a = mtg("div");
          a.id = "mtr-popup-close";
          a.innerHTML = "\u00d7";
          a.addEventListener("click", function(a) {
            a.preventDefault();
            mtid("mtr-form") && mtid("mtr-form").reset();
            d.classList.remove("noscroll");
            c.remove();
            Maitre.config.callbacks.hasOwnProperty("popupClose") &&
              Maitre.config.callbacks.popupClose();
          });
          if (p) {
            var e = mtg("a");
            e.id = "mtr-popup-test-mode-container";
            e.innerHTML = "Test Mode &#9432;";
            e.setAttribute(
              "href",
              "https://support.maitreapp.co/article/18-how-to-test-maitre"
            );
            e.setAttribute("target", "_blank");
            c.appendChild(e);
          }
          c.appendChild(a);
          c.appendChild(b);
          d.appendChild(c);
          setTimeout(function() {
            c.className += " show";
            Maitre.config.callbacks.hasOwnProperty("popupOpen") &&
              Maitre.config.callbacks.popupOpen();
          }, 100);
        }
      },
      rewardsList: function() {
        var a = mtg("div");
        a.id = "mtr-rewards";
        var b = Maitre.config.settings.sharing.rewards.list,
          c = mtg("ul");
        c.id = "mtr-rewards-list";
        0 < b.length &&
          (b.forEach(function(a) {
            var b = mtg("li");
            Maitre.config.settings.sharing.rewards.show_images ||
              b.classList.add("mtr-no-image");
            if ("" != a.description.trim()) {
              var d = mtg("div");
              d.classList.add("reward-description");
              d.innerText = a.description;
              b.appendChild(d);
            }
            d = mtg("div");
            d.classList.add("reward-info");
            var f = mtg("div");
            f.className = "reward-image";
            f.style.backgroundImage = "url(" + a.image + ")";
            var g = mtg("h4");
            g.innerText = a.title;
            var l = mtg("div");
            l.className = "reward-referrals";
            l.style.color = Maitre.config.settings.design.colors.primary;
            l.innerText = a.header;
            Maitre.config.settings.sharing.rewards.show_images &&
              d.appendChild(f);
            d.appendChild(l);
            d.appendChild(g);
            b.appendChild(d);
            c.appendChild(b);
          }),
          a.appendChild(c));
        return a;
      },
      bonusList: function() {
        var a = mtg("div");
        a.id = "mtr-rewards";
        var b = Maitre.config.settings.sharing.rewards.list,
          c = mtg("ul");
        c.id = "mtr-rewards-list";
        var d = Maitre.optin_data ? Maitre.optin_data.people_referred : "3";
        0 < b.length &&
          (b.forEach(function(a) {
            var b = mtg("li");
            Maitre.config.settings.sharing.rewards.show_images ||
              b.classList.add("mtr-no-image");
            if (d >= a.referrals) {
              b.classList.add("unlocked");
              var e = mtg("div");
              e.className = "reward-ribbon";
              var g = mtg("span");
              g.innerText = Maitre.config.settings.sharing.rewards.unlocked;
              g.style.backgroundColor =
                Maitre.config.settings.design.colors.primary;
              e.appendChild(g);
              b.appendChild(e);
            }
            "" != a.description.trim() &&
              ((e = mtg("div")),
              e.classList.add("reward-description"),
              (e.innerText = a.description),
              b.appendChild(e));
            e = mtg("div");
            e.classList.add("reward-info");
            g = mtg("div");
            g.className = "reward-image";
            g.style.backgroundImage = "url(" + a.image + ")";
            var l = mtg("h4");
            l.innerText = a.title;
            var k = mtg("div");
            k.className = "reward-referrals";
            k.style.color = Maitre.config.settings.design.colors.primary;
            k.innerText =
              0 < a.referrals
                ? f.tools.numberWithCommas(a.referrals) +
                  " " +
                  Maitre.config.settings.sharing.rewards.referrals
                : Maitre.config.settings.sharing.rewards.signup_bonus;
            Maitre.config.settings.sharing.rewards.show_images &&
              e.appendChild(g);
            e.appendChild(k);
            e.appendChild(l);
            b.appendChild(e);
            c.appendChild(b);
          }),
          a.appendChild(c));
        return a;
      },
      points: function() {
        return Maitre.optin_data
          ? f.tools.numberWithCommas(Maitre.optin_data.points)
          : 12;
      },
      referralLink: function(a) {
        if (Maitre.optin_data) {
          var b = Maitre.optin_data.referral_link;
          a &&
            (b = Maitre.optin_data.referral_link.includes(
              "https://maitreapp.co/l/"
            )
              ? b + ("?mws=" + a)
              : b + ("&mws=" + a));
          return b;
        }
        return Maitre.config.defaults.default_url + "?mwr=ABC123";
      },
      socialMessage: function(a, b) {
        if (a) return a.replace(/%referral_code%/gi, b);
      },
      socialSharingLink: function(a) {
        var b = "";
        "facebook" == a
          ? (b =
              "https://www.facebook.com/sharer.php?u=" +
              encodeURIComponent(this.referralLink("facebook")))
          : "twitter" == a
          ? (b =
              "https://twitter.com/intent/tweet?text=" +
              encodeURIComponent(
                this.socialMessage(
                  Maitre.config.settings.sharing.socials.twitter.message,
                  this.referralLink("twitter")
                )
              ))
          : "email" == a
          ? (b =
              "mailto:changeThisEmail@mail?subject=" +
              encodeURIComponent(
                Maitre.config.settings.sharing.socials.email.subject
              ) +
              "&body=" +
              encodeURIComponent(
                this.socialMessage(
                  Maitre.config.settings.sharing.socials.email.message,
                  this.referralLink("email")
                )
              ))
          : "whatsapp" == a
          ? (b =
              "https://api.whatsapp.com/send?text=" +
              encodeURIComponent(
                this.socialMessage(
                  Maitre.config.settings.sharing.socials.whatsapp.message,
                  this.referralLink("whatsapp")
                )
              ))
          : "facebook-messenger" == a
          ? (b = this.MessengerLink())
          : "linkedin" == a
          ? (b =
              "https://www.linkedin.com/shareArticle?mini=true&url=" +
              encodeURIComponent(this.referralLink("linkedin")) +
              "&title=" +
              encodeURIComponent(
                this.socialMessage(
                  Maitre.config.settings.sharing.socials.linkedin.message,
                  this.referralLink("linkedin")
                )
              ))
          : "reddit" == a
          ? (b =
              "https://www.reddit.com/submit?url=" +
              encodeURIComponent(this.referralLink("reddit")) +
              "&title=" +
              Maitre.config.settings.sharing.socials.reddit.message)
          : "telegram" == a
          ? (b =
              "https://t.me/share/url?url=" +
              encodeURIComponent(this.referralLink("telegram")) +
              "&text" +
              encodeURIComponent(
                Maitre.config.settings.sharing.socials.telegram.message
              ))
          : "line" == a &&
            (b =
              "https://line.me/R/msg/text/?" +
              encodeURIComponent(
                this.socialMessage(
                  Maitre.config.settings.sharing.socials.line.message,
                  this.referralLink("line")
                )
              ));
        return b;
      },
      MessengerLink: function() {
        return f.tools.mobileCheck()
          ? "fb-messenger://share?app_id=885310524899839&amp;redirect_uri=" +
              encodeURIComponent(Maitre.config.defaults.default_url) +
              "&amp;link=" +
              encodeURIComponent(this.referralLink("facebook_messenger"))
          : "https://www.facebook.com/dialog/send?app_id=885310524899839&link=" +
              encodeURIComponent(this.referralLink("facebook_messenger")) +
              "&redirect_uri=" +
              encodeURIComponent(Maitre.config.defaults.default_url);
      },
      poweredBy: function(a) {
        var b = mtg("div");
        b.id = "mtr-" + a + "-branding-container";
        a = mtg("a");
        a.className = "mtr-form-powered-by";
        a.setAttribute(
          "href",
          Maitre.base_url +
            "/maitre-link?utm_source=powered_by&utm_medium=widget&utm_campaign=Inbound&ref=" +
            window.location.hostname +
            "&uuid=" +
            Maitre.uuid
        );
        a.innerHTML = "powered by <strong>Maitre</strong>";
        b.appendChild(a);
        return b;
      },
      floating_button: function() {
        var a = mtg("div");
        a.id = "maitre-floating-button";
        a.innerText = Maitre.config.settings.floating_button.text;
        a.style.backgroundColor = Maitre.config.settings.floating_button.color;
        a.classList.add(Maitre.config.settings.floating_button.position);
        a.addEventListener("click", function(a) {
          a.preventDefault();
          Maitre.config.settings.sharing.open_if_signed_up &&
          f.tools.readCookie("__maitre-session-" + Maitre.uuid)
            ? f.tools.getSessionCookie(!0)
            : Maitre.generate.popup(Maitre.generate.form());
        });
        return a;
      }
    };
    if (Maitre.uuid) {
      var k = {};
      k.settings = {
        env: "production",
        tool: "waitlist",
        test_mode: false,
        default_url: "https://samsays.co",
        floating_button: {
          enable: false,
          text: "Join our referral program",
          color: "#3d85c6",
          position: "center"
        },
        one_click_signup: {
          enable: true,
          name: "maitre_name",
          email: "maitre_email",
          extra_field: "maitre_extra_field",
          extra_field_2: "maitre_extra_field_2"
        },
        design: {
          enable: true,
          custom_css: "",
          powered_by: true,
          colors: { primary: "#7a7dd3" }
        },
        recaptcha: { enable: false, public_key: null },
        facebook_pixel: { enable: null, id: null },
        lambda: {
          email_endpoint:
            "https://wm6c1kxpcl.execute-api.us-west-1.amazonaws.com/prod/confirmation_email",
          sms_endpoint:
            "https://wm6c1kxpcl.execute-api.us-west-1.amazonaws.com/prod/sms",
          email_authorization:
            "Mox7Oyy/ijon9yIUrdjj1i7YY5yiLKvx3NFc6VzlTPU8n+t51BU63LP4P+GAtqUXhOYkm1xAHgWo2omkpip4yA==--KKMvr5EjJod2k8gx160+Vg==",
          sms_authorization:
            "PzNd1OTCd9TQfsr7+tD9qLFUdiYVV3NZ4/xGuSFgSGaHTmZyRtPfSqKMjExvbhxH--yzXSZMMDxxUKO9P4P43wog==",
          template_id: "211080893889324539",
          sms_from: "2RvIs1p3UEIZeNiI/E8lTw==--PkhIj2WWFqJeTfXeK2hzWQ==",
          sms_body: null
        },
        form: {
          border: "#7a7dd3",
          cover:
            "https://s3.amazonaws.com/maitre/settings/covers/000/008/033/large/data?1541118447",
          header: { text: "Sign Up for Early Access", color: "#2b2f3e" },
          name: { require: true, placeholder: "Name" },
          email: { placeholder: "Email" },
          extra_field: {
            require: false,
            placeholder: "Extra field 1 (Eg: Phone)"
          },
          extra_field_2: {
            require: false,
            placeholder: "Extra field 2 (Eg: Country)"
          },
          submit_button: {
            text: "Submit",
            check_position: "Check status",
            submitting: "Submitting...",
            color: "#7a7dd3"
          },
          status: { text: "Check my status", back: "Back" },
          terms_conditions: {
            require: false,
            text: "I accept the Terms \u0026 Conditions",
            url: null
          }
        },
        sharing: {
          popup: true,
          open_if_signed_up: false,
          header: { text: "Congratulations, you are in!", color: "#2b2f3e" },
          subheader: { text: "", color: "#666" },
          people_referred: "People referred by you",
          instructions: "Invite you friends with your unique referral link 👇",
          verification: {
            text_email: "Don't forget to confirm your email",
            reminder_email:
              "Your email hasn't been verified yet.\u003cbr\u003eCheck your inbox - including the junk folder - and if you don't find it click the link below to resend it.",
            resend_email: "Resend confirmation email",
            resending_email: "Sending email...",
            email_replace: "confirm your email",
            email_resent: "Email has been sent. Check your inbox.",
            sms_confirmation: false,
            text_sms: "Don't forget to verify your phone number.",
            reminder_sms:
              "Your phone number hasn't been verified yet.\u003cbr\u003eCheck your phone and if you don't find it click the link below to resend the verification SMS.",
            resend_sms: "Resend verification SMS",
            resending_sms: "Sending sms...",
            sms_resent: "SMS has been sent. Check your phone."
          },
          socials: {
            twitter: {
              show: true,
              message:
                "I just signed up on this awesome website! %referral_code%"
            },
            facebook: { show: true },
            facebook_messenger: { show: true },
            email: {
              show: true,
              message: "%referral_code%",
              subject: "Check this out"
            },
            whatsapp: {
              show: true,
              message: "You should really check this out %referral_code%"
            },
            linkedin: { show: false, message: null },
            reddit: { show: false, message: null },
            telegram: { show: false, message: "" },
            line: { show: null, message: "" }
          },
          leaderboard: {
            show: true,
            position: "Position",
            subscriber: "Subscriber",
            points: "Points",
            footnote: "1 referral = 1 point"
          },
          rewards: {
            header: "This is what you can win",
            show_images: true,
            list: [],
            referrals: "Referrals",
            unlocked: "UNLOCKED!",
            signup_bonus: "Sign-up bonus"
          }
        },
        alerts: {
          subscriber_not_found: "Email not found.",
          subscriber_already_promoted: "You have already been promoted.",
          form_incomplete:
            "Something is missing. Please fill out the form before submitting.",
          server_problem:
            "We are experiencing some issues on our server. Please try again.",
          failed_recaptcha: null,
          terms_conditions: "You must accept the Terms \u0026 Conditions",
          invalid_phone_number: null
        }
      };
      k.callbacks = {};
      k.defaults = {
        form_container_id: "maitre-widget",
        default_url: f.tools.getDefaultUrl(k.settings)
      };
      Maitre.config = k;
      if (window.MaitreConfig) {
        var H = k.settings.test_mode;
        Maitre.config = f.tools.extend(k, window.MaitreConfig);
        p = H || Maitre.config.settings.test_mode;
      }
      if (!Maitre.loaded) {
        if (Maitre.config.callbacks.hasOwnProperty("onLoad"))
          Maitre.config.callbacks.onLoad();
        Maitre.config.settings.design.enable &&
          Maitre.generate.stylesheet(
            "*,\n*:before,\n*:after {\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  box-sizing: border-box\n}\n\nbody.noscroll {\n  overflow: hidden !important;\n  overflow-y: hidden !important;\n}\n\n#mtr-optin-form , #mtr-sharing-screen {\n  font-size: 18px;\n}\n\n#mtr-optin-form *, #mtr-sharing-screen * {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font-family: inherit;\n  vertical-align: baseline;\n  text-transform: initial;\n  color: inherit;\n  color: #000;\n  outline: 0;\n  line-height: 1.2;\n  list-style: none;\n  text-rendering: optimizeLegibility;\n  float: none;\n  -webkit-font-smoothing: antialiased !important;\n  transition: All 0.25s ease;\n  -webkit-transition:All 0.25s ease;\n  -moz-transition:All 0.25s ease;\n  -o-transition:All 0.25s ease;\n  letter-spacing: normal;\n}\n\n/*Floating button*/\n#maitre-floating-button {\n  border-radius: 5px;\n  font-size: 1em;\n  padding: 0.75em 1.2em;\n  text-align: center;\n  font-weight: 700;\n  border: none;\n  letter-spacing: 0.5px;\n  color: #fff;\n  position: fixed;\n  box-shadow: 0px 0px 12px rgba(0, 0, 0, .18);\n  bottom: 0.7em;\n  -webkit-animation-name: slideInUp;\n  animation-name: slideInUp;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-fill-mode: initial;\n  animation-fill-mode: initial;\n  -webkit-transition-delay: 0s, 500ms;\n    -moz-transition-delay: 0s, 500ms;\n    -o-transition-delay: 0s, 500ms;\n    transition-delay: 0s, 500ms;\n}\n\n#maitre-floating-button.left {\n  left: 0.7em;\n}\n\n#maitre-floating-button.right {\n  right: 0.7em;\n}\n\n#maitre-floating-button.center {\n  left: 50%;\n  transform: translateX(-50%);\n  -webkit-animation-name: slideInUpCenter;\n  animation-name: slideInUpCenter;\n}\n\n#maitre-floating-button:hover {\n  opacity: 0.8;\n  cursor: pointer;\n}\n\n/*Form*/\n#mtr-optin-form {\n  width: 95%;\n  max-width: 550px;\n  margin: 0 auto;\n  text-shadow: 0 0 0;\n  box-shadow: 0 0px 12px rgba(0, 0, 0, .18);\n  border-radius: 5px;\n  background: #fff;\n}\n\n#mtr-form {\n  border-top-style: solid;\n  border-top-width: 4px;\n  border-radius: 5px;\n  width: 100%;\n  text-align: center;\n}\n\n#mtr-form-cover {\n  width: 100%;\n  padding-bottom: 60%;\n  height: 0;\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center center;\n}\n\n#mtr-form-header {\n  padding: 0.7em 0.8em 0;\n  font-weight: 700;\n  font-size: 1.7em;\n  color: #2b2f3e;\n  overflow-wrap: break-word;\n  text-align: center;\n}\n\n#mtr-form-fields {\n  padding: 6% 8% 3%;\n  /*margin-bottom: 10px;*/\n}\n\n\n#mtr-form-fields .mtr-form-field {\n  margin-bottom: 15px;\n  width: 100%;\n}\n\n#mtr-form-fields input {\n  border: solid #ccc 2px;\n  border-radius: 5px;\n  padding: 0.5em 0.8em;\n  width: 100%;\n  font-size: 1em;\n  line-height: 1em;\n  box-shadow: none;\n  background: #f1f1f1;\n  color: #2b2f3e;\n  text-align: left;\n  outline: 0;\n  height: auto;\n}\n\n#mtr-form-submit-button {\n  width: 100%;\n  border-radius: 5px;\n  font-size: 1em;\n  padding: 0.75em 0;\n  text-align: center;\n  font-weight: 700;\n  border: none;\n  letter-spacing: 0.5px;\n  color: #fff;\n}\n\n#mtr-form-submit-button:hover {\n  opacity: 0.9;\n  cursor: pointer;\n}\n\n#mtr-form-field-tc {\n  padding: 0.75em 0;\n}\n\n#mtr-form-tc-checkbox {\n  position: absolute;\n  opacity: 0;\n  z-index: -1;\n  width: 1.5em !important;\n  height: 1.5em !important;\n}\n\n#mtr-form-tc-text {\n  position: relative;\n  display: inline-block;\n  padding: 0 0 0 2em;\n  height: 1.5em;\n  line-height: 1.5;\n  cursor: pointer;\n  pointer-events: auto !important;\n}\n\n#mtr-form-tc-link {\n  text-decoration: none;\n  display: inline-block;\n  margin-left: 0.5em;\n}\n\n#mtr-form-tc-text::before, #mtr-form-tc-text::after {\n  transition: .25s all ease;\n  position: absolute;\n  top: 0;\n  left: 0;\n  display: block;\n  width: 1.5em;\n  height: 1.5em;\n}\n\n#mtr-form-tc-text::before {\n  content: \" \";\n  border: 2px solid #bdc3c7;\n  border-radius: 20%;\n}\n\n#mtr-form-tc-text::after {\n  line-height: 1.5;\n  text-align: center;\n}\n\n#mtr-form-tc-checkbox:checked + label::before {\n  background: #fff;\n  border-color: #fff;\n}\n\n#mtr-form-tc-checkbox:checked + label::after {\n  color: #2c3e50;\n  content: \"\\2714\";\n  -webkit-transform: scale(1);\n  transform: scale(1);\n}\n\n#mtr-form-status-container {\n  padding-bottom: 1.6em;\n  text-align: center;\n}\n\n#mtr-form-status {\n  font-size: 0.8em;\n  color: #666666;\n}\n\n\n/*Maitre branding*/\n#mtr-form-branding-container, #mtr-sharing-branding-container {\n  padding: 0.5em 0;\n  background-color: #f5f5f5;\n  border-radius: 0 0 5px 5px;\n  text-align: center;\n}\n\n#mtr-form-branding-container .mtr-form-powered-by, #mtr-sharing-branding-container .mtr-form-powered-by {\n  font-size: 0.65em;\n  color: #666;\n  font-weight: 400;\n  text-decoration: none;\n  line-height: 1;\n}\n\n#mtr-form-branding-container .mtr-form-powered-by strong, #mtr-sharing-branding-container .mtr-form-powered-by strong {\n  color: #666;\n}\n\n\n/*Sharing screen*/\n#mtr-sharing-screen {\n  width: 95%;\n  max-width: 680px;\n  margin: 0 auto;\n  border-radius: 5px;\n  border-top-style: solid;\n  border-top-width: 4px;\n  background: #fff;\n  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);\n}\n\n#mtr-sharing-body {\n  padding: 5% 0 0;\n  text-align: center;\n}\n\n#mtr-sharing-verification-container {\n  padding: 0.55em;\n  background: rgba(77, 86, 108, 0.05);\n  margin-bottom: 1.2em;\n  margin-top: -5%;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAAErdZjwAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAGm5JREFUeNpiYBgFo4AO4ODhw/+B+D02ORYaWTgfSCWgCQvQ1AEgXyLz7W1tGXHJIQNGalkIBIZASy9gUwdyDJB2AHL3IzuMpBAAGhAApNbj8iUeR06Aqj0A5JMWBfiCldgQAuopxKeOBU3TfSClgCTUCDSggdxowuZgoB39GI6CZpP/+BILhekDpxwTjjyrQKHlHyhyNbkhAipsCOkhGAKwuIPGXyOSY+4T4QYBIhLqBayOJMbl+EKFlNBCVoucCxJhhQahFI1sALSQ+c9A69SLQ/19MtMKSI8AxQ6ghmexZcMCelbVTFjiuZ+eDmChp2WgYhhIFdDVAYQqNGwO+IAvO5KRkwKBZm0gqUFCigNgDQ1yq20WWgQr1RMh0MLzQMoASWgCoYYGpQ4QpKYvR8EowAcAAmgUjQJ6VMEJNOkdk9O2xFaaslDJQpx9SqhjEoF4PtVCANqifU9ER/Q/ctOdohAgt3JC608oAPkPiAoBLOM8F4CaDUlxMLojsYmx0KKhATXnAtHtASSLHUFDKdTIAcSGFnrHZD81ekf4Qo5gzxi5vwfEDdTI//jUsCD32aHjAoponch6YtIDxSFHYFxHAd/4AKjRSqwDcIUAoTh9AMuyaI5QhMoZkJBjsI9D4OyzEzFqQrXQptf4ALI9TANYTRcMmAOQxyFYsFWtyFmRhu2EBVgrI0q65uT0KVlo7EuCBRgLtS0EdWyBlhI9VozNAY34ogFaP9QjCT2gJM0QNUJCy646IzXGeUbBKKAEAARg32qLEIZh6IICkIATcAAONgfgBAmTgAQcIAELOICUA65bv5J+rYPmuOPPujZpkr6XdPVXpcp/y2yLzw703uHB2c/aAKiggJFXx2Mv4IXPimbNxgeuwMRKHhp7h9IJ9CwdbBJIhAxKKrszkh4X2nm899v91FXBqF4AGeKRFZPc+QyFUVE8XVKMABHjcT0ufibwprZ5l5qppSqWARw7eceXrUrI+hTXtoWI1gAG5c84eF/QacCi2xQvGNTv8e8mZVPlzmAKRhxz1zXjBzpxQsDIwDk9qADF5S6Q9naohxG1OoFv8iDmDnYpI3TXuaEAlgVccMA2YFIRPjtOXqF4YKAXKHNDyBHisRBjXkmdX0w6QS43JCwuKlgK1inmteaSGCTpEvEHoxNh7pxE0WlhicXux3ZfHKstiwvIFyNLv7kngx4OXwFG8ggCJLHJUKxThMoGH7m8wIIfkvATlgF8ixc2vm6QI85zyuFVPt8nQaR4nDykvAwgscXo8Vi0AQyYIIgvVKlSpcrU8hSAvSs6ahiGoSbXAcoGdANGgA3aDTpCR4AJukI3aEdgA9ig3YAR4HIXg2pkW7Itx7h6xx+Q5imSLStPqv4oFAqFQnG76KJBlaMH6MIAiGY6+Ri++CeE/7TMdR8CHG0RUqcgl+7uGiK8NQkVJof82JGx54TBYmbSWeKqqYJ8ZZxJGmOaXAM8A8AguCU2Wz5/bXIN4Kg9c7wnNPqnugcgXdUusiZ3EUjec3aMEo1TMblrUXkdnD6EPeFJOyy3BhD35Ox26ACssU+Ee93GRBfUwTIiet9M1w+9H3yb7ndcdA/sRXBOLU9i3Hv/ntw8GcuvjbCGJ0LmScrwMARc8qzhDcKw06s+Eoz3HuIxuBYGeGwkRYauz3kgGwoP0lRUk9miO8c5n7oOYCKpFfIPcJLDuhL5B/MrolgVuBbZAD/q6skQ7ocfK2kIzyCRuhS6VngbjLlMiv63xpaXEwasTBCSdDxgjcwXyTlLVMs1Bs9N7AnGsCHiPvlzxoyTJThIPRdeU14oBrDKrB3DK07AGBfX/ZiDgT7BdUudJQ6ePAdPhUtpArmdJZIK9RAnsYoQKFFdpdhYZydW2qqFUJGxeJscYV0QEUiGOGGLoE03lxJe4ckt7O+l1KE8TjWbJUb3r/FZPk4D9RgquFZsasa9y8lngItzDO0BKCff3P2V6Qw+ToO5cQyEmDn2RhpyChnAjn5bd0B459tpigwhaJT0VyxLFU2FZ3Jrdq8ReWJqa16AfdcB9eDFOQyxXjRWIF282arYGxYhwvtIbSK7Ws0Zs72VfjOU2v0pbYDTtLhEXzQmknanr7oo9g0fSSFQOgxaa7dbVIrl2HF3trGp3NZZ0gtTghhq9vlEXA8Yb/boi1XKnmwSxVBNeAC2DrTUAF3VAJJ7csshMGKMfVfz10QHuEKhUCgUCkUKvgVg72qPm4iBqDXjAuwOTAeU4HSQElwCqQBcAekAdwAdQAnugHSAOyCjGcHYOum00q5OK917kx/Jn5ytt1/a2w/8AAAAAAAAAAAAAMB6YHAEbeCKQGzlC6n8sFapAASgLsmWXNskI9J9XEMIIAB8kj85kkv7amylhJ2m8kp47y5eWbEFhSSSU0WKKVwdybGNVUdir9AfaaWFBSjwxxFYcl9yCzcjxN/3UVZdPr5dEclHRzLHH4sVqs5MFvPN/NX7zN8lFdcMRvLJkczpc61e0BcpKow2JwesAHsCW7cWQMAfvzmSfzT47NbVhOr/UzX/l81jrbENOr8MaQFa+mNNWk+wAiIF5ttGhyHij50pVFdw7n3X2LjF3KpiO53wvq/kWbUF6MUfVyY/2P1UmtAJWAH2UBPuXJxu/fEC5Ieud6zBqpGbAys5lOoTPriA48T0x+e1NFFIaz1FsDj/2whpdRf+uJHWi8+dDTyn2LJsAxo/R/7NPQwtUY/nFhzTULHZ17rOw93fP0vduSFKcTJCbTVdWanWL5FM+ivxTEOU5r2Tspxr22W0PeUUV7lUi3+Ip5JnG6J0BckkdMP7uDoXchtQ66sOtODwVCIAk+UYVOmiDMLoNa6ILRpoNUmJw1PyGhiQruIhAO7+al1ITlJIVVwR0frm8z64PM2lgp82j7M/DqUf0mn33vvgu0Rc8c25mKZxRcyiKZqfxuLJ5Ep97S+uKa6IaH3uyrMm1onKU0oAQi8yFh+NsnRcEdukpHV2JocnysDAyWtMDQdRK66IaL2mpUqiPJlCE6My8UOIK6L5iowSrZ6up0meqAIgknRoeDC5cQXr1tPwe062HqZ44syK6zrTl4gr9r0mq3J5yhGASRKkx4HioyOUop7jyTClS31wtFIhIPOUuz3Dz3p9xHGrBJknIyBdcAV9WIEgTyX7cz4EHnbAkasDiadsAYjU2v/GeavDjcJTsemu3bQIkDiwvv2rf/efweR6y2kMqdq0CPwn+dmRzHGz0aJR6X25i1fFDELypLAjE9Ytn0vS89zWsFcv6WB/hwBMCd45gk+Mf2M1+EX6TazELiTfCqh7X67UH4dwcSQvloaWaA71mxaPA5Ms4Y/FevtVWICIFRDfxN6RP745Lb708H2lBOAQuGOqfKMm5I+vjuRfvVs1I3iwalLEgv74rGnIhGoBiAjBUy0tGdEft4D0hJC3jVDT4hr9cfcWIGIFok2Lzh9/3vCHMA7hj0cRgFD93b9F1KVQN/QJApAZEBKANPIoAnBn3u3VcAd/DAAAAAAAAAAAAAAA0B7vArB3rddp9EBUy6EA0wF0EDogHdgdQAdxBUAFuAO7A7sD3IGdCrwdQAf5rPNNcmCRdvWY2ZW0957kh4+TfejOzkujGfwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAgPKArl4JoKNngWj7PQjAcKTrA7H6YKzLxBMxIZiCit4Ij2laIdaDEQIgS3rIJHb4ABkTvia1Phe4vMjpaQhAHOFzUuvRvQ/U/213X9v+oUTPJZgAf9J3yjA/2AO1MrR1/b7uIB3XoQG6Cb8nwmOmo7Sqb9usQsM92Yd2QgP4xeSueFeOfX1pJJ9J3S8NgqGf6ycEYNiY3IQzqfWngNDQ5D/MLq57+Uwr7nefjpTwVBo7myaVXl5Tm41nybWoRkR6bEz+SV/5G9PznAwa52ZaqfTY3mnBhCfbSZRa6d0Z7L7LqNoDaR8IgFRMLtmPkJ5z3WL3Tc90+U53nM8zzZz0HFvJflk0jc2X2DeFWkcqXJ3Yq8wIXxHhYjG58POb7H7nbAXJwd3TxAnn6u2/4U6gBLzLzmL3QwZr6PUoUwBoQ+UQaesefWPyHgTZlD52Hby9V3Hp53RNwBiGO1hSvV5qXGoWw3SgBYmNyWv6ypOfVGrb5GGw4QcPDTKsAIx1ugdFKXMD+VWg0F9e6wfHM06FXpwrJt8P7bwxOLChdv/Gr1Ed9QKD+gAY7+Jk96OGavpMYxHXAFwxeUcSJFfyPyx2n3ui6oHWUF4AMN/Hy9/5wWT3TdHOmvN5p2OLyXuAyU4/MF37sSkA2t+KCX8rD/tVREw+gN3/1NU9gvd4+77+A5sGCCA/m5hcmPyjxe4vhW8dE2ldCwDtUzs5b5jwdbVu2uavDL+SGKD9GBltXWHS+LnLwdDpywrk36CrtIsNJn+KHE8WAejCWpsI+nsP3q0ms+7Z8Q3WCE0f4F25b8q8fr/839DuZ2mxvCP5z5avdCF86+aZgTmXBghR7fpBTqQVdiOz++ue7H4TG64LVQ4qTauy38qvPPlMWuGzYAEwqf7eNqxMPIX4Zi4CcJXFopMsPvY/Kk5NlPyg0i5pAQzJNpqcwKcOL/SBbrSkL70zTr1wHNcFkG/MjPZJvgtPwRrAIl2thxIDTszWZCLqzMjXxJ8Mv1oM8S6+PMWEgYcOrbAjrTAjD7UL2mv9Iq3wnJEMnCy5kVQE+cClAb6aoYWvfaE8gW8Bw0OqKWXTmvRt9118EV+ebLuBexV5KJGIrC7iZRf7n2RuoaW0azbwo0UfHq087Ev0ti6Vih09ExeD1gK22P1lCmFuLE8+AsCq7igiSD63YIn3kwltY3lqcwKbtpj1UKKu/aONpcpwLxP0/T/IcXztaXFtpV0p5TWieKo61HWzpn0maZcpvXr0fImNRCGpzYmV6NTFYFaDeZq0fKE1R5jhqRV09cyMFnnv+N+eSSt80WJwQbK0i3PNonjy3g7u8cUGyy20lHblUvW05hKAfQISrp2aJQmD6xcYXLcwYGlXDIJ5qgK+hiSSNR65hX9fcFdugc46mARglnq9QyhPk4B7bVN4YX24krSCLr6oHf6LS93C0eJk5ljssuXSAB+qcdAhNU+YI7fQUtq1yIHtUJ5cNMA+F5GPyS1YrrfI6IsP4mnisKhvBmnbZSAMvnULN3Y/J30fytMk8H7bjBYmJLdQyoHVLZcAvBSwGK65hXNujShieHJy5iw7YosSzv81Ur7nBLZ4Y97Fm6fK4+KshxKB3vIBrTz5+ABNm4iTQWnCiycfAdhjbcsLB33r/ERblwNiZsDK0yTyXgcsd97hoK8AvDd+vsPaJokmT3MuAUBfgDzgzJOXAJgKMumoFJAQfHiaMNzvF5Y8C/ziEoAnrGUWcOLJWwBMZ9CpmhdIC79d/hFXs2hdhLHEmg8a+89VQIPuUAGolUDrcsCb9J1y35o/cwqASOtyoJPwlQps0G3b5awiHob98Chws8YcQ7NadwM5B0ZEty4HWBp0ew2yjhGAN4UtYQ7CBx1kHWMCtBPY6+HRgkhPZpB1FfkiYhMtCyM82aFZ3EOjtP3agPA8BllzCABr6/LMSc9yaFbF8OJJHh5NOSa/wOBzFyTmBh6U27GsMcbkSQyy5hYAttblBcbkSiWeIOMQAK3CjojJr2LybIZmVUwL96ePkCXRmLxWGQ/NkhoerXeodokSPspB1tIC8KJ6bCA1UEy+L3EABpcJMB1KHKyVKgZZ9ywAFj+gt8OjGGSdhg9wboRL94KEY5B1ggIQ3bp87DF51ibAYgaCD49STL6N1CRZxeQlhYF/cVAebUsCZg8VFZOXIADanq4ufr7rISbHIOuETIBW280e+/+qhCgm30bmDN7pK/8EfYkJgMUPaGoFxOQj8gFUIPkvSmj8OiAvAJuAcBAxeSkmgMzAySFeR0xeqgBYQrpeihwBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADGjv8EaO9sr9pWgjAscVwA6cDpIK4gdgVABYEKEjoIFYRUkFBBoAKgAugAOggd5GrC6h7HIWgk7cfs7vOc+FeMvdLuzM47Hs3yDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADALC23AOBl3KFX6+510Px91I2canLRvb7nfJQNDgBqN/JtA59z1vRJjgeZ4QCgdAPf39nFlwG/TiKBtzlFBAuWCBRg5MsdI99PNBT5Xjkg8YgIACCeHrfGJpcTT4kAoEQ9PofH5vlA0zlj+NK9VkQAAC/r8ffd6zCwHn8NyeBfda+b3Z3ajfHBg4zIIilIBACh9Hhv5Kn0uOzit87I75Vj/9z8ebT5HCQKMO8AiABgjh7vjTwFkmm/2drJH2dGJtpdX7534wx8KBdx2o3rHAcAuerxXpOn1OPbRv4U4Do/OWPWIEU/J1tO8G7oD7r3tzgAQI+/rsd/G3nMzLm7/rsR173alRLdZ8hPfscDf3fe/d0pDgBq1uPbu/i9gfsiRvtNm0voxnz0yv19UHzG2zkSBQcA1ejxCLv+9QhJsxpyWN1ninz4NNWJ4AAAPW5v15fr24z47F8+nEkK+BkQPZ5cj0e4v3cjHOeUKj7R+EOJRHE+5oqDiADiGvkhejzqPZf7/EPr/Lr7sZrxXQ8Kx33UfcclEUC5C265Y+To8XRzcd3onxnwYZinCmcjUYIpB0AEMH5hvXPGjR63OT9i9Ncxdv2JUsNUcRARwL9DR/R42bt+iFr9U4XzkSjAjANoK10o6PHyorI75dvlPm9CRU3dWH4o5J+Z4qC24EWxrcfXiYwcPR5+njUGFy38zq04qM188t/tGDl6vK5d/1rp2GWOVrHmRlkc9P9zBTgAnR4XA0+VdEOP21oTmhr8nrNuzj4nGGMWxUELA5O5v7OLL9Hj4GHXT92gU1McJP+/SXlP20gTZ0mPS5OIS/R4dsavCauT7vovjPmnYq0nLQ5aeLxYS3q8N3L0eP6GL5vH3Yhdf2XIuUsUMPT8QdLioHbCZHw0osdvrZVVgnfjl11c26LL5HP3yuKgZP0DF8qLGJN08aXH+10cPV6f4Y9t0bUyLOm0xUFJHECr2PEfAnwvehx87PomfkpTXJOmViFJ3mLIAWiSGOhx8LXra1t0/W7MmUt0OGIjfRPbTtpXBr1u9A9VaJzBV3Z7+MdaG9OY02x3HQ8yOnpEMxQB/Ar43U9O91yg86ve9b226DJ+rT+tXeOQAxijx3whTuGKDH/xxi+7YZAWXZnnN6JGOK1i0Jo8wL3TbqEKfCSXcEEuocpdf1NYezKNPUW7Zs3PgJpiBjkA4c1O0kPqBXw9T792r2/dZ+/mFb7jFLJZ/GNadBWx60+0p2iHi7bKiZtdzOA8v4R9H5pwRUR9XuEryUZzxj+mMedRyRJQ2T8wSnGQ1gFoPPfTdhQwUgseNGF76MmNvOBJviSLfd0katGVeSQ0yZ6COAA3aE27JS/FDG7RfGjCduu5cU7hO2YabKGnbtGV+70JXhw0xgFo2y69CXSIo++8wkuQV0iw6zcBW3QZvkdJ7Wm0A3CDNlXMQF7B5MIe06LrpOYIzMLhou0Eg9MUMyTtd0ZewfSO1kdaq9qjLAv21E4YdJaHIZJXMLPrm+qLb+DeJbWnduKgTRUzkFdIuuvn0qLL8n1MZk9THYDm4Y0sf9Ihr+BVv/aYaNFl+F4ms6d2xqDNFDNEzCuIU1jXnFeY0KKLXd+wPc1xAJpihsduwG8LnrQ+r3Ac8GvM5BVGNuY02aLL8FpKYk/tzEFrihmqSvps5RWOm3DJxqh5hcJadFleO9Htaa4DUP300w24rXxi+7zCxyZcsjFIXqHEFl2G10l0e2o9DDp5MQN5Bf95hQm7/obGLl7WRNTDRX04gGWT0WGI5BWG8wo1tOgyLiGj2VPradBZFgeRV3gxrzBGpqzY9YPMd7TDRVuPg/7Fgikur4AzTze/UezJ5+GgWRyGWAou+3/uXjHzChuef4hCFHvymp1XFjMc0fAzy7xCqS26LM9bcHvyfTz4WWP8MMRKowXZseV1MjGvwK6fhuD25P33eWXvN54Is5tX6B+Memo4yMXCnAS1pxAOQMLNwW4wtRcHAXi0p8n9A/cChZuXigv7wvQCeLGn/an2tBdo3JoqpU8u5ASARPYUxAE43ajRJEQBAAntaS/guM8U7zl2D0AAQAJ7CuYAXKGKJnQhCgDQ2dOZb3sKnolX9jujOAgggT3tRRgzUQBAXHvS9m8I7wDcI6dDDywsXQ07AMy3p3dae9qLNG6iAAB/aHIBH0zkALa0i6bTCe2jAf62nXXz/HSnnHalzfKr2ojHdAAmDkMEMGjg+87A3zf+DqlRPR/QRr5QU4eLAkRc+8sdIw9ZBat+OCi2A8jicFGAGVHutpHHZnSz0DbBTRKNP/QzBS2noCQ97hvZHG+611Xz3KhlsmRuE93EIg4XBfR4QO57Iw9pB4tEFydhiqbTyYolCZnr8dfY3sWTNMttE05CVYeLQnV6XHjaMfJHa/dpkfC7JQoYOgxRogAcALxm5Iel6PGqIgA3gRwuCkNr5LAWPV6jA6A4CAPvG5FWr8ercwBuAXC4aPlGvtwxcvQ4DuCPHYDiIPR49Xq8SgfgFg+Hi+alx9cJjbxYPV6tA3CLS3MYIsVB8fS4GPkSPV42C0Nj0R6GSHGQPz0uRp4i6YYeJwJ4cXFyuKhfPd4bOXoczEcAfRSgKQ66xMjR41BYBOAWNoeL2tPjt81zEhY9TgQQHGkGMlQcJFHAeQFGbkmP90aOHicCSG4Ymv6BWRQHGdPjvZGjx8G0A5Cd8UHxVhPFQcb0+C1JUsjaATij0hQHRekfiB4HHEAaJ6ApDlr5MAb0ONTIwvj4tMVBmxF6XIz7AD0OYDwCcEY76jBE17TxAD0OUIYDOG6G+weixwFKdADOCWiKg9DjACU6gIBOQIz8Ej0OOIA8nIA4ACkSWo74s8feyNHjABk7gBccwto5g6Uz9Hv0OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5Mx/8r68LcD7eGIAAAAASUVORK5CYII=);\n  background-repeat: no-repeat;\n  background-size: auto 80%;\n  background-position: left 0.75em center;\n  text-align: center;\n}\n\n#mtr-sharing-verification-container.maitre-reminder {\n  text-align: left;\n  padding-left: 6em;\n}\n\n#mtr-sharing-verification {\n  color: #4d566c;\n  font-weight: 700;\n  font-size: 0.9em;\n}\n\n#mtr-sharing-verification a {\n  color: #222;\n  text-decoration: underline;\n}\n\n#mtr-sharing-verification-resend-email, #mtr-sharing-verification-resend-sms {\n  font-size: 0.9em;\n  line-height: 1.5;\n  color: #4d566c;\n}\n\n#mtr-sharing-screen .mtr-sharing-body-container {\n  display: none;\n}\n\n#mtr-sharing-screen .mtr-sharing-body-container.active {\n  display: block;\n}\n\n#mtr-sharing-header {\n  margin: 0.5em 0 0;\n  font-weight: 700;\n  font-size: 2em;\n  color: #2b2f3e;\n}\n\n#mtr-sharing-subheader {\n  margin: 0.2em 0 1em;\n  font-weight: 400;\n  font-size: 1.3em;\n  color: #71747b;\n}\n\n#mtr-sharing-leaderboard {\n  padding: 3% 4%;\n}\n\n#mtr-lb-table {\n  width: 100%;\n  max-width: 100%;\n  table-layout: auto;\n  color: #323c4b;\n}\n\n#mtr-lb-table thead th, #mtr-lb-table tbody td {\n  padding: 0.90em 0.2em;\n  text-align: center;\n  font-size: 0.9em;\n  font-weight: 400;\n  max-width: 0;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n#mtr-lb-table thead th {\n  /*background-color: rgba(77, 86, 108, 0.9);*/\n  font-weight: 700;\n  border-bottom: 2px solid #eff3f7;\n}\n\n#mtr-lb-table thead th:first-child {\n  border-radius: 5px 0 0 0;\n}\n\n#mtr-lb-table thead th:last-child {\n  border-radius: 0 5px 0 0;\n}\n\n#mtr-lb-table tbody td {\n  border-bottom: solid #eff3f7 1px;\n  background-color: #fff;\n}\n\n#mtr-lb-table .mtr-lb-subscriber {\n  width: 60%;\n}\n\n#mtr-lb-table .mtr-lb-subscriber.sweepstake {\n  width: 70%;\n}\n\n#mtr-lb-table .mtr-lb-position {\n  width: 20%;\n}\n\n#mtr-lb-table .mtr-lb-points {\n  width: 20%;\n}\n\n#mtr-lb-table tr.mtr-lb-highlight > td {\n  background-color: rgba(77, 86, 108, 0.05);\n  /*font-weight: 700;*/\n}\n\n#mtr-lb-footnote {\n  text-align: center;\n  font-size: 0.6em;\n  margin: 0.45em 0 1.2rem;\n  color: #444;\n  text-transform: uppercase;\n}\n\n#mtr-sharing-subscriber-position-container {\n  margin: 1em 0;\n}\n\n#mtr-sharing-progress {\n  font-size: 1.15em;\n  color: #2b2f3e;\n}\n\n#mtr-sharing-instructions {\n  font-size: 0.8em;\n  color: #555;\n  font-weight: 400;\n  line-height: 1.5;\n}\n\n#mtr-sharing-people-referred {\n  font-size: 3em;\n}\n\n#mtr-sharing-people-referred-text {\n  font-size: 1.1em;\n}\n\n#mtr-sharing-socials-container {\n  padding: 6% 4%;\n  background-color: #f5f5f5;\n  width: 106%;\n  left: -3%;\n  margin: 0 auto;\n  text-align: center;\n  border-radius: 5px;\n  /*background: #fff;*/\n  box-shadow: 0 4px 15px 7px rgba(0, 0, 0, 0.2);\n  z-index: 2;\n}\n\n#mtr-sharing-socials-container .mtr-sharing-social {\n  width: 48px;\n  height: 48px;\n  border-radius: 5px;\n  display: inline-block;\n  margin: 5px;\n  cursor: pointer;\n  position: relative;\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 100% 100%;\n}\n\n#mtr-sharing-socials-container .mtr-sharing-social:hover {\n  transform: scale(1.1);\n  -webkit-transform: scale(1.1);\n}\n\n#mtr-sharing-social-facebook {\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHyAAAB8gEzAEwKAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAKVQTFRF////QECAQGCfOVWqPFqlNVWfOVWhN1KbPlieN1OfO1WdOFeiOlWfOVSeOlWgOVWhO1SfOVSfO1agOlaeO1aeOlWfOVafO1SeOlSfO1WgO1SfOVWfOlWfOlWfOlSeOVWgOlafOVSfOVWfOlWfOVWeOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWfOlWf4xoSCAAAADZ0Uk5TAAQICREYGxwdJScpMDpLUVJVVlxfYGJkbX6Cio2QkZOVoK21tri9wMLMz9DZ3OXq7u/w/P3+DSGAbAAAAK9JREFUWMPt08cOwjAURNEhodfQewuE3kv+/9MQwphsIsUeidW7yyfNWdkIySCAAIbAeTkZf5paAItaHjrHGLi2EM0YCLKggIMLCnhUwAEjcMDNJYEVSGAYWea89ruuEdD47Qd3m6dc0Pu63V/IaMBngR0L7AX4N7Atq1IaKH5PnSTAGvE1WaDPAnMW2LDAiQScJwmUQhKoskAvEXAJVGk9nKnLUb6zAAIIIIAAMcALT2+55pfCFKQAAAAASUVORK5CYII=');\n}\n\n#mtr-sharing-social-twitter {\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHyAAAB8gEzAEwKAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAY9QTFRFUKvxUavxUazxU6zxU63xVK3xVa3xVa7xV67yWK/yWrDyW7DyXLHyXrLyX7LyYLPyYrTyY7TyY7TzZLXzZbXzZ7bzarjzbLnzbrnzb7rzcLr0cbv0crv0c7z0dLz0dr30eL70eb/0fMD1fcD1f8H1gcP1gsP1g8T1hcT1hsX1iMb2icb2isf2i8f2jMj2jcj2jsn2kMr2k8v2lcz3ls33l833mM73ms/3m8/3nND3ntD3n9H3otL4pNT4pdT4p9X4qdX4qtb4q9b4q9f4rdf4rtj5r9j5sNn5str5tNv5ttz5t9z5uN35ud35ut75ut76u976vN/6vd/6vuD6v+D6wOH6w+L6xOP6xeP6xuT6x+T6yOX7yeX7zOb7zOf7zef7zuf70en70un70ur70+r71Or81Ov81uv82e382+783O783e/84fH95PL95/P96PT96fT96vX97Pb+7/f+8Pj+8vn+8/n+9Pr+9fr+9vv+9/v++Pz++fz/+vz/+v3/+/3//P3//f7//v7//v//////wuQymQAAAatJREFUGBntwetfS3EAB+DvVmu2imEqc2kTkiKNEolZEkOhG3KJ0FUrl1DaOqfvH67PKHN+V73w6jwPfD7ff1WRSHcdD2G3GqfXuaU4ew4l8Ww1ZJKHIFN1y+G2kSgCJ587LyA1sxyHKDzPMku5PPnjCGRqN7kYg2CAXpvnIdVO8kMdPJIuPdZaQ403DkI0wC2rHfjbPL2mZwpsh8RtlgxHUSbiUiIDmR7+8jVbix1JSvQFIHOU29bu7Mdv3RRspCEXzHNHcbABJVkK3kGljeU+jV2qAzopeAWlKXp8mZuj4BEUwqhZoIWbULg71VG/SLMuKFwjWaBZCxRStHMMCuEibaxUQGWQNkahFFuhhVaopQo0KkSgkcrT5CW0In0fqdcEneiFs2eeUmcSWsFl6rkJ6LVRbwQmk9T5HofJnmdUc5thFuinUg+spMaLlHoMW5WJWYrehGDr8FuKHlbC0r77DgXOVdjZ2/naoejbaZjUdF+52Jt771LCGYrBrLp/nXIT9bBzILNEweqTJOwFmh4suPzj81BzFf5V5MTlTG584t719KmGIHw+n6WfsGsnolcwGKEAAAAASUVORK5CYII=');\n}\n\n#mtr-sharing-social-whatsapp {\n  background: url('data:image/png;base64,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');\n}\n\n#mtr-sharing-social-facebook-messenger {\n  background: url('data:image/png;base64,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');\n}\n\n#mtr-sharing-social-email {\n  background: url('data:image/png;base64,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');\n}\n\n#mtr-sharing-social-linkedin {\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHyAAAB8gEzAEwKAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAASZQTFRFAISxAYSxAoWyA4WyBIayBYazB4ezCIizCYi0Com0C4m0DIq1Dou1EIy2EYy2Eo23FY63Fo+4GJC4GZC5G5G5HpK6H5O6IJO7IZS7I5W8JZa8Jpa9J5e9Kpi+LJm+MJvAMpzAM53BOJ/COZ/CO6DDPaHEQKPFRKXGRqbGSKfHSafHSqjITKnIUqzKU6zKVK3LWK7MWa/MYbPPcbvUdr3Vd73VeL7WfcDXfsHYgMLYiMbbjMjcjsjcj8ndkMndkcrdlszfmM3fmc7gntDho9PjptTkqNXkrtjmtNvot9zpuN3pvd/rweHsxOPtxuTuzefw0+ry2Ozz2e3z2+703O706PT46fT48vn78/n79fr89vv89/v9+v39+/3+/P7+/f7+/v//////zKwHowAAAUZJREFUWMNjYBgFo4DqgFlOnoUC7Ry2UYmJkQ7c5OrnDEgEgxB+Mg2wT4QCN/L0s8fADEgUIssAZbj+RG2yDFBDGKBLlgE8CXADRMkLBHeYfj8yY0EwFKI/QpLchCDiAdLvK0NBWpTQN5RlHLYZlUlYUUkav/eYdMzAQB+So3lNIFxTASBHySUaFMDhPrYKuA0wgqUDYzDXHMa1ZuB2QqTSWEtWXAY4ouZGSxjXjts/ERn4S5FogL1nIioIYCPNgLBEdGBFmgGYIE6ZQgMSXUg3IBaFF0iqAc4q7Hzq3gh+Ag9JBsTrgQUYLRAmqJFkgA1MhRdcyIAUAxL4YCpUyDMgGK6CK44sA7wQSkJHDRg1YNSAIWGAA0zWlUwDtOKhJRBE1hhLuzMIJqaJtVgW0wQDaNXHogHhavIiVIhDhVRH+yWjgMoAAAKHepswJ4MsAAAAAElFTkSuQmCC');\n}\n\n#mtr-sharing-social-telegram {\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHyAAAB8gEzAEwKAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAaFQTFRFYajeYqjeYqneY6neY6nfZKrfZarfZqvfZ6vfaKzfaKzgaazgaq3ga63gbK7gba7gb7DhcLDhcrLic7LidLLidLPidbPid7TjebXjerbje7bjfLfkfrjkf7jkgLnkg7vlhLvlhbzmhrzmh73miL3mib7mir/ni7/njMDnjcDnjsHnj8Hoj8LokMLokcPoksPok8TolMTplsXpmMbpmMbqmcfqm8jqnMnqncnrnsrrn8rroMvrocvro8zsps7sqM/tqdDtqtDtrdLurtLurtPur9PusdTvstTvs9Xvtdbwt9fwuNjwudjwu9rxvdrxvdvxvtvxv9zywN3ywd3ywt3yxN7zx+DzyOHzyOH0yeH0yuL0zOP0z+T1z+X10OX10eX10eb10ub21Of21ej21uj21+n32er32uv33Oz43ez43u343+344e/54u/54/D55PD55vH65/L66PL66fP66/T77PX77fX77vX77/b88Pf88ff88/j88/n99Pn99vr99/v9+Pv9+Pv++fz++vz++/3+/P3+/f7+/f7//v7//v//////z+OtuAAAAfdJREFUGBntwWlXUlEABdAjGCgSkZbkUJpF0SglzeWQWmTSIKkVTVqEmZSlWZAiKCmeX92DF8ODi+9CX2ot9kZNTc3/yuFdio2iWuZLwR0qulGVTt8aVW5UznrzI3PaUKmeyQ3mxepQEfvgIjXeoQKG04FfLHIP0g7eWWHO5KEEMy5AjunibIo5i8dN01S1QEbH+E/mbQ6brEGqItBnuTbHQrMONH/iHy+hp8sfZ6GIB+j4zqxh7Gpf/2dqpB7tBZwx5rhQXt3JZ0lqhbsAeJLMs6Gc5pFlFkkM1AMY3GHeEsT2uN+kWOxFCwCDj4WmIdI6FmWJlV4ozAFq9EPAEWOJ7fsWKGwhah2FwHmWmD+MtNYv1NpqgIDpYZwasVsGpB2JsMgCxEwu3zJznu5Hxqk4i02gvPah99tUrLugurLFEtexK5tnao1PoBqhQCf0HGMAacYJCmwYoccQTZgBNL6mSAj6/DwL1H+g0Dj0naEfcFKsD/pM61EDLlPMAQnP2YPbFFqFjD6O4TGFZiDDmvyKV8xIUusupMywfYFpb+1T1DgHKTc4ukpFsAG4mmABO6TYU0wLNULRFmbON0gKUTHXhAzzA2YFIGmA5LwVWe41qoYgyRJm0Ia8AyFmOCHLYIeG0ZsiudmE6p34QXrxN8y93aip+Vf9BouHzaQ4onlNAAAAAElFTkSuQmCC');\n}\n\n#mtr-sharing-social-line {\n  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAHyAAAB8gEzAEwKAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAjdQTFRFAMIAAMUAAcIBAsICA8MDBcMFBsYGB8cHCMQICMcICcQJC8ULDMgMDcUNDcgNDsUOEMYQEMkQEcYRE8cTE8kTFMcUFsoWF8gXGMgYGcgZGsgaHMkcHckdHskeH8kfIc0hJMskJcslJc0lJ8snKMwoKM4oKcwpK88rL9AvMNAwMc4xMdAxMs4yMtAyM84zNM40N9I3ONI4OdA5PdE9PdM9P9M/QtJCQ9JDQ9RDRNJERNRERtNGRtVGSdZJS9RLTdRNTddNTtdOUNdQUdVRUtZSVNhUVdZVVtdWWNdYWddZWthaXNhcXtheX9lfX9tfYNtgYtliYttiZNpkZNxkZ9xnaNtoaN1oattqa9xrbNxsbN5sbdxtbd5tb91vcN1wcN5wcd9xdN90dd51ed95eeF5euF6e+F7fOF8feB9gOGAgeKBheKFhuKGiuSKi+WLj+aPkOaQleeVluaWmOaYmeeZnOecnOicn+ifn+mfoOigpOmkqOqoqOuorOysreutr+yvsOywseyxsu2ys+2ztO20te61t++3ue65u++7vO+8vvC+v/C/wPHAwvHCw/HDxPHExfLFx/LHyPLIyfLJyfPJyvLKzPPMzfTNzvPO0vTS0vXS1PXU1vbW1/XX1/bX2PbY2fbZ2vfa3ffd3vfe3/ff3/jf4Pjg4vji4/jj4/nj5Pnk6Pro6frp7Pvs7fvt7vvu7/vv8fzx8/zz9f319/33+P34+f75+v76+/77/P78/f/9/v/+////9k7zpwAAAm1JREFUWMNjYBgFo4D2gEtGlptMreLuRVOXbd4DBFtXzSj2kiZNt3TO3D1oYHG2LNHajap37MECdjZYEmd7yx6coFmGoHam0I178IBNscz49XO37yEAmrjw6efv30MQ9Ang1i80eQ8RYKYwTv937CEKNOIyIGIPkSAcu36FzcQasEUZqwFNe4gGlVgT0E7iDdgmicWADIjcDv8sCCPFZMGeLocJIGar44I9syw0gMBmIUQyB4sBSyBSPYyMq8EMTsaCPbaMIsuBTEPGhD1hjGCQC1E1F0sagLqujZFxKZjBzpi/x5SR0WDbnj0ajCF7/BjFQkJC0tdCMxZmetTCYQBjDMwAA+RQ0McwwBmXAYw1UANU29rapsEM8MUwIBS7AY7yjDzzIAaAQRlUWSixLvCbzsmorgQ3gK0VqiwAwwA9HAbsKQNpBBmguXTp0g0wL5hjGCCKy4A9gVADkANxE5ZSYTbcAANTU6tahAFbtCEG8JmamrouhqiqwpKQkiFSkyCBpbuHj7FwjxNjPFBokSBj+p54lIRkh8UAud0QuTw/IAju3VMRtXrPnNSVIKEpaWv2rEwAiSeuAatZx4otN9URn5lKsJfnm4jVv1EOe4kSR6wB3jiKNJZG4vRX4yyVObqJ0b9CCHe5zjuViALRGG97oJSQ/u12BCpHb/xxsdONYPUqV46ndN3hQ0wFr1a3C4f+9WZENjEkIvt2Y9E/X5GEVo6US2b9IlT97QIkt7Q8kKMviYX0phoLwiMTVchq61FkPRDoQPV3kmU9ENiDtc+wZiAXBIEKNE8msvUzyG5eE83KQBFgYhgFo4AeAADRipbFl4X77AAAAABJRU5ErkJggg==');\n}\n\n#mtr-sharing-social-reddit {\n  background: url('data:image/png;base64,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');\n}\n\n#mtr-sharing-plain-container {\n  border: 2px solid #ccc;\n  margin: 0.4em auto 1em;\n  width: 100%;\n  max-width: 550px;\n  padding: 0.25em;\n  border-radius: 5px;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flex;\n  display: flex;\n  -ms-box-orient: horizontal;\n  -ms-box-pack: center;\n  -webkit-flex-flow: row wrap;\n  -moz-flex-flow: row wrap;\n  -ms-flex-flow: row wrap;\n  flex-flow: row wrap;\n  -webkit-justify-content: center;\n  -moz-justify-content: center;\n  -ms-justify-content: center;\n  justify-content: center;\n  background-color: #fff;\n}\n\n#mtr-sharing-plain-link {\n  font-size: 0.9em;\n  padding: 0.2em 1em 0.2em 0.3em;\n  color: #222;\n  -webkit-flex: 8;\n  -moz-flex: 8;\n  -ms-flex: 8;\n  flex: 8;\n  background-color: #fff;\n  border: none;\n  height: auto;\n}\n\n#mtr-sharing-link-button {\n  -webkit-flex: 2;\n  -moz-flex: 2;\n  -ms-flex: 2;\n  flex: 2;\n  border-radius: 5px;\n  font-size: 0.85em;\n  text-transform: uppercase;\n  padding: 0.55em 0.1em 0.5em;\n  text-align: center;\n  font-weight: 700;\n  border: none;\n  letter-spacing: 0.5px;\n  color: #fff;\n}\n\n#mtr-sharing-link-button:hover {\n  cursor: pointer;\n}\n\n\n/*Tabs*/\n#mtr-sharing-head {\n  border-radius: 7px 7px 0 0;\n  padding: 0 0.7rem;\n}\n\n#mtr-sharing-head-ul {\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: -moz-flex;\n  display: -ms-flex;\n  display: flex;\n  margin: 0 auto;\n  padding: 0;\n  width: 100%;\n  list-style: none;\n  -ms-box-orient: horizontal;\n  -ms-box-pack: center;\n  -webkit-flex-flow: row wrap;\n  -moz-flex-flow: row wrap;\n  -ms-flex-flow: row wrap;\n  flex-flow: row wrap;\n  -webkit-justify-content: center;\n  -moz-justify-content: center;\n  -ms-justify-content: center;\n  justify-content: center;\n}\n\n#mtr-sharing-head-ul li {\n  flex: 1;\n  text-align: center;\n}\n\n#mtr-sharing-head-ul li a {\n  display: block;\n  padding: 0.5em 0;\n  font-size: 0.9em;\n  text-transform: uppercase;\n  border-top: 4px solid transparent;\n  text-decoration: none;\n  background-color: #f5f5f5;\n  color: #888;\n}\n\n#mtr-sharing-head-ul li a:hover {\n  color: #222;\n}\n\n#mtr-sharing-head-ul li a.active {\n  background-color: #fff;\n  font-weight: 700;\n  margin-top: -8px;\n  padding-top: calc(0.5em + 8px);\n  border-radius: 4px 4px 0 0 !important;\n}\n\n#mtr-sharing-head-ul li:first-child a {\n  border-radius: 5px 0 0 0;\n}\n\n#mtr-sharing-head-ul li:last-child a {\n  border-radius: 0 5px 0 0;\n}\n\n\n/*Rewards*/\n\n#mtr-sharing-rewards-header {\n  font-size: 1.3em;\n  padding: 1.2em 0 0;\n  font-weight: 700;\n  color: #2b2f3e;\n}\n\n#mtr-rewards {\n  padding: 2em 2em 1.5em;\n}\n\n#mtr-rewards-list {\n  padding: 0;\n  margin: 0;\n  list-style-type: none;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n#mtr-rewards-list li {\n  flex: 1 0 50%;\n  margin: 5px;\n  border-radius: 5px;\n  min-height: 235px;\n  background-color: rgba(77, 86, 108, 0.05);\n  text-align: center;\n  vertical-align: top;\n  border: solid 1px #ccc;\n  position: relative;\n}\n\n#mtr-rewards-list li.mtr-no-image {\n  min-height: 135px;\n}\n\n#mtr-rewards-list li.unlocked {\n  opacity: 0.4;\n  filter: alpha(opacity=40);\n}\n\n#mtr-rewards-list li.unlocked .reward-ribbon {\n  position: absolute;\n  left: -5px; top: -5px;\n  z-index: 1;\n  overflow: hidden;\n  width: 75px; height: 75px;\n  text-align: right;\n}\n\n#mtr-rewards-list li.unlocked .reward-ribbon span {\n  font-size: 10px;\n  font-weight: bold;\n  color: #FFF;\n  text-transform: uppercase;\n  text-align: center;\n  line-height: 20px;\n  transform: rotate(-45deg);\n  -webkit-transform: rotate(-45deg);\n  width: 100px;\n  display: block;\n  box-shadow: 0 3px 10px -5px rgba(0, 0, 0, 1);\n  position: absolute;\n  top: 19px; left: -21px;\n}\n\n#mtr-rewards-list li.unlocked .reward-ribbon span::before {\n  content: \"\";\n  position: absolute; left: 0px; top: 100%;\n  z-index: -1;\n  border-left: 3px solid #777;\n  border-right: 3px solid transparent;\n  border-bottom: 3px solid transparent;\n  border-top: 3px solid #777;\n}\n#mtr-rewards-list li.unlocked .reward-ribbon span::after {\n  content: \"\";\n  position: absolute; right: 0px; top: 100%;\n  z-index: -1;\n  border-left: 3px solid transparent;\n  border-right: 3px solid #777;\n  border-bottom: 3px solid transparent;\n  border-top: 3px solid #777;\n}\n\n#mtr-rewards-list li .reward-description {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(59,56,57,.8);\n  line-height: 1.3;\n  z-index: 2;\n  padding: 0.8em 0.5em;\n  color: #fff;\n  font-size: 0.85em;\n  overflow: hidden;\n  border-radius: 5px;\n  opacity: 0;\n}\n\n#mtr-rewards-list li .reward-info {\n  vertical-align: middle;\n  border-radius: 10px;\n  color: #2b2f3e;\n}\n\n#mtr-rewards-list li .reward-info h4 {\n  color: #2b2f3e;\n  font-size: 0.9em;\n  margin: 0.25em 0;\n  font-weight: 700;\n  padding: 0.5em 1em;\n}\n\n#mtr-rewards-list li .reward-info p {\n  color: #2b2f3e;\n  font-size: 0.75em;\n  line-height: 1.3;\n  font-weight: 400;\n  padding: 0 1em;\n  text-align: justify;\n}\n\n#mtr-rewards-list li .reward-info .reward-image {\n  background-color: #fff;\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center center;\n  width: 100%;\n  padding-bottom: 60%;\n  height: 0;\n  border-radius: 5px 5px 0 0;\n  border-bottom: 1px solid rgba(77, 86, 108, 0.05);\n}\n\n#mtr-rewards-list li .reward-referrals {\n  display: block;\n  padding: 0.6em;\n  text-transform: uppercase;\n  color: #2b2f3e;\n  background-color: #fff;\n  font-size: 0.7em;\n  font-weight: 600;\n}\n\n#mtr-rewards-list li.mtr-no-image .reward-referrals {\n  border-radius: 5px 5px 0 0;\n}\n\n#mtr-rewards-list li:hover > .reward-description {\n  opacity: 1;\n}\n\n\n/*Instructions tabs*/\n\n#mtr-sharing-container-instructions {\n  text-align: left;\n  padding: 10px;\n}\n\n#mtr-sharing-container-instructions ul, #mtr-sharing-container-instructions ol, #mtr-sharing-container-instructions p {\n  font-family: inherit;\n  font-weight: 400;\n  font-size: 1em;\n  line-height: 1.6;\n  margin-bottom: 1em;\n  text-rendering: optimizeLegibility;\n}\n\n#mtr-sharing-container-instructions ul, #mtr-sharing-container-instructions ol {\n  padding-left: 1.5em;\n}\n\n#mtr-sharing-container-instructions ul li {\n  list-style-type: initial;\n  list-style: initial;\n}\n\n#mtr-sharing-container-instructions ol li {\n  list-style-type: decimal;\n  list-style: decimal;\n}\n\n#mtr-sharing-container-instructions h1,\n#mtr-sharing-container-instructions h2,\n#mtr-sharing-container-instructions h3,\n#mtr-sharing-container-instructions h4,\n#mtr-sharing-container-instructions h5,\n#mtr-sharing-container-instructions h6 {\n  font-family: inherit;\n  font-weight: 700;\n  color: #222;\n  text-transform: none;\n  line-height: 1.1;\n  margin-top: 0;\n  margin-bottom: .5em;\n}\n\n#mtr-sharing-container-instructions h1 {\n  font-size: 2.5em;\n}\n\n#mtr-sharing-container-instructions h2 {\n  font-size: 1.9em;\n}\n\n#mtr-sharing-container-instructions h3 {\n  font-size: 1.6em;\n}\n\n#mtr-sharing-container-instructions h4 {\n  font-size: 1.3em;\n}\n\n#mtr-sharing-container-instructions h5 {\n  font-size: 1.11em;\n}\n\n#mtr-sharing-container-instructions h6 {\n  font-size: 0.9em;\n}\n\n#mtr-sharing-container-instructions a {\n  color: #000;\n  outline: none;\n  -webkit-transition: all 150ms ease-out;\n  transition: all 150ms ease-out;\n  text-decoration: underline;\n}\n\n#mtr-sharing-container-instructions img {\n  max-width: 100%;\n  height: auto;\n  -ms-interpolation-mode: bicubic;\n  display: inline-block;\n  vertical-align: middle;\n}\n\n\n/*Popup*/\n#mtr-popup-container {\n  max-width: 100%;\n  z-index: 999999999;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  overflow-y: auto;\n  height: 100vh;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  padding: 65px 5px;\n  -webkit-animation: fadein 0.7s;\n  -moz-animation: fadein 0.7s;\n  -ms-animation: fadein 0.7s;\n  -o-animation: fadein 0.7s;\n  animation: fadein 0.7s;\n  background: rgba(77, 86, 108, 0.5);\n}\n\n#mtr-popup-container.show {\n  opacity: 1;\n}\n\n#mtr-popup-body {\n  position: static;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n  animation-fill-mode: both;\n  -webkit-animation-name: fadeIn;\n  animation-name: fadeIn;\n}\n\n#mtr-popup-close {\n  display: block;\n  position: absolute;\n  right: 0;\n  top: 0;\n  color: #f1f1f1;\n  font-size: 37px;\n  font-weight: 700;\n  padding: 10px 20px;\n  cursor: pointer;\n  z-index: 999;\n}\n\n#mtr-popup-close:hover {\n  color: #fff;\n}\n\n#mtr-popup-close:before {\n  content: 'CLOSE';\n  font-size: 0.25em;\n  position: relative;\n  top: -8px;\n  margin-right: 5px;\n}\n\n/*Test mode badge*/\n#mtr-popup-test-mode-container {\n  position: absolute;\n  top: 20px;\n  left: 20px;\n  background-color: #f5ec05;\n  padding: 10px;\n  color: #363636;\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  border: solid 1px #65610a;\n  border-radius: 5px;\n  box-shadow: 2px 2px 5px rgba(0,0,0,.4);\n  cursor: pointer;\n  text-decoration: none;\n}\n\n/*Verify installation*/\n#mtr-popup-verify-container {\n  background: #34495e;\n  border-radius: 2px;\n  position: fixed;\n  z-index: 9999999999999;\n  top: 20px;\n  left: 20px;\n  width: 400px;\n  padding: 25px;\n  box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);\n  -webkit-animation-name: fadeInDown;\n  animation-name: fadeInDown;\n  -webkit-animation-duration: 1s;\n  animation-duration: 1s;\n  -webkit-animation-fill-mode: initial;\n  animation-fill-mode: initial;\n  -webkit-transition-delay: 0s, 500ms;\n    -moz-transition-delay: 0s, 500ms;\n    -o-transition-delay: 0s, 500ms;\n    transition-delay: 0s, 500ms;\n}\n\n#mtr-popup-verify-container .mtr-popup-verify-close {\n  position: absolute;\n  top: 15px;\n  right: 15px;\n  font-size: 22px;\n  color: white;\n  cursor: pointer;\n}\n\n#mtr-popup-verify-container .mtr-popup-verify-status {\n  background: url('data:image/png;base64,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') no-repeat 52% 53% #3ACC40;\n  background-size: 25px 18px;\n  float: left;\n  margin: 0 20px 0 0;\n  border-radius: 50%;\n  width: 50px;\n  height: 50px;\n}\n\n#mtr-popup-verify-container .mtr-popup-verify-text-container {\n  float: left;\n  color: #dedede;\n  font-size: 14px;\n  width: 78%;\n  min-height: 50px;\n  vertical-align: middle;\n}\n\n#mtr-popup-verify-container .mtr-popup-verify-text-container h3 {\n  color: white;\n  font-size: 18px;\n  font-weight: bold;\n  margin: 0 0 4px 0;\n  display: block;\n}\n\n#mtr-popup-verify-container .mtr-popup-verify-text-container p {\n  color: #dedede;\n  font-size: 14px;\n  margin: 0;\n}\n\n\n/*Floating button*/\n#mtr-floating_button {\n  z-index: 99;\n  padding: 20px;\n  border-radius: 15px;\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  background-color: #47a1e2;\n  font-size: 14px;\n  font-weight: 700;\n  text-transform: uppercase;\n  cursor: pointer;\n}\n\n@-webkit-keyframes fadeInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none;\n  }\n}\n\n@keyframes fadeInDown {\n  from {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -100%, 0);\n    transform: translate3d(0, -100%, 0);\n  }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none;\n  }\n}\n\n@-webkit-keyframes zoomIn {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(.3, .3, .3);\n    transform: scale3d(.3, .3, .3);\n  }\n\n  50% {\n    opacity: 1;\n  }\n}\n\n@keyframes zoomIn {\n  from {\n    opacity: 0;\n    -webkit-transform: scale3d(.3, .3, .3);\n    transform: scale3d(.3, .3, .3);\n  }\n\n  50% {\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@-webkit-keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@keyframes slideInUp {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(0, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n  }\n}\n\n@-webkit-keyframes slideInUpCenter {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(-50%, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(-50%, 0, 0);\n  }\n}\n\n@keyframes slideInUpCenter {\n  from {\n    -webkit-transform: translate3d(0, 100%, 0);\n    transform: translate3d(-50%, 100%, 0);\n    visibility: visible;\n  }\n\n  to {\n    -webkit-transform: translate3d(0, 0, 0);\n    transform: translate3d(-50%, 0, 0);\n  }\n}\n\n\n/*Media queries*/\n@media only screen and (min-width: 768px) {\n\n  #mtr-sharing-body {\n    padding: 5% 0 0;\n  }\n\n  #mtr-rewards-list li {\n    flex: 1 0 25%;\n    max-width: 33.33%;\n    min-width: 190px;\n  }\n\n  #mtr-sharing-leaderboard {\n    padding: 3% 8%;\n  }\n\n  #mtr-popup-test-mode-container, #mtr-popup-close {\n    position: fixed;\n  }\n\n}\n"
          );
        "" != Maitre.config.settings.design.custom_css.trim() &&
          Maitre.generate.stylesheet(Maitre.config.settings.design.custom_css);
        f.tools.getReferrer();
        f.tools.getSource();
        f.tools.getCampaign();
        f.tools.getIdentity();
        f.libraries.fp();
        var G = function() {
          if (
            Object.keys(g).every(function(a) {
              return g[a];
            })
          ) {
            Maitre.loaded = !0;
            "custom" == k.settings.tool && f.callbacks.processQueue();
            if (mtid(Maitre.config.defaults.form_container_id)) {
              var a = Maitre.generate.form();
              mtid(Maitre.config.defaults.form_container_id).appendChild(a);
            } else
              Maitre.config.settings.floating_button.enable &&
                ((a = Maitre.generate.floating_button()),
                document.getElementsByTagName("body")[0].appendChild(a));
            Maitre.config.settings.sharing.open_if_signed_up &&
              f.tools.readCookie("__maitre-session-" + Maitre.uuid) &&
              f.tools.getSessionCookie(!0);
            Maitre.config.settings.one_click_signup &&
              (Maitre.config.settings.recaptcha.enable
                ? console.warn(
                    "[Maitre] One-click sign up disabled because Recaptcha is enabled."
                  )
                : Maitre.config.settings.form.terms_conditions.require
                ? console.warn(
                    "[Maitre] One-click sign up disabled because Terms and conditions is enabled."
                  )
                : f.tools.checkOneClickSignup());
            Maitre.config.settings.facebook_pixel.enable &&
              "" != Maitre.config.settings.facebook_pixel.id.trim() &&
              f.libraries.facebook_pixel();
            f.tools.getParams("mtrVerifyInstall") == Maitre.uuid &&
              f.tools.verify_tracking_code();
            Maitre.config.callbacks.hasOwnProperty("ready") &&
              Maitre.config.callbacks.ready();
            console.info("\ud83d\ude4c Maitre is loaded, time to rock'n'roll!");
          } else setTimeout(G, 20);
        };
        G();
      }
    } else console.error("[Maitre] No UUID specified.");
  };
  (document.attachEvent
  ? "complete" === document.readyState
  : "loading" !== document.readyState)
    ? u()
    : document.addEventListener("DOMContentLoaded", u);
  window.addEventListener("popstate", function(n) {
    console.log("POPSTATE:", window.location.href);
  });
  window.addEventListener("unload", function(n) {
    console.log("UNLOAD:", window.location.href);
  });
})();
