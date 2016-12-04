function wrapCharacters(e, t) {
    $(e).contents().each(function() {
        if (1 === this.nodeType) wrapCharacters(this);
        else if (3 === this.nodeType) {
            var e = this.nodeValue.trim();
            $(this).replaceWith($.map(e.split(""), t).join(""))
        }
    })
}

function ShuffleHandwrittenText(e) {
    wrapCharacters(e, function(e) {
        var t = Math.ceil(3 * Math.random());
        "9" == e && (t = 2);
        var n = "font-hand-" + t;
        return '<span class="' + n + '">' + e + "</span>"
    })
}

function fetchNewRound(e, t, n) {
    var i = this;
    t || (t = []);
    var r = function() {
        PopupView.showErrorPopup("Sorry! Something went wrong communicating with the game server!", "Try Again").then(function() {
            return i.fetchNewRound(e, t, n)
        })
    };
    $.ajax({
        method: "post",
        url: "/api",
        data: {
            method: "newround",
            bwords: t.join(",")
        },
        dataType: "json"
    }).done(function(e) {
        if (!e.challenge) throw r(), new Error("Challenge missing from server response", e);
        __currentuid = e.uid, e.presentationWord = e.challenge, n(e)
    }).fail(function(e) {
        throw e(), new Error("Could not fetch new round from server", e)
    })
}

function fetchGallery(e) {
    return new Promise(function(t, n) {
        $.ajax({
            method: "post",
            url: "/api",
            dataType: "json",
            data: {
                method: "gallery",
                word: e
            }
        }).done(function(e) {
            e.images ? t(e.images) : n("Could not fetch gallery")
        })
    })
}

function getShareUrl$1(e) {
    return new Promise(function(t, n) {
        $.ajax({
            method: "post",
            url: "/api",
            dataType: "json",
            data: {
                method: "share",
                rounds: JSON.stringify(e)
            }
        }).done(function(e) {
            t(e)
        }).fail(function(e) {
            PopupView.showErrorPopup("Sorry! Something went wrong while preparing for sharing"), n(e)
        })
    })
}

function sendResult(e, t, n) {
    var i = 1;
    e.level > 3 && (i = 2), $.ajax({
        method: "post",
        url: "/api",
        dataType: "json",
        data: {
            method: "roundresult",
            uid: __currentuid,
            round: e.level,
            image: JSON.stringify(e.drawing),
            word: e.word,
            duration: e.getElapsedTime(),
            level: i,
            recognized: e.recognized,
            recognitionId: e.recognitionId,
            bwords: t.join(",")
        }
    }).done(function(e) {
        if (!e.challenge) throw new Error("Challenge missing from server response", e);
        __currentuid = e.uid, e.presentationWord = e.challenge, n(e)
    }).fail(function(i) {
        fetchNewRound(e.level + 1, t, n)
    })
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
};
var asyncGenerator = function() {
        function e(e) {
            this.value = e
        }

        function t(t) {
            function n(e, t) {
                return new Promise(function(n, r) {
                    var a = {
                        key: e,
                        arg: t,
                        resolve: n,
                        reject: r,
                        next: null
                    };
                    s ? s = s.next = a : (o = s = a, i(e, t))
                })
            }

            function i(n, o) {
                try {
                    var s = t[n](o),
                        a = s.value;
                    a instanceof e ? Promise.resolve(a.value).then(function(e) {
                        i("next", e)
                    }, function(e) {
                        i("throw", e)
                    }) : r(s.done ? "return" : "normal", s.value)
                } catch (e) {
                    r("throw", e)
                }
            }

            function r(e, t) {
                switch (e) {
                    case "return":
                        o.resolve({
                            value: t,
                            done: !0
                        });
                        break;
                    case "throw":
                        o.reject(t);
                        break;
                    default:
                        o.resolve({
                            value: t,
                            done: !1
                        })
                }
                o = o.next, o ? i(o.key, o.arg) : s = null
            }
            var o, s;
            this._invoke = n, "function" != typeof t.return && (this.return = void 0)
        }
        return "function" == typeof Symbol && Symbol.asyncIterator && (t.prototype[Symbol.asyncIterator] = function() {
            return this
        }), t.prototype.next = function(e) {
            return this._invoke("next", e)
        }, t.prototype.throw = function(e) {
            return this._invoke("throw", e)
        }, t.prototype.return = function(e) {
            return this._invoke("return", e)
        }, {
            wrap: function(e) {
                return function() {
                    return new t(e.apply(this, arguments))
                }
            },
            await: function(t) {
                return new e(t)
            }
        }
    }(),
    classCallCheck = function(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    },
    createClass = function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var i = t[n];
                i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
            }
        }
        return function(t, n, i) {
            return n && e(t.prototype, n), i && e(t, i), t
        }
    }(),
    get = function e(t, n, i) {
        null === t && (t = Function.prototype);
        var r = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === r) {
            var o = Object.getPrototypeOf(t);
            return null === o ? void 0 : e(o, n, i)
        }
        if ("value" in r) return r.value;
        var s = r.get;
        if (void 0 !== s) return s.call(i)
    },
    inherits = function(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    },
    possibleConstructorReturn = function(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    },
    set = function e(t, n, i, r) {
        var o = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === o) {
            var s = Object.getPrototypeOf(t);
            null !== s && e(s, n, i, r)
        } else if ("value" in o && o.writable) o.value = i;
        else {
            var a = o.set;
            void 0 !== a && a.call(r, i)
        }
        return i
    },
    EventEmitter = function() {
        function e() {
            classCallCheck(this, e), this.listeners = {}
        }
        return createClass(e, [{
            key: "addListener",
            value: function(e, t) {
                _.has(this.listeners, e) || (this.listeners[e] = []), this.listeners[e].push(t)
            }
        }, {
            key: "isFunction",
            value: function(e) {
                return "function" == typeof e || !1
            }
        }, {
            key: "removeListener",
            value: function(e, t) {
                var n = this,
                    i = this.listeners[e],
                    r = void 0;
                return !!(i && i.length && (r = i.reduce(function(e, i, r) {
                    return n.isFunction(i) && i === t ? e = r : e
                }, -1), r > -1)) && (i.splice(r, 1), this.listeners[e] = i, !0)
            }
        }, {
            key: "emit",
            value: function(e) {
                for (var t = arguments.length, n = Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++) n[i - 1] = arguments[i];
                var r = this.listeners[e];
                return !(!r || !r.length) && (r.forEach(function(e) {
                    e.apply(void 0, n)
                }), !0)
            }
        }]), e
    }(),
    config = {
        site_url: "quickdraw.withgoogle.com",
        handwriting_url: "https://inputtools.google.com/request?ime=handwriting&app=quickdraw&dbg=1&cs=1&oe=UTF-8",
        handwriting_threshold: 4,
        handwriting_recognition_threshold: 2,
        round_length: 20,
        num_rounds: 6,
        max_api_rate: 1,
        gameSplashscreenTimeout: 20,
        userNotDrawingTimeout: 7,
        noNewGuessesSentences: ["I have no clue what you're drawing!", "I'm not sure what that is.", "I'm stumped."],
        timesUpSentences: ["Sorry, I couldn't guess it."],
        userNotDrawingSentences: ["I can't guess what you're drawing if you don't draw!", " It's time for you to start drawing."]
    },
    SVGUtils = function() {
        function e() {
            classCallCheck(this, e)
        }
        return createClass(e, null, [{
            key: "createSvg",
            value: function(e, t) {
                var n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                return n.setAttribute("width", e), n.setAttribute("height", t), n
            }
        }, {
            key: "createLinePath",
            value: function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [0, 0],
                    n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
                    i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 2,
                    r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "#000000";
                if (0 != e.length && 0 != e[0].length) {
                    for (var o = function(e, i) {
                            return (e - t[i]) * n
                        }, s = document.createElementNS("http://www.w3.org/2000/svg", "path"), a = "M" + o(e[0][0], 0) + " " + o(e[1][0], 1), u = 1; u < e[0].length; u++) a += " L" + o(e[0][u], 0) + " " + o(e[1][u], 1);
                    return s.setAttribute("d", a), s.setAttribute("stroke", r), s.setAttribute("stroke-width", i), s.setAttribute("stroke-linecap", "round"), s.setAttribute("fill", "none"), s
                }
            }
        }, {
            key: "calculateBoundingBox",
            value: function(e) {
                for (var t = -1, n = -1, i = -1, r = -1, o = 0; o < e.length; o++)
                    for (var s = 0; s < e[o][0].length; s++)(t == -1 || t > e[o][0][s]) && (t = e[o][0][s]), (n == -1 || n < e[o][0][s]) && (n = e[o][0][s]), (i == -1 || i > e[o][1][s]) && (i = e[o][1][s]), (r == -1 || r < e[o][1][s]) && (r = e[o][1][s]);
                return {
                    x: t - 5,
                    y: i - 5,
                    w: n - t + 10,
                    h: r - i + 10
                }
            }
        }, {
            key: "createSvgFromSegments",
            value: function(t, n, i) {
                var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
                r = _.defaults(r, {
                    padding: 0,
                    order: 0,
                    color: "#000000"
                });
                var o = [];
                if (1 == r.order)
                    for (var s = 0; s < t.length; s++) {
                        for (var a = [
                                [],
                                []
                            ], u = 0; u < t[s].length; u++) a[0].push(t[s][u][0]), a[1].push(t[s][u][1]);
                        o.push(a)
                    } else t && (o = t);
                n -= 2 * r.padding, i -= 2 * r.padding;
                var h = 2 * n / 140,
                    l = e.createSvg(n, i),
                    c = e.calculateBoundingBox(o),
                    d = n / i,
                    p = [c.x, c.y],
                    f = void 0;
                c.w / c.h > d ? (f = n / c.w, p[1] -= .5 * (i / f - c.h)) : (f = i / c.h, p[0] -= .5 * (n / f - c.w));
                for (var g = 0; g < o.length; g++) l.appendChild(e.createLinePath(o[g], p, f, h, r.color));
                return r.padding && $(l).addClass("svg-margin-" + r.padding), l
            }
        }]), e
    }(),
    _hashManager_instance, HashManager = function() {
        function e() {
            return classCallCheck(this, e), _hashManager_instance || (_hashManager_instance = this, _hashManager_instance.queue = [], window.onhashchange = function() {
                var t = location.hash.replace("#", "");
                0 != _hashManager_instance.queue.length && t == _.last(_hashManager_instance.queue).name || (_hashManager_instance.queue.length > 1 && t == _hashManager_instance.queue[_hashManager_instance.queue.length - 2].name || 0 == t.length && 1 == _hashManager_instance.queue.length) && (_.last(_hashManager_instance.queue).callback && _.last(_hashManager_instance.queue).callback(), e.pop(_.last(_hashManager_instance.queue).name))
            }, location.hash = ""), _hashManager_instance
        }
        return createClass(e, null, [{
            key: "push",
            value: function(e, t) {
                _.last(_hashManager_instance.queue) && _.last(_hashManager_instance.queue).name == e || (_hashManager_instance.queue.push({
                    name: e,
                    callback: t
                }), location.hash = e)
            }
        }, {
            key: "pop",
            value: function(e) {
                _.last(_hashManager_instance.queue) && _.last(_hashManager_instance.queue).name == e && (_hashManager_instance.queue.pop(), _hashManager_instance.queue.length > 0 ? location.hash = _.last(_hashManager_instance.queue).name : location.hash = "")
            }
        }]), e
    }();
