const sidebar = () => {
    const e = document.querySelector(".sidebar");
    var t = document.querySelector('[data-collapse="sidebar"]');
    const r = document.querySelector(".burger"),
      c = e.querySelectorAll("[data-expanded]"),
      a =
        (t.addEventListener("click", () => {
          a(), r.classList.add("active");
        }),
        r.addEventListener("click", () => {
          s(), r.classList.remove("active");
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
  popProject = () => {
    const t = document.querySelector(".search-projects-menu");
    var e = t.querySelector(".select-project-btn");
    let r = !1;

    const c = () => {
      t.classList.remove("active"), (r = !1);
      e.style.borderColor = "#e5e5ea";
    };

    changeContent(t, "select-project-btn", c);

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
  popFolders = () => {
    const t = document.querySelector(".search-folders-menu");
    var e = t.querySelector(".select-folders-btn");
    let r = !1;

    const c = () => {
      t.classList.remove("active"), (r = !1);
      e.style.borderColor = "#e5e5ea";
    };

    changeContent(t, "select-folders-btn", c);

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
  downloads = () => {
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
  };

sidebar(),
  dropdown(),
  userDropdown(),
  project(),
  refresh(),
  popProject(),
  popFolders(),
  downloads(),
  settings();

function changeContent(itemsParent, itemClass, close) {
  const items = itemsParent.querySelectorAll(".folder");
  items.forEach((el) => {
    el.addEventListener("click", (e) => {
      document.querySelector(`.${itemClass}`).textContent =
        e.target.textContent;
      close();
      console.log("folder");
    });
  });
}
