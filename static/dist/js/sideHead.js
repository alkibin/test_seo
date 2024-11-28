const sidebar = () => {
    const e = document.querySelector(".sidebar");
    var t = document.querySelector('[data-collapse="sidebar"]');
    const r = document.querySelector(".burger"),
      c = e.querySelectorAll("[data-expanded]"),
      a =
        (t.addEventListener("click", () => {
          a(), r.classList.add("active");
          setCookie("sidebar", 1, 365);
        }),
        r.addEventListener("click", () => {
          s(), r.classList.remove("active");
          setCookie("sidebar", 2, 365);
        }),
        () => {
          (e.dataset.expanded = "true"), n("true");
        }),
      s = () => {
        (e.dataset.expanded = "false"), n("false");
      },
      n = (t) => {
        c.forEach((e) => {
          e.dataset.expanded = t;
        });
      };
  },
  dropdown = () => {
    document.querySelectorAll("[data-dropdown]").forEach((e) => {
      const t = e.querySelector("[data-toggle]"),
        r = e.querySelector("[data-submenu]"),
        c = r.scrollHeight;
      t.addEventListener("click", () => {
        t.classList.toggle("active"),
          r.clientHeight
            ? ((r.style.height = "0"), (e.dataset.visible = "false"))
            : ((r.style.height = c + "px"), (e.dataset.visible = "true"));
      });
    });
  },
  userDropdown = () => {
    const t = document.querySelector(".user");
    var e = t.querySelector(".user__btn");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  project = () => {
    if (!document.querySelector(".project")) return;

    const t = document.querySelector(".project");
    var e = t.querySelector(".project__btn");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  refresh = () => {
    if (!document.querySelector(".refresh")) return;

    var e = document.querySelector(".refresh"),
      t = e.querySelector(".refresh__btn");
    const r = e.querySelector("[data-refresh-date]"),
      c = e.querySelector("[data-refresh-time]");
    e = () => {
      var { currentDate: e, currentTime: t } = (() => {
        const e = new Date(),
          t = e.toLocaleDateString(),
          r = e.toLocaleTimeString().slice(0, 5);
        return { currentDate: t, currentTime: r };
      })();
      (r.textContent = e), (c.textContent = t);
    };
    e(), t.addEventListener("click", e);
  },
  popProject = (wrap) => {
    const wrapper = document.querySelector(`${wrap}`);
    const t = wrapper.querySelector(".search-projects-menu");
    var e = t.querySelector(".select-project-btn");
    let r = !1;

    const c = () => {
      t.classList.remove("active"), (r = !1);
      e.style.borderColor = "#e5e5ea";
    };

    changeContent(t, e, c, wrap);

    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
      e.style.borderColor = "#0076f5";
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  popFolders = (wrap) => {
    const t = document.querySelector(".search-folders-menu");
    var e = t.querySelector(".select-folders-btn");
    let r = !1;

    const c = () => {
      t.classList.remove("active"), (r = !1);
      e.style.borderColor = "#e5e5ea";
    };

    changeContent(t, e, c, wrap);

    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
      e.style.borderColor = "#0076f5";
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  popRegions = () => {
    const allElements = document.querySelectorAll(".regions-menu");

    allElements.forEach((el) => {
      const t = el;
      var e = t.querySelector(".regions-btn");
      let r = !1;

      const c = () => {
        t.classList.remove("active"), (r = !1);
        e.style.borderColor = "#e5e5ea";
      };

      changeContent(t, e, c, "country");

      e.addEventListener("click", () => {
        t.classList.toggle("active"), (r = !r);
        e.style.borderColor = "#0076f5";
      }),
        window.addEventListener("click", (e) => {
          r && !t.contains(e.target) && c();
        }),
        window.addEventListener("keydown", (e) => {
          r && "Escape" === e.key && c();
        });
    });
  },
  downloads = () => {
    if (!document.querySelector(".body-panel__download")) return;
    const t = document.querySelector(".body-panel__download");
    var e = t.querySelector(".body-panel-download__btn");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  settings = () => {
    if (!document.querySelector(".body-panel__settings")) return;
    const t = document.querySelector(".body-panel__settings");
    var e = t.querySelector(".settings-button");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  countPages = () => {
    const t = document.querySelector(".pos-pag__variables");
    var e = t.querySelector(".pos-pag-button");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  copy = () => {
    const t = document.querySelector(".copy-wrap");
    var e = t.querySelector(".copy-button");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  google = (body, button) => {
    if (!document.querySelector(`${body}`)) return;
    const t = document.querySelector(`${body}`);
    var e = t.querySelector(`${button}`);
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  device = (body, button) => {
    if (!document.querySelector(`${body}`)) return;
    const t = document.querySelector(`${body}`);
    var e = t.querySelector(`${button}`);
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  deviceRegion = () => {
    if (!document.querySelector(".region__device")) return;

    const allElements = document.querySelectorAll(".region__device");

    allElements.forEach((el) => {
      const t = el;
      var e = t.querySelector(".region__device-btn");
      let r = !1;
      const c = () => {
        t.classList.remove("active"), (r = !1);
      };

      changeContent(t, e, c, "regionDevice");

      e.addEventListener("click", () => {
        t.classList.toggle("active"), (r = !r);
      }),
        window.addEventListener("click", (e) => {
          r && !t.contains(e.target) && c();
        }),
        window.addEventListener("keydown", (e) => {
          r && "Escape" === e.key && c();
        });
    });
  },
  frequency = () => {
    if (!document.querySelector(".frequency__body")) return;
    const t = document.querySelector(".frequency__body");
    var e = t.querySelector(".frequency-btn");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  copyAndTable = (e) => {
    if (!document.querySelector(".body-panel__copy")) return;
    const t = e.target.closest(".body-panel__copy");
    var e = t.querySelector(".copy-btn");
    let r = !1;
    const c = () => {
      t.classList.remove("active"), (r = !1);
    };
    t.classList.toggle("active"), (r = !r);

    window.addEventListener("click", (e) => {
      r && !t.contains(e.target) && c();
    }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  },
  timeChosePop = (wrap) => {
    if (!document.querySelector(`${wrap} .time-menu`)) return;
    const t = document.querySelector(`${wrap} .time-menu`);
    var e = t.querySelector(".time-btn");
    let r = !1;

    const c = () => {
      t.classList.remove("active"), (r = !1);
    };

    changeContent(t, e, c, wrap);

    e.addEventListener("click", () => {
      t.classList.toggle("active"), (r = !r);
    }),
      window.addEventListener("click", (e) => {
        r && !t.contains(e.target) && c();
      }),
      window.addEventListener("keydown", (e) => {
        r && "Escape" === e.key && c();
      });
  };

sidebar(),
  dropdown(),
  userDropdown(),
  project(),
  refresh(),
  popProject(".pop-project"),
  document.querySelector(".pos-pag") ? popProject(".pos-pag") : "",
  document.querySelector(".edit") ? popProject(".edit-tab-1") : "",
  popFolders("project"),
  downloads(),
  settings(),
  document.querySelector(".pos-pag") ? countPages() : "",
  document.querySelector(".copy-wrap") ? copy() : "";

if (document.querySelector(".body-panel__google")) {
  google(".body-panel__google--1", ".google-btn--1");
  google(".body-panel__google--2", ".google-btn--2");
  device(".body-panel__device--1", ".device-btn--1");
  device(".body-panel__device--2", ".device-btn--2");
  frequency();
}
if (document.querySelector(".pop-pos")) {
  popRegions();
  deviceRegion();
  timeChosePop(".pop-pos");
}
if (document.querySelector(".edit")) {
  timeChosePop(".edit");
}
function changeContent(itemsParent, itemClass, close, wrap) {
  const items = itemsParent.querySelectorAll(".folder");
  items.forEach((el) => {
    el.addEventListener("click", (e) => {
      if (wrap == ".pop-project" || wrap == ".edit-tab-1") {
        itemClass.textContent = e.target.textContent;
      }
      if (wrap == "country") {
        itemClass.querySelector("span").textContent = e.target.textContent;
      }
      if (wrap == "project") {
        itemClass.querySelector("span").textContent = e.target.textContent;
        itemClass.querySelector("span").style.color = "#404040";
      }
      if (wrap == ".pop-pos" || wrap == ".edit") {
        const parent = document.querySelector(wrap);
        parent
          .querySelector(".time-btn")
          .nextElementSibling.classList.remove("active");

        itemClass.querySelector("span").textContent = e.target.textContent;
        const allTypes = parent.querySelectorAll(".time-type");

        allTypes.forEach((el) => {
          el.classList.remove("active");
        });
        switch (e.target.textContent) {
          case "По требованию":
            break;
          case "Ежечасно":
            break;
          case "Ежедневно":
            parent.querySelector(".time-type-daily").classList.add("active");
            break;
          case "Еженедельно":
            parent.querySelector(".time-type-weekly").classList.add("active");
            break;
          case "В определенные дни недели":
            parent.querySelector(".time-type-certain").classList.add("active");
            break;
          case "В определенные дни месяца":
            parent.querySelector(".time-type-month").classList.add("active");
            break;
          case "После апдейтов Яндекса":
            break;
        }
      }
      if (wrap == "regionDevice") {
        console.log("regd");

        const svg = e.target.closest(".folder").querySelector(".folder-device");
        const body = e.target
          .closest(".region__device")
          .querySelector(".region__device-svg-wrap");
        body.innerHTML = svg.outerHTML;
      }
      close();
    });
  });
}

//Сохранить положение sidebar
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