_hashManager_instance = new HashManager;
var _popup_instance = null,
    PopupView = function(e) {
        function t() {
            var e;
            classCallCheck(this, t);
            var n = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return _popup_instance || (_popup_instance = n, n.popup_quit_view = $("#popup-quit").hide(), n.popup_error_view = $("#popup-error").hide()), e = _popup_instance, possibleConstructorReturn(n, e)
        }
        return inherits(t, e), createClass(t, [{
            key: "showQuitPopup",
            value: function() {
                var e = this;
                return new Promise(function(t, n) {
                    e.popup_quit_view.show(), e.popup_quit_view.find("#popup-quit-cancel").off("touchend mouseup").on("touchend mouseup", function() {
                        e.popup_quit_view.hide(), n()
                    }), e.popup_quit_view.find("#popup-quit-quit").off("touchend mouseup").on("touchend mouseup", function() {
                        e.popup_quit_view.hide(), t()
                    })
                })
            }
        }], [{
            key: "showErrorPopup",
            value: function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Reload";
                return new Promise(function(n, i) {
                    _popup_instance.popup_error_view.show();
                    var r = _popup_instance.popup_error_view.find("#popup-error-text");
                    r.html(e), ShuffleHandwrittenText(r);
                    var o = _popup_instance.popup_error_view.find("#popup-error-button");
                    o.show(), o.find("span").html(t), o.off("touchend mouseup").on("touchend mouseup", function() {
                        _popup_instance.popup_error_view.hide(), n()
                    })
                })
            }
        }, {
            key: "showSharingLoadingPopup",
            value: function(e) {
                _popup_instance.popup_error_view.show();
                var t = _popup_instance.popup_error_view.find("#popup-error-text");
                t.html(e), ShuffleHandwrittenText(t);
                var n = _popup_instance.popup_error_view.find("#popup-error-button");
                return n.hide(),
                    function() {
                        _popup_instance.popup_error_view.hide()
                    }
            }
        }]), t
    }(EventEmitter);
new PopupView;
var gameId = 0,
    __currentuid, Sharing = function() {
        function e() {
            classCallCheck(this, e)
        }
        return createClass(e, null, [{
            key: "siteShareText",
            value: function() {
                return "Can a neural network learn to recognize your doodles? Play Quick, Draw to find out!"
            }
        }, {
            key: "siteShareHashtags",
            value: function() {
                return "#aiexperiments #quickdraw"
            }
        }, {
            key: "portfolioShareTitle",
            value: function(e) {
                var t = _.reduce(e, function(e, t) {
                        return e + t.recognized
                    }, 0),
                    n = ["none", "one", "two", "three", "four", "five", "all"];
                return "I made these six doodles. A neural network guessed " + n[t] + " of them correctly."
            }
        }, {
            key: "portfolioShareDescription",
            value: function() {
                return "How many of yours can it guess?"
            }
        }, {
            key: "siteShareUrl",
            value: function() {
                return "https://" + config.site_url
            }
        }, {
            key: "siteShareUrlSlug",
            value: function(e) {
                return "https://" + config.site_url + "/shared/" + e
            }
        }, {
            key: "openUrl",
            value: function(e) {
                window.open(e, "fbShareWindow", "height=450, width=550, top=" + ($(window).height() / 2 - 275) + ", left=" + ($(window).width() / 2 - 225) + ", toolbar=0, location=0, menubar=0, directories=0, scrollbars=0")
            }
        }, {
            key: "getShareUrl",
            value: function(e) {
                var t = PopupView.showSharingLoadingPopup("Preparing to share...");
                return getShareUrl$1(_.pluck(e, "key")).then(function(e) {
                    return t(), e
                })
            }
        }, {
            key: "ShareSiteTwitter",
            value: function() {
                e.openUrl("https://twitter.com/intent/tweet?text=" + encodeURIComponent(e.siteShareText() + " " + e.siteShareHashtags()) + "&url=" + e.siteShareUrl())
            }
        }, {
            key: "ShareSiteFacebook",
            value: function() {
                var t = "https://www.facebook.com/dialog/feed?app_id=1657991857848712";
                t += "&display=popup&amp;caption=Share your portfolio", t += "&link=" + e.siteShareUrl(), t += "&name=Quick, Draw!", t += "&caption=QUICKDRAW.WITHGOOGLE.COM", t += "&description=" + e.siteShareText(), t += "&picture=" + e.siteShareUrl() + "/static/shareimg.png", e.openUrl(t)
            }
        }, {
            key: "ShareSiteG",
            value: function() {
                e.openUrl("https://plus.google.com/share?url=" + e.siteShareUrl())
            }
        }, {
            key: "SharePortfolioTwitter",
            value: function(t) {
                e.getShareUrl(t).then(function(n) {
                    e.openUrl("https://twitter.com/intent/tweet?text=" + encodeURIComponent(e.portfolioShareTitle(t) + " " + e.siteShareHashtags()) + "&url=" + e.siteShareUrlSlug(n.slug))
                })
            }
        }, {
            key: "SharePortfolioFacebook",
            value: function(t) {
                e.getShareUrl(t).then(function(n) {
                    var i = "https://www.facebook.com/dialog/feed?app_id=1657991857848712";
                    i += "&display=popup&amp;caption=Share your portfolio", i += "&link=" + e.siteShareUrl(), i += "&name=" + e.portfolioShareTitle(t), i += "&caption=QUICKDRAW.WITHGOOGLE.COM", i += "&description=" + e.portfolioShareDescription(), i += "&picture=" + e.siteShareUrlSlug(n.slug) + "?type=png", e.openUrl(i)
                })
            }
        }, {
            key: "SharePortfolioG",
            value: function(t) {
                e.getShareUrl(t).then(function(t) {
                    e.openUrl("https://plus.google.com/share?url=" + e.siteShareUrlSlug(t.slug))
                })
            }
        }]), e
    }(),
    _hw_instance = void 0,
    HandwritingAPI = function() {
        function e() {
            return classCallCheck(this, e), _hw_instance || (_hw_instance = this, this.count = 0), _hw_instance
        }
        return createClass(e, [{
            key: "sendRequest",
            value: function(e, t) {
                var n = this;
                this.count++;
                var i = {
                    input_type: 0,
                    requests: [{
                        language: t.similar_drawings ? "quickdraw-ink" : "quickdraw"
                    }]
                };
                return t.width && (i.requests[0].writing_guide = {
                    width: t.width,
                    height: t.height
                }), e && (i.requests[0].ink = e), t.ink_hash && (i.requests[0].ink_hash = t.ink_hash), t.feedback && (i.requests[0].feedback = t.feedback, i.requests[0].select_type = "feedback"), new Promise(function(e, r) {
                    $.post({
                        url: t.feedback ? config.handwriting_collector_url : config.handwriting_url,
                        data: JSON.stringify(i),
                        contentType: "application/json"
                    }).fail(function(e, t, n) {
                        console.error(e, t, n), r("Could not call classifier")
                    }).done(function(i) {
                        "SUCCESS" == i[0] ? t.feedback ? e() : e(n.parseResponse(i)) : r("Could not process classifier response")
                    })
                })
            }
        }, {
            key: "parseResponse",
            value: function(e) {
                var t = JSON.parse(e[1][0][3].debug_info.match(/SCORESINKS: (.+) Combiner:/)[1]);
                return _.map(t, function(t) {
                    return {
                        word: t[0],
                        score: t[1],
                        id: e[1][0][0],
                        neighbor: t[2]
                    }
                })
            }
        }], [{
            key: "processSegments",
            value: function(e, t, n) {
                return _hw_instance.sendRequest(e, {
                    width: t,
                    height: n
                })
            }
        }, {
            key: "getSimilarDrawings",
            value: function(e, t, n) {
                return e && 0 != e.length ? _hw_instance.sendRequest(e, {
                    similar_drawings: !0,
                    width: t,
                    height: n
                }) : Promise.reject("No segments")
            }
        }]), e
    }();
new HandwritingAPI;
var _cards_instance = null,
    CardsView = function(e) {
        function t() {
            var e;
            classCallCheck(this, t);
            var n = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return _cards_instance || (_cards_instance = n, n.newround_card = $("#newround-card").hide(), n.timesup_card = $("#timesup-card").hide(), n.about_card = $("#about-card").hide(), n.round_detail_card = $("#round-detail-card").hide()), e = _cards_instance, possibleConstructorReturn(n, e)
        }
        return inherits(t, e), createClass(t, [{
            key: "showCard",
            value: function(e, t) {
                e.isVisible = !0, e.show({
                    duration: 0,
                    complete: function() {
                        e.addClass("visible"), t && t()
                    }
                })
            }
        }, {
            key: "hideCard",
            value: function(e, t) {
                e.isVisible = !1, e.hasClass("visible") && (e.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    e.hide(), e.off("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), t && t()
                }), e.removeClass("visible"))
            }
        }, {
            key: "showNewRoundCard",
            value: function(e) {
                var t = this;
                e = _.defaults(e || {}, {
                    level: 1,
                    word: void 0,
                    mode: void 0,
                    onCardDismiss: function() {}
                });
                var n = _.once(function() {
                    e.onCardDismiss && e.onCardDismiss(), t.hideCard(t.newround_card, function() {
                        $("#peek-button-static").show({
                            duration: 0
                        })
                    })
                });
                $("#peek-button-static").hide({
                    duration: 0
                }), this.showCard(this.newround_card), this.newround_card.find("#newround-skipped").hide(), this.newround_card.find("#newround-completed").hide(), this.newround_card.find("#newround-timesup").hide(), this.newround_card.find("#newround-default").show(), $("#challengetext-level").html("Drawing " + e.level + "/" + config.num_rounds);
                var i = $("#challengetext-word");
                i.text("" + e.word), ShuffleHandwrittenText(i), setTimeout(function() {
                    t.newround_card.on("touchend mouseup", function() {
                        return n()
                    }), t.newround_card.find("#button-newround-play").off("touchend mouseup").on("touchend mouseup", function() {
                        return n()
                    })
                }, 1e3)
            }
        }, {
            key: "showTimesUpCard",
            value: function(e, t) {
                var n = this;
                ga("send", "event", "ShowEndCard"), this.hideCard(this.newround_card);
                var i = _.once(t),
                    r = _.filter(e, function(e) {
                        return 1 == e.recognized
                    }).length;
                this.showCard(this.timesup_card);
                var o = this.timesup_card.find("#timesup-title");
                0 == r ? (o.text("Oops!"), this.timesup_card.find("#timesup-subtitle").html("Our neural net saw something else in all of your doodles. Select one to see what it saw.")) : (r < config.num_rounds ? this.timesup_card.find("#timesup-subtitle").html("Our neural net figured out " + r + " of your doodles. <br>But it saw something else in the other " + (config.num_rounds - r) + ".  <br>Select one to see what it saw.") : this.timesup_card.find("#timesup-subtitle").html("Our neural net figured out " + r + " of your doodles. <br> Select one to see how it figured it out."), o.text("Well drawn!")), ShuffleHandwrittenText(o);
                var s = this.timesup_card.find("#timesup-drawings-wrapper");
                s.html("");
                for (var a = function(t) {
                        var i = e[t],
                            r = $("<div>").addClass("timesup-round").addClass("button").addClass("button-drawing"),
                            o = $("<button>").addClass("timesup-drawing"),
                            a = $("<div>").addClass("timesup-drawing-neighbor"),
                            u = $("<div>").addClass("timesup-drawing-status");
                        e[t].recognized ? u.text("✓ " + i.word) : u.text("✕ " + i.word), o.on("touchend mouseup", function() {
                            return n.showRoundDetails(i)
                        }), o.append(u);
                        var h = SVGUtils.createSvgFromSegments(i.drawing, 180, 120, {
                            padding: 25
                        });
                        o.append(h), r.append(o), r.append(a), s.append(r)
                    }, u = 0; u < e.length; u++) a(u);
                this.timesup_card.find("#share_portfolio_twitter").off("touchend mouseup").on("touchend mouseup", function() {
                    Sharing.SharePortfolioTwitter(e)
                }), this.timesup_card.find("#share_portfolio_facebook").off("touchend mouseup").on("touchend mouseup", function() {
                    Sharing.SharePortfolioFacebook(e)
                }), this.timesup_card.find("#share_portfolio_g").off("touchend mouseup").on("touchend mouseup", function() {
                    Sharing.SharePortfolioG(e)
                }), this.timesup_card.find(".button-close").off("touchend mouseup").on("touchend mouseup", function() {
                    t && i("CLOSE"), n.hideCard(n.timesup_card)
                }), $("#button-timesup-play").off("touchend mouseup").on("touchend mouseup", function() {
                    t && i("NEW_GAME"), n.hideCard(n.timesup_card)
                }), ga("send", "screenview", {
                    screenName: "TimesUpCard"
                })
            }
        }, {
            key: "showRoundDetails",
            value: function(e) {
                var t = this;
                ga("send", "event", "ShowRoundDetail");
                var n = this.round_detail_card.find("#gallery-wrapper");
                n.html("");
                var i = this.round_detail_card.find("#round-details-word");
                i.text(e.word), ShuffleHandwrittenText(i), e.recognized ? (this.round_detail_card.find("#round-details-subtitle-not-recognized").hide(), this.round_detail_card.find("#round-details-subtitle-recognized").show(), this.round_detail_card.find("#round-details-not-recognized").hide(), this.round_detail_card.find("#round-details-recognized").show()) : (this.round_detail_card.find("#round-details-subtitle-not-recognized").show(), this.round_detail_card.find("#round-details-subtitle-recognized").hide(), this.round_detail_card.find("#round-details-not-recognized").show(), this.round_detail_card.find("#round-details-recognized").hide());
                var r = SVGUtils.createSvgFromSegments(e.drawing, 270, 180, {
                        padding: 10,
                        color: "rgba(0,0,0,1.00)"
                    }),
                    o = this.round_detail_card.find("#round-drawing").find(".round-drawing");
                o.html(""), o.append(r), this.round_detail_card.find("#round-gallery").hide(), this.round_detail_card.find("#round-gallery-line").hide(), this.fetchAndShowDrawingNeighbors(e).then(function() {
                    return t.fetchAndShowGallery(e)
                }), this.round_detail_card.css({
                    top: 0
                }), this.round_detail_card.show(), HashManager.push("details", function() {
                    t.round_detail_card.hide()
                }), this.round_detail_card.find("#button-back").off("touchend mouseup").on("touchend mouseup", function() {
                    t.round_detail_card.hide(), HashManager.pop("details")
                })
            }
        }, {
            key: "fetchAndShowDrawingNeighbors",
            value: function(e) {
                var t = this,
                    n = this.round_detail_card.find("#round-neighbors").hide(),
                    i = this.round_detail_card.find("#round-neighbors-line").hide();
                return HandwritingAPI.getSimilarDrawings(e.drawing, e.width, e.height).then(function(n) {
                    var i = _.filter(n, function(e) {
                        return e.neighbor
                    });
                    i = e.recognized ? _.sortBy(i, function(t) {
                        return t.word == e.word ? 0 : 1
                    }) : _.filter(i, function(t) {
                        return t.word != e.word
                    }), i = _.first(i, 3);
                    for (var r = 0; r < 3; r++)
                        if (i.length > r) {
                            t.round_detail_card.find("#round-detail-" + (r + 1)).show();
                            var o = t.round_detail_card.find("#round-detail-" + (r + 1)),
                                s = o.find(".round-detail-score"),
                                a = o.find(".round-detail-word"),
                                u = o.find(".round-detail-image"),
                                h = o.find(".round-detail-image-neighbor");
                            u.html(""), h.html(""), a.text(i[r].word), ShuffleHandwrittenText(a), 0 == r && (e.word == i[r].word ? s.text("Correct match") : s.text("Closest match"));
                            var l = SVGUtils.createSvgFromSegments(e.drawing, 270, 130, {
                                padding: 10,
                                color: "rgba(0,0,0,0.15)"
                            });
                            u.append(l);
                            var c = SVGUtils.createSvgFromSegments(i[r].neighbor, 270, 130, {
                                padding: 10,
                                order: 1
                            });
                            h.append(c)
                        } else t.round_detail_card.find("#round-detail-" + (r + 1)).hide()
                }).then(function() {
                    n.fadeIn(100), i.fadeIn(100)
                }).catch(function(e) {})
            }
        }, {
            key: "fetchAndShowGallery",
            value: function(e) {
                var t = this.round_detail_card.find("#round-gallery").hide(),
                    n = this.round_detail_card.find("#round-gallery-line").hide(),
                    i = this.round_detail_card.find("#gallery-wrapper");
                i.html("");
                var r = this.round_detail_card.find("#gallery-title");
                e.recognized ? r.html("How does it know what " + e.word + " looks like?<br>\n                                    It learned by looking at these examples drawn by other people.") : r.html("What does it think " + e.word + " looks like?<br>\n                                    It learned by looking at these examples drawn by other people.");
                var o = !1;
                return fetchGallery(e.word).then(function(e) {
                    for (var t = 0; t < e.length; t++) {
                        var n = e[t].image,
                            r = $("<div>").addClass("gallery-drawing").addClass("drawing");
                        i.append(r);
                        var s = SVGUtils.createSvgFromSegments(JSON.parse(n), 180, 120, {
                            padding: 10
                        });
                        r.append(s)
                    }
                    e.length > 0 && (o = !0)
                }).then(function() {
                    o && (t.fadeIn(100), n.fadeIn(100))
                }).catch(function(e) {})
            }
        }, {
            key: "showAbout",
            value: function() {
                var e = this;
                this.showCard(this.about_card), this.about_card.find(".button-close").off("touchend mouseup").on("touchend mouseup", function() {
                    e.hideCard(e.about_card)
                })
            }
        }]), t
    }(EventEmitter),
    SplashView = function(e) {
        function t() {
            classCallCheck(this, t);
            var e = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return e.elm = $("#splashview").hide(), $("#share_twitter").on("touchend mouseup", function() {
                Sharing.ShareSiteTwitter()
            }), $("#share_facebook").on("touchend mouseup", function() {
                Sharing.ShareSiteFacebook()
            }), $("#share_g").on("touchend mouseup", function() {
                Sharing.ShareSiteG()
            }), e
        }
        return inherits(t, e), createClass(t, [{
            key: "enableButtons",
            value: function() {
                var e = this;
                $("#button-play").on("touchend mouseup", function() {
                    e.emit("START_GAME"), e.disableButtons(), document.getElementById("beep").load()
                }), $("#button-play-freeplay").on("touchend mouseup", function() {
                    e.emit("START_GAME_FREEPLAY"), e.disableButtons()
                }), $("#button-about").on("touchend mouseup", function() {
                    var e = new CardsView;
                    e.showAbout()
                })
            }
        }, {
            key: "disableButtons",
            value: function() {
                $("#button-play").off("touchend mouseup"), $("#button-play-freeplay").off("touchend mouseup"), $("#button-about").off("touchend mouseup")
            }
        }, {
            key: "showView",
            value: function() {
                this.enableButtons(), this.elm.show()
            }
        }, {
            key: "hideView",
            value: function() {
                this.disableButtons(), this.elm.hide()
            }
        }]), t
    }(EventEmitter),
    GameRound = function() {
        function e(t, n) {
            classCallCheck(this, e), this.word = t.challenge, this.synonyms = t.synonyms, this.presentationWord = t.presentationWord, this.startTime = new Date, this.recognized = !1, this.level = n, this.recognitions = [], this.width = 0, this.height = 0
        }
        return createClass(e, [{
            key: "getElapsedTime",
            value: function() {
                var e = new Date;
                return (e.getTime() - this.startTime.getTime()) / 1e3
            }
        }]), e
    }(),
    SpeechController = function() {
        function e() {
            classCallCheck(this, e), this.supported = !1, this.synth = window.speechSynthesis, this.synth && (this.supported = !0, this.synth.getVoices())
        }
        return createClass(e, [{
            key: "speak",
            value: function(e, t) {
                var n = this;
                this.supported && ! function() {
                    e = e.replace(/'/gi, "’");
                    var i = _.once(function() {
                            t && t()
                        }),
                        r = new SpeechSynthesisUtterance(e);
                    r.addEventListener("end", function() {
                        i()
                    });
                    var o = function e() {
                        return n.synth.speaking ? void setTimeout(function() {
                            e()
                        }, 200) : void i()
                    };
                    setTimeout(function() {
                        o()
                    }, 500), r.rate = 1.1, n.voice && (r.voice = n.voice), r.lang = "en-US", n.synth.speak(r)
                }()
            }
        }]), e
    }(),
    _machine_instance = null,
    MachineView = function() {
        function e() {
            var t = this;
            return classCallCheck(this, e), _machine_instance || ! function() {
                _machine_instance = t, t.speech = new SpeechController, t.elmA = $("#machine-speechbubble-primary"), t.elmB = $("#machine-speechbubble-secondary"), t.lookAtX = 0, t.lookAtY = 0, t.eyeX = 0, t.eyeY = 0, t.relaxEyes = !0;
                var e = _.debounce(function() {
                    return t.relaxEyes = !0
                }, 2e3);
                "ontouchstart" in window ? $(document).on("touchmove", function(n) {
                    t.lookAtX = n.originalEvent.touches[0].pageX, t.lookAtY = n.originalEvent.touches[0].pageY, t.relaxEyes = !1, e()
                }) : $(document).mousemove(function(n) {
                    t.lookAtX = n.pageX, t.lookAtY = n.pageY, t.relaxEyes = !1, e()
                }), t.resetTextAfterDelay = _.debounce(function() {
                    return t.setText("...")
                }, 2e3), t.reset()
            }(), _machine_instance
        }
        return createClass(e, [{
            key: "reset",
            value: function() {
                this.setText("..."), this.guessesQueue = [], this.mentionedWords = {}, this.talkingGuesses = !1, this.recentMentionedWords = []
            }
        }, {
            key: "setText",
            value: function(e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                this.elmA.text(e), this.elmB.text(t), this.resetTextAfterDelay()
            }
        }, {
            key: "speak",
            value: function(e, t) {
                var n = this;
                this.talking = !0, this.speech.speak(e, function() {
                    n.talking = !1, t && t()
                })
            }
        }, {
            key: "speakAndWrite",
            value: function(e, t) {
                this.setText(e), this.speak(e, t)
            }
        }, {
            key: "readNextGuess",
            value: function(e) {
                var t = this;
                if (this.talkingGuesses = !0, 0 == this.guessesQueue.length) return void(this.talkingGuesses = !1);
                e && (this.recentMentionedWords = []);
                var n = this.guessesQueue.shift(),
                    i = "or " + n;
                e && (i = "I see " + n);
                var r = n,
                    o = "I see " + this.recentMentionedWords.join(", ");
                this.recentMentionedWords.length > 0 && (o += ", "), this.setText(r, o), this.speak(i, function() {
                    var e = o.length > 30;
                    t.readNextGuess(e)
                }), this.recentMentionedWords.push(n), this.mentionedWords[n] = 1
            }
        }, {
            key: "setResultWord",
            value: function(e) {
                var t = this;
                this.guessesQueue = [], this.speakAndWrite("Oh I know, it's " + e + "!"), setTimeout(function() {
                    0 == t.guessesQueue.length && t.setText("...")
                }, 3e3)
            }
        }, {
            key: "setGuesses",
            value: function(e) {
                var t = this;
                this.guessesQueue = _.filter(e, function(e) {
                    return !_.has(t.mentionedWords, e)
                });
                var n = this.guessesQueue.length;
                return !this.talkingGuesses && this.guessesQueue.length > 0 && this.readNextGuess(!0), n
            }
        }, {
            key: "updateEyes",
            value: function() {
                var e = void 0,
                    t = void 0;
                this.relaxEyes ? (e = 0, t = 0) : (e = this.lookAtX - (this.offset.left + this.width / 2), t = this.lookAtY - (this.offset.top + this.height / 3), Math.abs(t) > Math.abs(e) ? (e /= Math.abs(t), t /= Math.abs(t)) : (t /= Math.abs(e), e /= Math.abs(e))), (Math.abs(e - this.eyeX) > .001 || Math.abs(t - this.eyeY) > .001) && (this.eyeX += .3 * (e - this.eyeX), this.eyeY += .3 * (t - this.eyeY), this.eyesElm.css({
                    left: 9 * this.eyeX,
                    top: 9 * this.eyeY
                }))
            }
        }]), e
    }(),
    DrawingRecognitionControllerEvents = {
        NEW_RECOGNITIONS: "NEW_RECOGNITIONS"
    },
    DrawingRecognitionController = function(e) {
        function t() {
            classCallCheck(this, t);
            var e = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return e.wordBlacklist = config.blacklist, e.machineView = new MachineView, e.processDrawingThrottle = _.throttle(function(t) {
                return e.processDrawing(t)
            }, 1e3 * config.max_api_rate, {
                leading: !1
            }), e.isRecognizing = !1, e.reset(), e
        }
        return inherits(t, e), createClass(t, [{
            key: "reset",
            value: function() {}
        }, {
            key: "start",
            value: function() {
                this.reset(), this.isRecognizing = !0
            }
        }, {
            key: "stop",
            value: function() {
                this.isRecognizing = !1
            }
        }, {
            key: "processDrawing",
            value: function(e) {
                var t = this,
                    n = e.getSegments(),
                    i = _.reduce(n, function(e, t) {
                        return e + t[0].length
                    }, 0);
                i > 10 && HandwritingAPI.processSegments(n, e.canvas.width, e.canvas.height).then(function(e) {
                    return t.processRecognitionResponse(e)
                })
            }
        }, {
            key: "processRecognitionResponse",
            value: function(e) {
                if (this.isRecognizing) {
                    var t = this.filterGuesses(e);
                    this.emit(DrawingRecognitionControllerEvents.NEW_RECOGNITIONS, t)
                }
            }
        }, {
            key: "filterGuesses",
            value: function(e) {
                var t = _.filter(e, function(e) {
                    return e.score < config.handwriting_threshold
                });
                return t
            }
        }, {
            key: "onDrawingUpdated",
            value: function(e) {
                this.isRecognizing && this.processDrawingThrottle(e)
            }
        }]), t
    }(EventEmitter),
    DrawingCanvas = function(e) {
        function t() {
            classCallCheck(this, t);
            var e = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            paper.install(window), e.canvas = document.getElementById("drawingCanvas"), paper.setup(e.canvas);
            var n, i = new Tool;
            return e.fgColor = "black", e.bgColor = "#68747a", e.paperpaths = [], e.paths = [], e.startTime = void 0, i.onMouseDown = function(t) {
                n && (n.selected = !1), n = new paper.Path({
                    segments: [t.point],
                    strokeColor: e.fgColor,
                    strokeCap: "round",
                    strokeWidth: 7
                }), e.paperpaths.push(n), 0 == e.paths.length && (e.startTime = new Date), e.paths.push([
                    [t.point.x],
                    [t.point.y],
                    [e.currentTimeMs()]
                ]), paper.view.draw()
            }, i.onMouseDrag = function(t) {
                n.add(t.point);
                var i = _.last(e.paths);
                (0 == i[0].length || Math.abs(_.last(i[0]) - t.point.x) > 4 || Math.abs(_.last(i[1]) - t.point.y) > 4) && (i[0].push(t.point.x), i[1].push(t.point.y), i[2].push(e.currentTimeMs())), n.smooth(), paper.view.draw(), e.emit("DRAWING_UPDATED", e)
            }, i.onMouseUp = function(t) {
                n.smooth(), paper.view.draw(), e.emit("DRAWING_UPDATED", e), _.last(e.paths)[0].push(t.point.x), _.last(e.paths)[1].push(t.point.y), _.last(e.paths)[2].push(e.currentTimeMs())
            }, $(window).resize(function() {
                e.resizeCanvas()
            }), $(window).on("orientationchange", function() {
                e.resizeCanvas()
            }), e.resizeCanvas(), e
        }
        return inherits(t, e), createClass(t, [{
            key: "currentTimeMs",
            value: function() {
                return this.startTime ? new Date - this.startTime : 0
            }
        }, {
            key: "undo",
            value: function() {
                this.paperpaths.length > 0 && (this.paperpaths[this.paths.length - 1].remove(), this.paperpaths.splice(this.paperpaths.length - 1, 1), paper.view.draw())
            }
        }, {
            key: "clear",
            value: function() {
                project.activeLayer.removeChildren(), this.paperpaths = [], this.resizeCanvas(), delete this.startTime, this.paths = []
            }
        }, {
            key: "getSegments",
            value: function() {
                return this.paths
            }
        }, {
            key: "getJpg",
            value: function() {
                var e = document.createElement("canvas");
                e.width = 640, e.height = this.canvas.height * (640 / this.canvas.width);
                var t = e.getContext("2d");
                t.beginPath(), t.rect(0, 0, e.width, e.height), t.fillStyle = this.bgColor, t.fill(), t.drawImage(this.canvas, 0, 0, e.width, e.height);
                var n = e.toDataURL("image/jpeg");
                return n.replace("data:image/jpeg;base64,", "")
            }
        }, {
            key: "resizeCanvas",
            value: function() {
                var e = paper.view.center;
                if (this.canvas.width = window.innerWidth, this.canvas.height = window.innerHeight, this.canvas.style.width = window.innerWidth + "px", this.canvas.style.height = window.innerHeight + "px", paper.view.viewSize = new Size(this.canvas.width, this.canvas.height), this.paperpaths.length > 0)
                    for (var t = 0; t < this.paperpaths.length; t++) {
                        var n = paper.view.center.x - e.x,
                            i = paper.view.center.y - e.y;
                        this.paperpaths[t].position.x += n, this.paperpaths[t].position.y += i
                    }
                paper.view.draw()
            }
        }, {
            key: "drawBg",
            value: function() {
                var e = new Rectangle(new Point(0, 0), new Point(this.canvas.width, this.canvas.height)),
                    t = new Path.Rectangle(e);
                t.fillColor = this.bgColor, t.sendToBack()
            }
        }, {
            key: "drawAnchorPoint",
            value: function() {
                var e = new Path.Circle(paper.view.center, 10);
                e.fillColor = "red", e.sendToBack()
            }
        }]), t
    }(EventEmitter),
    GameView = function(e) {
        function t() {
            classCallCheck(this, t);
            var e = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return e.elm = $("#gameview"), e.popup = new PopupView, $("#button-undo").on("touchend mouseup", function() {
                e.emit("UNDO")
            }), $("#button-clear").on("touchend mouseup", function() {
                e.emit("CLEAR")
            }), $("#button-skip").on("touchend mouseup", function() {
                e.emit("SKIP")
            }), e.elm.find(".button-close").on("touchend mouseup", function() {
                e.popup.showQuitPopup().then(function() {
                    e.emit("EXIT_GAME")
                }).catch(function() {})
            }), $("#peek-button-static").on("touchend mouseup", function() {
                e.emit("SHOW_CARD")
            }), e
        }
        return inherits(t, e), createClass(t, [{
            key: "showTooltips",
            value: function() {
                var e = this.elm.find(".tooltip");
                e.fadeIn({
                    duration: 0
                }), e.each(function() {
                    var e = this;
                    setTimeout(function() {
                        $(e).fadeOut({
                            duration: 800
                        })
                    }, _.random(3e3, 3400))
                })
            }
        }, {
            key: "hideSkip",
            value: function() {
                $("#button-skip").hide()
            }
        }, {
            key: "showSkip",
            value: function() {
                $("#button-skip").show()
            }
        }, {
            key: "showClearSkipTooltip",
            value: function() {}
        }]), t
    }(EventEmitter),
    _clock_instance = null,
    Clock = function(e) {
        function t() {
            var e;
            classCallCheck(this, t);
            var n = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return _clock_instance || (_clock_instance = n, n.elm = $("#clock"), n.timeElm = $("#clock-time"), n.reset(), n.beepSound = document.getElementById("beep"), n.alertFlip = !1, n.started = !1), e = _clock_instance, possibleConstructorReturn(n, e)
        }
        return inherits(t, e), createClass(t, [{
            key: "reset",
            value: function() {
                this.totalTime = config.round_length, this.timeleft = config.round_length, this.started = !1, this.updateElm()
            }
        }, {
            key: "startClock",
            value: function() {
                var e = this;
                this.started = !0, this.interval && clearInterval(this.interval), this.interval = setInterval(function() {
                    e.timeleft -= .1, e.updateElm(), e.timeleft <= 0 && (e.timeleft = 0, e.pauseClock(), e.emit("TIMES_UP"))
                }, 100)
            }
        }, {
            key: "pauseClock",
            value: function() {
                this.started = !1, clearInterval(this.interval), this.interval = null
            }
        }, {
            key: "updateElm",
            value: function() {
                var e = Math.round(this.timeleft),
                    t = Math.floor(e / 60),
                    n = e % 60;
                this.started && (e < 5 ? Math.round(10 * this.timeleft) % 2 == 0 ? this.alertFlip || (this.alertFlip = !this.alertFlip, this.beepSound.play(), this.elm.addClass("text-blink")) : this.alertFlip && (this.alertFlip = !this.alertFlip, this.elm.removeClass("text-blink")) : this.elm.removeClass("text-blink")), t = ("00" + t).slice(-2), n = ("00" + n).slice(-2), this.timeElm.text(t + ":" + n)
            }
        }]), t
    }(EventEmitter),
    GameController = function(e) {
        function t() {
            classCallCheck(this, t);
            var e = possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
            return e.recognitionController = new DrawingRecognitionController, e.clock = new Clock, e.drawingCanvas = new DrawingCanvas, e.gameView = new GameView, e.cardsView = new CardsView, e.machineView = new MachineView, e.drawingUntouched = !0, e.drawingCanvas.addListener("DRAWING_UPDATED", function(t) {
                e.onDrawingUpdated(t)
            }), e.gameView.addListener("UNDO", function() {
                return e.drawingCanvas.undo()
            }), e.gameView.addListener("CLEAR", function() {
                return e.drawingCanvas.clear()
            }), e.gameView.addListener("SKIP", function() {
                return e.skipRound()
            }), e.gameView.addListener("EXIT_GAME", function() {
                return e.exitGame()
            }), e.clock.addListener("TIMES_UP", function() {
                return e.roundTimesUp()
            }), e.recognitionController.addListener(DrawingRecognitionControllerEvents.NEW_RECOGNITIONS, function(t) {
                return e.onNewRecognitions(t)
            }), e.elm = $("#gameview").hide(), e.resetGameRounds(), e.newGuessesCounter = 0, e
        }
        return inherits(t, e), createClass(t, [{
            key: "prepareNewGame",
            value: function(e) {
                var t = this;
                if (this.preparedChallenge) {
                    if (e) {
                        var n = _.clone(this.preparedChallenge);
                        this.preparedChallenge = void 0, e(n)
                    }
                } else fetchNewRound(1, [], function(n) {
                    e ? e(n) : t.preparedChallenge = n
                })
            }
        }, {
            key: "startNewGameWithChallenge",
            value: function(e, t) {
                var n = this;
                t = _.defaults(t || {}, {
                    onCardDismiss: void 0
                }), this.resetGameRounds(), this.level = 1, this.completedLevels = 0, this.clock.reset(), this.clock.startClock(), this.setStatus(0, config.num_rounds), this.startNewRoundWithChallenge(e, {
                    onCardDismiss: t.onCardDismiss
                }), this.gameView.showTooltips(), this.gameView.addListener("CLEAR", function() {
                    return n.machineView.reset()
                })
            }
        }, {
            key: "setStatus",
            value: function(e, t) {
                $("#game-status").text("Drawing " + e + " / " + t)
            }
        }, {
            key: "resetGameRounds",
            value: function() {
                this.presentedWords = [], this.previousRounds = []
            }
        }, {
            key: "startFreeplayGame",
            value: function() {
                var e = this;
                this.resetGameRounds(), this.recognitionController.start(), this.gameView.addListener("CLEAR", function() {
                    return e.recognitionController.reset()
                })
            }
        }, {
            key: "startNewRoundWithChallenge",
            value: function(e, t) {
                var n = this;
                t = _.defaults(t || {}, {
                    showCard: !0,
                    skipped: !1,
                    timesUp: !1,
                    onCardDismiss: function() {}
                }), this.pauseGame(), this.setStatus(this.level, config.num_rounds), this.currentRound = new GameRound(e, this.level), this.currentRound.width = this.drawingCanvas.canvas.width, this.currentRound.height = this.drawingCanvas.canvas.height, this.presentedWords.push(this.currentRound.word);
                var i = function() {
                    ga("send", "event", "Round", "start", n.level), $("#topbar-text").text("Draw: " + n.currentRound.word), n.drawingCanvas.clear(), n.machineView.reset(), n.recognitionController.start(), n.clock.reset(), n.clock.startClock()
                };
                if (t.showCard) {
                    var r = "complete";
                    t.skipped && (r = "skip"), t.timesUp && (r = "timesup"), 1 == this.level && (r = "first"), this.cardsView.showNewRoundCard({
                        level: this.level,
                        word: this.currentRound.presentationWord,
                        mode: r,
                        onCardDismiss: function() {
                            t.onCardDismiss(), i()
                        }
                    })
                } else i();
                this.level == config.num_rounds ? this.gameView.hideSkip() : this.gameView.showSkip()
            }
        }, {
            key: "pauseGame",
            value: function() {
                this.clock.pauseClock(), clearTimeout(this.userNotDrawingTimeout)
            }
        }, {
            key: "resumeGame",
            value: function() {
                this.clock.startClock()
            }
        }, {
            key: "skipRound",
            value: function() {
                var e = this;
                ga("send", "event", "Round", "skip", this.level), this.recognitionController.stop(), this.submitRoundResult({
                    recognition: !1
                }, function(t) {
                    e.previousRounds.push(e.currentRound), e.machineView.reset(), e.level < config.num_rounds ? (e.level++, e.startNewRoundWithChallenge(t, {
                        skipped: !0
                    })) : e.endGame()
                })
            }
        }, {
            key: "roundRecognized",
            value: function(e) {
                var t = this;
                ga("send", "event", "Round", "recognized"), this.recognitionController.stop(), this.pauseGame(), this.machineView.setResultWord(this.currentRound.word), setTimeout(function() {
                    t.submitRoundResult({
                        recognition: e
                    }, function(e) {
                        t.previousRounds.push(t.currentRound), t.completedLevels++, t.level++, t.level - 1 == config.num_rounds ? t.endGame() : t.startNewRoundWithChallenge(e)
                    })
                }, 1500)
            }
        }, {
            key: "roundTimesUp",
            value: function() {
                var e = this;
                ga("send", "event", "Round", "times_up", this.level), this.recognitionController.stop(), setTimeout(function() {
                    e.machineView.speakAndWrite(_.sample(config.timesUpSentences))
                }, 500), this.submitRoundResult({
                    recognition: !1
                }, function(t) {
                    e.previousRounds.push(e.currentRound), e.level < config.num_rounds ? (e.machineView.reset(), e.level++, e.startNewRoundWithChallenge(t, {
                        skipped: !0,
                        timesUp: !0
                    })) : e.endGame()
                })
            }
        }, {
            key: "endGame",
            value: function() {
                var e = this;
                ga("send", "event", "Game", "end", this.level), this.recognitionController.stop(), this.clock.pauseClock(), this.machineView.reset(), _.last(this.previousRounds) != this.currentRound && this.previousRounds.push(this.currentRound), this.cardsView.showTimesUpCard(this.previousRounds, function(t) {
                    "CLOSE" == t ? e.exitGame() : (ga("send", "event", "Game", "end_restart"), e.prepareNewGame(function(t) {
                        e.startNewGameWithChallenge(t)
                    }))
                })
            }
        }, {
            key: "exitGame",
            value: function() {
                ga("send", "event", "Game", "exit", this.level), this.pauseGame(), this.recognitionController.stop(), this.machineView.setGuesses([]), this.currentRound = void 0, this.clock.pauseClock(), this.emit("GAME_END")
            }
        }, {
            key: "showView",
            value: function() {
                this.elm.show(), ga("send", "screenview", {
                    screenName: "Gameview"
                })
            }
        }, {
            key: "hideView",
            value: function() {
                this.elm.hide()
            }
        }, {
            key: "submitRoundResult",
            value: function(e, t) {
                var n = this;
                this.currentRound.drawing = this.drawingCanvas.getSegments(), this.currentRound.recognized = !!e.recognition, this.currentRound.recognitionId = e.recognition ? e.recognition.id : 0, sendResult(this.currentRound, this.presentedWords, function(e) {
                    e.lastroundid && (n.currentRound.key = e.lastroundid), t && t(e)
                })
            }
        }, {
            key: "onNewRecognitions",
            value: function(e) {
                var t = this;
                if (this.currentRound.recognitions = e, this.recognitionController.isRecognizing) {
                    var n = _.find(e, function(e) {
                        return (e.word == t.currentRound.word || _.contains(t.currentRound.synonyms, e.word)) && e.score < config.handwriting_recognition_threshold
                    });
                    if (this.currentRound && n) this.roundRecognized(n);
                    else if (this.currentRound) {
                        e = _.filter(e, function(e) {
                            return e.word != t.currentRound.word
                        });
                        var i = this.machineView.setGuesses(_.pluck(e, "word"));
                        0 == i ? this.newGuessesCounter++ : this.newGuessesCounter = 0, this.newGuessesCounter > 2 && (this.newGuessesCounter = 0, this.machineView.speakAndWrite(_.sample(config.noNewGuessesSentences)), this.gameView.showClearSkipTooltip())
                    }
                }
            }
        }, {
            key: "onDrawingUpdated",
            value: function(e) {
                this.userNotDrawingTimeout && clearTimeout(this.userNotDrawingTimeout), this.recognitionController.onDrawingUpdated(e), this.drawingUntouched && (this.drawingUntouched = !1, this.machineView.setText("..."))
            }
        }]), t
    }(EventEmitter),
    App = function() {
        function e() {
            var t = this;
            classCallCheck(this, e), document.ontouchmove = function(e) {
                e.touches && e.touches.length > 1 && e.preventDefault()
            }, ShuffleHandwrittenText($(".handwritten")), $(".handwritten").removeClass("handwritten"), this.gameController = new GameController, this.gameController.prepareNewGame(), this.gameController.addListener("GAME_END", function() {
                return t.showSplashscreen()
            }), this.cardsView = new CardsView, this.splashView = new SplashView, this.splashView.showView(), this.splashView.addListener("START_GAME", function() {
                return t.startGame()
            }), this.splashView.addListener("START_GAME_FREEPLAY", function() {
                return t.startGameFreeplay()
            }), setTimeout(function() {}), this.getUrlParameterByName("gallery") && this.cardsView.showGallery(this.getUrlParameterByName("gallery")), $(".hidden-on-startup").removeClass("hidden-on-startup")
        }
        return createClass(e, [{
            key: "showSplashscreen",
            value: function() {
                this.gameController.hideView(), this.splashView.showView(), ga("send", "screenview", {
                    screenName: "Splashscreen"
                })
            }
        }, {
            key: "startGame",
            value: function() {
                var e = this;
                this.gameController.prepareNewGame(function(t) {
                    e.gameController.startNewGameWithChallenge(t, {
                        onCardDismiss: function() {
                            e.splashView.hideView(), e.gameController.showView()
                        }
                    })
                })
            }
        }, {
            key: "startGameFreeplay",
            value: function() {
                this.splashView.hideView(), this.gameController.showView(), this.gameController.startFreeplayGame()
            }
        }, {
            key: "getUrlParameterByName",
            value: function(e) {
                var t = window.location.href;
                e = e.replace(/[\[\]]/g, "\\$&");
                var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)"),
                    i = n.exec(t);
                return i ? i[2] ? decodeURIComponent(i[2].replace(/\+/g, " ")) : "" : null
            }
        }]), e
    }(),
    app;
$(document).ready(function() {
        app = new App
    }),
    function(e, t, n, i, r, o, s) {
        e.GoogleAnalyticsObject = r, e[r] = e[r] || function() {
            (e[r].q = e[r].q || []).push(arguments)
        }, e[r].l = 1 * new Date, o = t.createElement(n), s = t.getElementsByTagName(n)[0], o.async = 1, o.src = i, s.parentNode.insertBefore(o, s)
    }(window, document, "script", "https://www.google-analytics.com/analytics.js", "ga"), ga("create", "UA-85918250-1", "auto"), ga("send", "pageview");