document.addEventListener("DOMContentLoaded", () => {
  //Создание папки в popup
  const createFolder = (wrap) => {
    const wrapper = document.querySelector(`${wrap}`);
    wrapper
      .querySelector(".btn-create-folder-pop")
      .addEventListener("click", () => {
        const container = wrapper.querySelector(".search__folders-wrap");
        const nameFolder = wrapper.querySelector(".add-folder-name").value;
        if (!nameFolder) return;

        //Защита от XSS Атак.
        function escapeHtml(text) {
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
          };
          return text.replace(/[&<>"']/g, (m) => map[m]);
        }

        container.insertAdjacentHTML(
          "beforeend",
          `
          <div class="folder" data-visible="false">
            <div class="folder__btn btn-reset">
              <span>${escapeHtml(nameFolder)}</span>
            </div>
          </div>
        `
        );
        wrapper.querySelector(".add-folder-name").value = "";

        const folders = wrapper
          .querySelector(".search-projects-menu")
          .querySelectorAll(".folder");

        wrapper.querySelector(".select-project-btn").textContent =
          folders[folders.length - 1].textContent;
        wrapper
          .querySelector(".search-projects-menu")
          .classList.remove("active");
        wrapper.querySelector(".select-project-btn").style.borderColor =
          "#e5e5ea";
        folders[folders.length - 1].addEventListener("click", (e) => {
          wrapper.querySelector(".select-project-btn").textContent =
            e.target.textContent;
          wrapper
            .querySelector(".search-projects-menu")
            .classList.remove("active");
          wrapper.querySelector(".select-project-btn").style.borderColor =
            "#e5e5ea";
        });
      });
  };
  //Создание папки, кнопка (В группу)
  const createFolderWIthPositions = (wrap) => {
    const wrapper = document.querySelector(`${wrap}`);
    wrapper
      .querySelector(".btn-create-folder-pop")
      .addEventListener("click", () => {
        const container = wrapper.querySelector(".search__folders-wrap");
        const nameFolder = wrapper.querySelector(".add-folder-name").value;
        if (!nameFolder) return;

        //Защита от XSS Атак.
        function escapeHtml(text) {
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
          };
          return text.replace(/[&<>"']/g, (m) => map[m]);
        }

        container.insertAdjacentHTML(
          "beforeend",
          `
          <div class="folder" data-visible="false">
            <div class="folder__btn btn-reset">
              <span>${escapeHtml(nameFolder)}</span>
            </div>
          </div>
        `
        );
        wrapper.querySelector(".add-folder-name").value = "";

        const folders = wrapper
          .querySelector(".search-projects-menu")
          .querySelectorAll(".folder");

        wrapper
          .querySelector(".search-projects-menu")
          .classList.remove("active");

        folders[folders.length - 1].addEventListener("click", (e) => {
          wrapper
            .querySelector(".search-projects-menu")
            .classList.remove("active");

          console.log(e.target.textContent);
        });
      });
  };
  createFolder(".pop-project");
  createFolderWIthPositions(".pos-pag");

  //Вывод кнопки создания папки в popup
  const createFolderButton = (wrap) => {
    const wrapper = document.querySelector(`${wrap}`);
    wrapper.querySelector(".btn-new-folder").addEventListener("click", (e) => {
      const input = wrapper.querySelector(".add-folder");
      input.classList.add("active");
      wrapper.querySelector(".btn-new-folder").classList.remove("active");
    });
  };
  createFolderButton(".pop-project");
  createFolderButton(".pos-pag");

  // if (document.querySelector('.project-page')) {

  // }

  // ------------------------------------------------------------ Пример отправки формы
  const form = document.getElementById("project-form-auto-f");
  const form2 = document.getElementById("project-form-auto-t");
  const form3 = document.getElementById("project-form-new-project");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("submit  1");

    document.querySelector(".gui-switch-popup").style.display = "none";
    // if (document.querySelector(".pop-project__next")) {
    //   document.querySelector(".pop-project__next").style.display = "none";

    //   if (document.querySelector(".pop-project__type-pos")?.checked) {
    //     document
    //       .querySelector(".project-form-new-project")
    //       .querySelector(".blue-button").textContent = "Создать съем";
    //   }
    // }

    document.querySelector(".project-form-auto-f").classList.remove("active");
    document.querySelector(".project-form-auto-t").classList.remove("active");
    document.querySelector(".project-form-new-project").classList.add("active");
  });
  form2.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("submit  2");

    document.querySelector(".gui-switch-popup").style.display = "none";
    // if (document.querySelector(".pop-project__next")) {
    //   document.querySelector(".pop-project__next").style.display = "none";

    //   if (document.querySelector(".pop-project__type-pos")?.checked) {
    //     document
    //       .querySelector(".project-form-new-project")
    //       .querySelector(".blue-button").textContent = "Создать съем";
    //   }
    // }

    document.querySelector(".project-form-auto-f").classList.remove("active");
    document.querySelector(".project-form-auto-t").classList.remove("active");
    document.querySelector(".project-form-new-project").classList.add("active");
  });

  form3.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("submit  3");
    const input1 = document.querySelector(".select-folders-btn");
    const input2 = document.querySelector(".name-project-input");

    //Валидация
    if (
      input1.querySelector("span").textContent == "Выберите проект из списка"
    ) {
      input1.classList.add("input-error");
      document.querySelector(".input-title__error-6").classList.add("active");
      return;
    } else {
      input1.classList.remove("input-error");
      document
        .querySelector(".input-title__error-6")
        .classList.remove("active");
    }

    if (input2.value <= 0) {
      input2.classList.add("input-error");
      document.querySelector(".input-title__error-7").classList.add("active");
      return;
    } else {
      input2.classList.remove("input-error");
      document
        .querySelector(".input-title__error-7")
        .classList.remove("active");
    }

    // if (
    //   document.querySelector(".pop-project__type-pos")?.checked ||
    //   document.querySelector(".positions-page")
    // ) {
    //   document.querySelector(".pop-project").classList.remove("active");
    //   document.querySelector(".pop-pos").classList.add("active");
    // } else {
    document.querySelector(".accept-popup").classList.add("active");
    document.querySelector(".pop-project__sure").style.display = "none";
    document.querySelector(".pop-project__sub").style.display = "none";
    document
      .querySelector(".project-form-new-project")
      .classList.remove("active");
    // }
  });
  //  Пример отправки формы  ------------------------------------------------------------

  //Тип формы в popup. Auto -> true, false
  document.querySelector(".pop-variable").addEventListener("click", (e) => {
    const form1 = document.querySelector(".project-form-auto-f");
    const form2 = document.querySelector(".project-form-auto-t");
    if (e.target.checked === true) {
      form1.classList.remove("active");
      form2.classList.add("active");
    } else {
      form2.classList.remove("active");
      form1.classList.add("active");
    }
  });

  //Закрыть popup
  // Param_1: Имя кнопок, которые закрывают popup
  // Param_2: Имя самого popup
  const handlerClosePopup = (buttons, popup) => {
    const closeButtons = document.querySelectorAll(`${buttons}`);

    closeButtons.forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelector(".popup-background").classList.remove("active");
        document.querySelector(`${popup}`).classList.remove("active");
      });
    });

    //Отлавлием клик вне popup для его закрытия
    document.addEventListener("click", (event) => {
      if (event.target === document.querySelector(".popup-background")) {
        document.querySelector(".popup-background").classList.remove("active");
        document.querySelector(`${popup}`).classList.remove("active");
      }
    });
  };

  //Открыть popup
  const openPopup = (button, popup) => {
    document.querySelector(`${button}`).addEventListener("click", () => {
      document.querySelector(".popup-background").classList.add("active");
      document.querySelector(`${popup}`).classList.add("active");
    });
  };

  if (document.querySelector(".pop-project")) {
    handlerClosePopup(".pop-project__exit-button", ".pop-project");
  }
  if (document.querySelector(".pop-graphics")) {
    handlerClosePopup(".pop-graphics__exit-button", ".pop-graphics");
  }
  if (document.querySelector(".pop-pos")) {
    handlerClosePopup(".pop-pos__exit", ".pop-pos");
  }
  if (document.querySelector(".pop-edit")) {
    handlerClosePopup(".pop-edit__exit", ".pop-edit");
  }
  if (document.querySelector(".pop-password")) {
    handlerClosePopup(".pop-password__exit", ".pop-password");
  }
  if (document.querySelector(".pop-project-type")) {
    handlerClosePopup(".pop-project-type__exit", ".pop-project-type");
  }
  const choseProjectType = () => {
    document
      .querySelector(".pop-project__type-btn")
      .addEventListener("click", () => {
        if (document.querySelector(".project-type-web").checked) {
          document.querySelector(".popup-background").classList.add("active");
          document.querySelector(".pop-project").classList.add("active");
          document
            .querySelector(".pop-project-type")
            .classList.remove("active");
        } else {
          document.querySelector(".popup-background").classList.add("active");
          document.querySelector(".pop-pos").classList.add("active");
          document
            .querySelector(".pop-project-type")
            .classList.remove("active");
        }
      });
  };
  choseProjectType();
  if (
    document.querySelector(".pop-project") &&
    document.querySelector(".open-popup-new-poject")
  ) {
    openPopup(".open-popup-new-poject", ".pop-project-type");
  }
  if (document.querySelector(".pop-graphics")) {
    if (document.querySelector(".btn-graphics")) {
      openPopup(".btn-graphics", ".pop-graphics");
    }
  }
  if (document.querySelector(".open-graphic-solo")) {
    const openButtons = document.querySelectorAll(".open-graphic-solo");

    openButtons.forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelector(".popup-background").classList.add("active");
        document.querySelector(".pop-graphics").classList.add("active");
      });
    });
  }
  if (
    document.querySelector(".pop-pos") &&
    document.querySelector(".body-panel__create-pos")
  ) {
    openPopup(".body-panel__create-pos", ".pop-pos");
  }
  if (document.querySelector(".pop-edit")) {
    document.querySelectorAll(".item-rent__change").forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelector(".popup-background").classList.add("active");
        document.querySelector(".pop-edit").classList.add("active");
      });
    });
  }
  if (document.querySelector(".pop-password")) {
    openPopup(".action-change-pass", ".pop-password");
  }
  //Уведомления
  const successNotice = () => {
    const notice = document.querySelector(".success-notice");

    notice.classList.add("active");
    setTimeout(() => {
      notice.classList.remove("active");
    }, 3000);

    document
      .querySelector(".success-notice__exit")
      .addEventListener("click", () => {
        notice.classList.remove("active");
      });
  };
  const errorNotice = () => {
    const notice = document.querySelector(".error-notice");

    notice.classList.add("active");
    setTimeout(() => {
      notice.classList.remove("active");
    }, 3000);

    document
      .querySelector(".error-notice__exit")
      .addEventListener("click", () => {
        notice.classList.remove("active");
      });
  };

  //Выбор поисковой системы в popup "pop-pos"
  const searchPopChose = () => {
    const allButtons = document.querySelectorAll(".search-system__item");

    allButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        allButtons.forEach((el) => {
          el.classList.remove("active");
        });
        e.target.closest(".search-system__item").classList.add("active");
      });
    });
  };
  searchPopChose();

  //Переход по quiz
  // const quiz = () => {
  //   const allQuizes = document.querySelectorAll(".pop-pos__quiz");
  //
  //   allQuizes.forEach((el) => {
  //     el.querySelector("[data-quiz]").addEventListener("click", () => {
  //       //Данные для валидации
  //       let error;
  //       const thisQuiz = el
  //         .querySelector("[data-quiz]")
  //         .dataset.quiz.split(" ")[0];
  //       const thisQuizElement = document.querySelector(`.${thisQuiz}`);
  //
  //       //Валидация перехода
  //       switch (true) {
  //         case thisQuizElement.classList.contains("pop-pos__quiz-1"):
  //           error = false;
  //           const input1 = thisQuizElement.querySelector(
  //             ".pop-pos__quiz-1-name"
  //           );
  //           const input2 = thisQuizElement.querySelector(
  //             ".pop-pos__quiz-1-domain"
  //           );
  //
  //           if (input1.value.length <= 0) {
  //             input1.classList.add("input-error");
  //             input1.nextElementSibling.classList.add("active");
  //             error = true;
  //           } else {
  //             input1.classList.remove("input-error");
  //             input1.nextElementSibling.classList.remove("active");
  //           }
  //           if (input2.value.length <= 0) {
  //             input2.classList.add("input-error");
  //             input2.nextElementSibling.classList.add("active");
  //             error = true;
  //           } else {
  //             input2.classList.remove("input-error");
  //             input2.nextElementSibling.classList.remove("active");
  //           }
  //           if (error === true) return;
  //           break;
  //         case thisQuizElement.classList.contains("pop-pos__quiz-2"):
  //           error = false;
  //           const input3 = thisQuizElement.querySelector(
  //             ".pop-pos__quiz-2-requests"
  //           );
  //
  //           if (input3.value.length <= 0) {
  //             input3.classList.add("input-error");
  //             input3.nextElementSibling.classList.add("active");
  //             error = true;
  //           } else {
  //             input3.classList.remove("input-error");
  //             input3.nextElementSibling.classList.remove("active");
  //           }
  //           if (error === true) return;
  //           break;
  //         case thisQuizElement.classList.contains("pop-pos__quiz-3"):
  //           // error = false;
  //           // const input4 = thisQuizElement.querySelector(
  //           //   ".pop-pos__quiz-3-requests"
  //           // );
  //
  //           // if (input4.value.length <= 0) {
  //           //   input4.classList.add("input-error");
  //           //   input4.nextElementSibling.classList.add("active");
  //           //   error = true;
  //           // } else {
  //           //   input4.classList.remove("input-error");
  //           //   input4.nextElementSibling.classList.remove("active");
  //           // }
  //           // if (error === true) return;
  //           break;
  //         case thisQuizElement.classList.contains("pop-pos__quiz-4"):
  //           error = false;
  //           const region = thisQuizElement.querySelector(".region");
  //
  //           if (!region) {
  //             document
  //               .querySelector(".regions")
  //               .nextElementSibling.classList.add("active");
  //             error = true;
  //           } else {
  //             document
  //               .querySelector(".regions")
  //               .nextElementSibling.classList.remove("active");
  //           }
  //           if (error === true) return;
  //           break;
  //         case thisQuizElement.classList.contains("pop-pos__quiz-5"):
  //           error = false;
  //           const input5 = thisQuizElement.querySelector(".time-btn");
  //
  //           if (
  //             input5.textContent.replace(/\s+/g, "") == "Выберитечастотусбора"
  //           ) {
  //             input5.nextElementSibling.classList.add("active");
  //             error = true;
  //           } else {
  //             input5.nextElementSibling.classList.remove("active");
  //           }
  //
  //           if (input5.textContent.replace(/\s+/g, "") == "Еженедельно") {
  //             error = true;
  //             document
  //               .querySelector(".time-type-weekly")
  //               .querySelectorAll(".time-type__dates-item")
  //               .forEach((el) => {
  //                 if (el.classList.contains("active")) {
  //                   error = false;
  //                 }
  //               });
  //
  //             if (error === true) {
  //               document
  //                 .querySelector(".input-title__error-2")
  //                 .classList.add("active");
  //             } else {
  //               document
  //                 .querySelector(".input-title__error-2")
  //                 .classList.remove("active");
  //             }
  //           }
  //
  //           if (
  //             input5.textContent.replace(/\s+/g, "") == "Вопределенныеднинедели"
  //           ) {
  //             error = true;
  //             document
  //               .querySelector(".time-type-certain")
  //               .querySelectorAll(".time-type__dates-item")
  //               .forEach((el) => {
  //                 if (el.classList.contains("active")) {
  //                   error = false;
  //                 }
  //               });
  //
  //             if (error === true) {
  //               document
  //                 .querySelector(".input-title__error-3")
  //                 .classList.add("active");
  //             } else {
  //               document
  //                 .querySelector(".input-title__error-3")
  //                 .classList.remove("active");
  //             }
  //           }
  //
  //           if (
  //             input5.textContent.replace(/\s+/g, "") == "Вопределенныеднимесяца"
  //           ) {
  //             error = true;
  //             document
  //               .querySelector(".time-type-month")
  //               .querySelectorAll(".time-type__day")
  //               .forEach((el) => {
  //                 if (el.classList.contains("active")) {
  //                   error = false;
  //                 }
  //               });
  //
  //             if (error === true) {
  //               console.log(document.querySelector(".input-title__error-3"));
  //               document
  //                 .querySelector(".input-title__error-4")
  //                 .classList.add("active");
  //             } else {
  //               document
  //                 .querySelector(".input-title__error-4")
  //                 .classList.remove("active");
  //             }
  //           }
  //           if (error === true) return;
  //           break;
  //       }
  //
  //       //Переход вперед
  //       allQuizes.forEach((quiz) => {
  //         quiz.classList.add("pop-pos--hidden");
  //       });
  //       const nextQuiz = el
  //         .querySelector("[data-quiz]")
  //         .dataset.quiz.split(" ")[1];
  //       document
  //         .querySelector(`.${nextQuiz}`)
  //         .classList.remove("pop-pos--hidden");
  //     });
  //
  //     //Переход назад
  //     if (!el.querySelector("[data-quizback]")) return;
  //     el.querySelector("[data-quizback]").addEventListener(
  //       "click",
  //       (button) => {
  //         allQuizes.forEach((quiz) => {
  //           quiz.classList.add("pop-pos--hidden");
  //         });
  //         const nextQuiz = button.target.dataset.quizback;
  //         document
  //           .querySelector(`.${nextQuiz}`)
  //           .classList.remove("pop-pos--hidden");
  //       }
  //     );
  //   });
  // };
  // quiz();

  //Создать Регион в quiz
  // const createRegion = () => {
  //   const container = document.querySelector(".regions__body");
  //   const addButton = document.querySelector(".regions__add");
  //
  //   addButton.addEventListener("click", () => {
  //     //Выбор браузера
  //     const browserGoogle = document
  //       .querySelector(".search-system__google")
  //       .classList.contains("active");
  //     let browserInner;
  //     if (browserGoogle) {
  //       browserInner = `
  //           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  //             <path d="M18.1549 10.1874C18.1549 9.63883 18.1064 9.118 18.023 8.61108H10.1758V11.743H14.6689C14.4674 12.7708 13.8772 13.6388 13.0022 14.2291V16.3124H15.6827C17.2522 14.8611 18.1549 12.7222 18.1549 10.1874Z" fill="#4285F4"></path>
  //             <path d="M10.1758 18.3334C12.4258 18.3334 14.3077 17.5834 15.6827 16.3126L13.0022 14.2292C12.2522 14.7292 11.3008 15.0348 10.1758 15.0348C8.00217 15.0348 6.1619 13.5695 5.50217 11.5903H2.73828V13.7362C4.10634 16.4584 6.91884 18.3334 10.1758 18.3334Z" fill="#34A853"></path>
  //             <path d="M5.50347 11.5903C5.32987 11.0903 5.23958 10.5556 5.23958 10.0001C5.23958 9.44448 5.33681 8.90973 5.50347 8.40973V6.26392H2.73958C2.17014 7.38892 1.84375 8.65282 1.84375 10.0001C1.84375 11.3472 2.17014 12.6111 2.73958 13.7361L5.50347 11.5903Z" fill="#FBBC05"></path>
  //             <path d="M10.1758 4.96536C11.405 4.96536 12.5022 5.38897 13.3702 6.21536L15.7452 3.84036C14.3077 2.49314 12.4258 1.66675 10.1758 1.66675C6.91884 1.66675 4.10634 3.54175 2.73828 6.26397L5.50217 8.40983C6.1619 6.43064 8.00217 4.96536 10.1758 4.96536Z" fill="#EA4335"></path>
  //           </svg>
  //         `;
  //     } else {
  //       browserInner = `
  //           <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  //             <path d="M15.5415 18.3334H12.6295V3.9195H11.329C8.94812 3.9195 7.7027 5.10997 7.7027 6.88653C7.7027 8.90116 8.56354 9.83525 10.34 11.0257L11.8053 12.0147L7.59281 18.3334H4.46094L8.25215 12.6924C6.07266 11.1356 4.84555 9.6155 4.84555 7.05137C4.84555 3.84623 7.07999 1.66675 11.3108 1.66675H15.5232V18.3334H15.5415Z" fill="#FC3F1D"></path>
  //           </svg>
  //         `;
  //     }
  //
  //     const region = `
  //     <div class="region">
  //       <div class="region__browser">
  //               ${browserInner}
  //        </div>
  //        <div class="search-folders regions-menu">
  //          <div class="select-btn regions-btn btn-reset" style="border-color: rgb(0, 118, 245);">
  //            <span>Москва (Россия)</span>
  //            <svg class="project__btn-icon" width="16" height="16">
  //              <use href="./img/svg/sprite.svg#arrow_dropdown"></use>
  //            </svg>
  //          </div>
  //          <div class="search__dropdown-wrapper">
  //            <div class="input-wrap">
  //              <input id="input-search" type="text" class="input input--icon" placeholder="Введите название региона">
  //              <label class="input-wrap-icon" for="input-search"></label>
  //             </div>
  //            <div class="project__dropdown">
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Москва <span class="region__coutry">(Россия)</span></span>
  //                </div>
  //              </div>
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Санкт-Петербург <span class="region__coutry">(Россия)</span></span>
  //                </div>
  //              </div>
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Новосибирск <span class="region__coutry">(Россия)</span></span>
  //                </div>
  //              </div>
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Минск <span class="region__coutry">(Беларусь)</span></span>
  //                </div>
  //              </div>
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Гомель <span class="region__coutry">(Беларусь)</span></span>
  //                </div>
  //              </div>
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Проект 6</span>
  //                </div>
  //              </div>
  //              <div class="folder" data-visible="false">
  //                <div class="folder__btn btn-reset">
  //                  <span>Проект 7</span>
  //                </div>
  //              </div>
  //            </div>
  //          </div>
  //        </div>
  //        <div class="region__device">
  //          <div class="region__device-btn">
  //            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //              <mask id="mask0_2049_26958" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
  //                <rect width="24" height="24" fill="#D9D9D9"></rect>
  //              </mask>
  //              <g mask="url(#mask0_2049_26958)">
  //                <path d="M4.91662 16.0667V16.1667H5.01662H18.9803H19.0803V16.0667V6.53338V6.43338H18.9803H5.01662H4.91662V6.53338V16.0667ZM2.49844 20.3V18.7667H21.4984V20.3H2.49844ZM5.01662 17.7C4.56313 17.7 4.17752 17.5408 3.85436 17.2199C3.53122 16.899 3.37116 16.5164 3.37116 16.0667V6.53338C3.37116 6.08367 3.53122 5.70107 3.85436 5.38017C4.17752 5.05926 4.56313 4.90005 5.01662 4.90005H18.9803C19.4338 4.90005 19.8194 5.05926 20.1425 5.38017C20.4657 5.70107 20.6257 6.08367 20.6257 6.53338V16.0667C20.6257 16.5164 20.4657 16.899 20.1425 17.2199C19.8194 17.5408 19.4338 17.7 18.9803 17.7H5.01662Z" fill="#0076F5" stroke="white" stroke-width="0.2"></path>
  //              </g>
  //            </svg>
  //            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  //              <path d="M10.5714 6C10.651 6 10.729 6.02069 10.7967 6.05974C10.8644 6.09879 10.9192 6.15467 10.9548 6.22111C10.9903 6.28756 11.0054 6.36194 10.9983 6.43592C10.9911 6.50991 10.962 6.58057 10.9143 6.64L8.34286 9.84C8.30294 9.88968 8.25117 9.93 8.19166 9.95777C8.13215 9.98554 8.06653 10 8 10C7.93347 10 7.86785 9.98554 7.80834 9.95777C7.74883 9.93 7.69706 9.88968 7.65714 9.84L5.08572 6.64C5.03796 6.58057 5.00888 6.50991 5.00173 6.43592C4.99458 6.36194 5.00965 6.28756 5.04525 6.22112C5.08084 6.15467 5.13555 6.09879 5.20326 6.05974C5.27096 6.02069 5.34898 6 5.42857 6L10.5714 6Z" fill="#0076F5"></path>
  //            </svg>
  //          </div>
  //          <div class="project__dropdown-wrapper">
  //            <div class="body-panel__google-item active">
  //              <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                <path d="M2.08182 9.38889V9.48889H2.18182H13.8182H13.9182V9.38889V1.44444V1.34444H13.8182H2.18182H2.08182V1.44444V9.38889ZM0.1 12.9V11.6556H15.9V12.9H0.1ZM2.18182 10.7333C1.80833 10.7333 1.4912 10.6024 1.22501 10.3381C0.95884 10.0738 0.827273 9.75915 0.827273 9.38889V1.44444C0.827273 1.07418 0.95884 0.759584 1.22501 0.495262C1.4912 0.23092 1.80833 0.1 2.18182 0.1H13.8182C14.1917 0.1 14.5088 0.23092 14.775 0.495262C15.0412 0.759584 15.1727 1.07418 15.1727 1.44444V9.38889C15.1727 9.75915 15.0412 10.0738 14.775 10.3381C14.5088 10.6024 14.1917 10.7333 13.8182 10.7333H2.18182Z" fill="#404040" stroke="#F7F7F7" stroke-width="0.2"></path>
  //              </svg>
  //              <span>Компьютер</span>
  //            </div>
  //            <div class="body-panel__google-item">
  //              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                <path d="M2.7 2.16667V1.96667H2.5H1.66667H1.46667V2.16667V12.1667V12.3667H1.66667H2.5H2.7V12.1667V2.16667ZM3.96667 12.1667V12.3667H4.16667H14.1667H14.3667V12.1667V2.16667V1.96667H14.1667H4.16667H3.96667V2.16667V12.1667ZM15.8333 1.96667H15.6333V2.16667V12.1667V12.3667H15.8333H16.6667H16.8667V12.1667V2.16667V1.96667H16.6667H15.8333ZM1.66667 13.6333C1.2618 13.6333 0.920186 13.4915 0.631005 13.2023C0.341824 12.9131 0.2 12.5715 0.2 12.1667V2.16667C0.2 1.7618 0.341824 1.42019 0.631005 1.131C0.920186 0.841824 1.2618 0.7 1.66667 0.7H16.6667C17.0715 0.7 17.4131 0.841824 17.7023 1.131C17.9915 1.42019 18.1333 1.7618 18.1333 2.16667V12.1667C18.1333 12.5715 17.9915 12.9131 17.7023 13.2023C17.4131 13.4915 17.0715 13.6333 16.6667 13.6333H1.66667Z" fill="#404040" stroke="white" stroke-width="0.4"></path>
  //                <path d="M12.8584 13.5819H12.7584V13.6819V14.288V14.388H12.8584H18.8108H18.9108V14.288V13.6819V13.5819H18.8108H12.8584ZM12.7584 12.4698V12.5698H12.8584H18.8108H18.9108V12.4698V5.19705V5.09705H18.8108H12.8584H12.7584V5.19705V12.4698ZM12.7584 3.98493V4.08493H12.8584H18.8108H18.9108V3.98493V3.37887V3.27887H18.8108H12.8584H12.7584V3.37887V3.98493ZM12.8584 15.4001C12.5584 15.4001 12.3037 15.2925 12.089 15.074C11.8743 14.8553 11.768 14.5951 11.768 14.288V3.37887C11.768 3.07169 11.8743 2.81151 12.089 2.59288C12.3037 2.3743 12.5584 2.26675 12.8584 2.26675H18.8108C19.1109 2.26675 19.3656 2.3743 19.5803 2.59288C19.795 2.81151 19.9013 3.07169 19.9013 3.37887V14.288C19.9013 14.5951 19.795 14.8553 19.5803 15.0739C19.3656 15.2925 19.1109 15.4001 18.8108 15.4001H12.8584Z" fill="#404040" stroke="white" stroke-width="0.2"></path>
  //                </svg>
  //              <span>Планшет и смартфон (любая ОС)</span>
  //            </div>
  //            <div class="body-panel__google-item">
  //              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                <path d="M10.3101 16.6566L10.3116 16.6566C11.0647 16.6605 11.5406 16.842 11.9547 17.018C11.9848 17.0308 12.0144 17.0435 12.0437 17.056C12.4148 17.2149 12.7303 17.3499 13.1868 17.3499H13.2113C13.4948 17.3499 13.8334 17.2357 14.2049 17.012C14.5746 16.7896 14.9662 16.4652 15.3526 16.0613C16.0987 15.2814 16.8148 14.2161 17.3089 13.0492C16.2382 12.4601 15.5043 11.3222 15.5043 9.99992C15.5043 8.71415 16.1992 7.60319 17.2219 7.00075C16.3309 5.43604 14.8267 4.74465 13.7256 4.74465C13.1159 4.74465 12.5516 4.95072 11.9889 5.16831C11.9593 5.17975 11.9297 5.19124 11.9 5.20275C11.3769 5.40568 10.8447 5.61216 10.3109 5.61216C9.77702 5.61216 9.2448 5.40568 8.72173 5.20275C8.69207 5.19124 8.66245 5.17975 8.63285 5.16831C8.07019 4.95073 7.5059 4.74466 6.89623 4.74465L10.3101 16.6566ZM10.3101 16.6566C9.55708 16.6605 9.08136 16.842 8.66734 17.018C8.63734 17.0308 8.60779 17.0434 8.57857 17.0559C8.20746 17.2148 7.89192 17.3499 7.4349 17.3499H7.41048C7.01708 17.3499 6.52144 17.1304 5.98755 16.7176C5.4581 16.3082 4.90948 15.723 4.41305 15.0259C3.41853 13.6293 2.65 11.8074 2.65 10.0927C2.65 6.31469 5.23567 4.74548 6.89616 4.74465L10.3101 16.6566ZM6.89616 6.11131H6.89602C5.91741 6.11223 4.01667 7.12168 4.01667 10.0927C4.01667 11.5197 4.64609 12.9335 5.37106 14.01C5.73445 14.5496 6.12503 15.0093 6.47935 15.3483C6.65647 15.5178 6.82618 15.6587 6.98046 15.7647C7.13245 15.8691 7.27857 15.946 7.40755 15.9774L7.42727 15.9822L7.44755 15.9816C7.61899 15.9764 7.74205 15.9283 8.03616 15.8018C8.51177 15.5974 9.21488 15.2957 10.3011 15.2899C11.4051 15.2957 12.1105 15.5976 12.5856 15.8018L12.5857 15.8018C12.8912 15.933 13.0114 15.9811 13.1735 15.9832L13.1931 15.9835L13.2122 15.9787C13.334 15.9479 13.4868 15.8635 13.6523 15.7456C13.8216 15.625 14.0164 15.4604 14.2237 15.2558C14.6384 14.8467 15.1084 14.2726 15.5281 13.559L15.5861 13.4603L15.5062 13.3783C14.6408 12.4903 14.1393 11.2914 14.1393 9.99992C14.1393 8.85768 14.5388 7.77814 15.2395 6.92626L15.3362 6.80881L15.2174 6.71382C14.6874 6.29003 14.1129 6.11131 13.7256 6.11131C13.5239 6.11131 13.3071 6.15882 13.0878 6.22583C12.8682 6.29295 12.6361 6.38286 12.4042 6.47273L12.4035 6.47301L12.4035 6.47302C11.7776 6.71567 11.0956 6.97882 10.3109 6.97882C9.5262 6.97882 8.84594 6.71573 8.22002 6.47306C7.98726 6.38261 7.75458 6.29258 7.53433 6.22548C7.31469 6.15856 7.09779 6.11131 6.89616 6.11131ZM10.1439 4.24669C10.1808 3.45158 10.496 2.51979 10.9796 1.99103C11.5231 1.40125 12.3313 1.02689 13.1817 0.986828C13.1615 1.89568 12.9575 2.57613 12.4762 3.13411C11.9554 3.73499 11.0314 4.19785 10.1439 4.24669Z" fill="#404040" stroke="white" stroke-width="0.3"></path>
  //              </svg>
  //              <span>Планшет и смартфон (iOS)</span>
  //            </div>
  //            <div class="body-panel__google-item">
  //              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  //                <path d="M14.2345 7.64953L13.9827 8.0848L14.4194 8.33415C16.7011 9.63692 18.2395 11.9175 18.6091 14.4999H1.39217C1.76179 11.9175 3.30021 9.63692 5.5819 8.33415L6.01861 8.0848L5.76676 7.64953L4.24275 5.01565C4.2403 5.00884 4.24015 5.00208 4.24179 4.99577C4.24279 4.99197 4.24433 4.98887 4.24605 4.98645C4.24703 4.98509 4.24833 4.98355 4.25024 4.9819C4.25302 4.98097 4.2579 4.98022 4.26559 4.98199C4.27478 4.98411 4.28208 4.98863 4.28729 4.99445L5.84318 7.67588L6.06444 8.0572L6.47047 7.88542C8.72927 6.92978 11.272 6.92978 13.5308 7.88542L13.9369 8.0572L14.1581 7.67588L15.7158 4.9914C15.7175 4.98937 15.7191 4.98802 15.7205 4.98701C15.7229 4.98528 15.726 4.98374 15.7298 4.98275C15.7364 4.98103 15.7435 4.98127 15.7507 4.98408C15.7531 4.98594 15.7562 4.98953 15.7583 4.99649C15.7605 5.00348 15.7604 5.00995 15.7583 5.01611L14.2345 7.64953ZM4.29232 11.6666C4.29232 12.5177 4.98284 13.2083 5.83398 13.2083C6.68513 13.2083 7.37565 12.5177 7.37565 11.6666C7.37565 10.8155 6.68513 10.1249 5.83398 10.1249C4.98284 10.1249 4.29232 10.8155 4.29232 11.6666ZM12.6256 11.6666C12.6256 12.5177 13.3162 13.2083 14.1673 13.2083C15.0185 13.2083 15.709 12.5177 15.709 11.6666C15.709 10.8155 15.0185 10.1249 14.1673 10.1249C13.3162 10.1249 12.6256 10.8155 12.6256 11.6666Z" stroke="#404040"></path>
  //              </svg>
  //              <span>Планшет и смартфон (Android)</span>
  //            </div>
  //          </div>
  //        </div>
  //        <div class="region__delete">
  //          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //            <mask id="mask0_2049_10699" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
  //              <rect width="24" height="24" fill="#D9D9D9"></rect>
  //            </mask>
  //            <g mask="url(#mask0_2049_10699)">
  //              <path d="M5.975 6.66667V6.56667H5.875H5.1V4.98889H9.375H9.475V4.88889V4.1H14.525V4.88889V4.98889H14.625H18.9V6.56667H18.125H18.025V6.66667V18.2222C18.025 18.6849 17.864 19.0782 17.5397 19.4076C17.2154 19.737 16.829 19.9 16.375 19.9H7.625C7.171 19.9 6.78456 19.737 6.46033 19.4076C6.13605 19.0782 5.975 18.6849 5.975 18.2222V6.66667ZM16.475 6.66667V6.56667H16.375H7.625H7.525V6.66667V18.2222V18.3222H7.625H16.375H16.475V18.2222V6.66667ZM11.025 8.54444V16.3444H9.475V8.54444H11.025ZM14.525 8.54444V16.3444H12.975V8.54444H14.525Z" fill="#E50C00" stroke="#FFE7E6" stroke-width="0.2"></path>
  //            </g>
  //          </svg>
  //        </div>
  //      </div>
  //     `;
  //
  //     //Создание региона
  //     container.innerHTML += region;
  //     //Обновление событий для регионов
  //     deleteRegion();
  //     popRegions();
  //     deviceRegion();
  //   });
  // };
  //Удалить регион в  quiz
  //Удалить все регионы в  quiz


  //Ограничение набора символов в timeInput
  const timeInput = document.querySelectorAll(".timeInput");
  if (timeInput) {
    timeInput.forEach((input) => {
      input.addEventListener("input", function (e) {
        let value = input.value.replace(/\D/g, ""); // Убираем все, кроме цифр

        // Если удалили символы, удаляем двоеточие и возвращаем курсор на правильное место
        if (e.inputType === "deleteContentBackward" && value.length <= 2) {
          input.value = value;
        } else {
          if (value.length >= 2) {
            value = value.slice(0, 2) + ":" + value.slice(2, 4); // Добавляем ":"
          }
          input.value = value.slice(0, 5); // Ограничиваем длину до 5 символов
        }
      });
    });
  }

  const choseOneDate = () => {
    const items = document.querySelector(".chose-one-date");
    const resetButton = items
      .closest(".time-type__dates")
      .querySelector(".time-type__dates-reset");

    items.addEventListener("click", (date) => {
      if (date.target.classList.contains("time-type__dates-item")) {
        items.querySelectorAll(".time-type__dates-item").forEach((el) => {
          el.classList.remove("active");
        });
        date.target.classList.add("active");
      }
    });
    resetButton.addEventListener("click", () => {
      items.querySelectorAll(".time-type__dates-item").forEach((el) => {
        el.classList.remove("active");
      });
    });
  };
  const choseMoreDate = () => {
    const items = document.querySelector(".chose-more-date");
    const resetButton = items
      .closest(".time-type__dates")
      .querySelector(".time-type__dates-reset");

    items.addEventListener("click", (date) => {
      if (date.target.classList.contains("time-type__dates-item")) {
        date.target.classList.toggle("active");
      }
    });
    resetButton.addEventListener("click", () => {
      items.querySelectorAll(".time-type__dates-item").forEach((el) => {
        el.classList.remove("active");
      });
    });
  };
  const choseMoreMonth = () => {
    const items = document.querySelector(".chose-more-month");
    const resetButton = items
      .closest(".time-type__dates")
      .querySelector(".time-type__dates-reset");

    items.addEventListener("click", (date) => {
      if (date.target.classList.contains("time-type__day")) {
        date.target.classList.toggle("active");
      }
    });
    resetButton.addEventListener("click", () => {
      items.querySelectorAll(".time-type__day").forEach((el) => {
        el.classList.remove("active");
      });
    });
  };

  if (document.querySelector(".pop-pos")) {
    // createRegion();
    deleteRegion();
    deleteAllRegions();

    choseOneDate();
    choseMoreDate();
    choseMoreMonth();
  }
  //------------------------------------- POSITIONS
  //-------- Функционал выбора позиций для их удаления
  let itemPosActiveCount = 0;
  //Чекбоксы отдельных позиций
  const itemsEvent = () => {
    const allItems = document.querySelectorAll(".item-pos");
    const button = document.querySelector(".all-positions");

    allItems.forEach((el) => {
      const input = el.querySelector("input");
      input.addEventListener("click", () => {
        input.checked ? itemPosActiveCount++ : itemPosActiveCount--;
        button.checked = false;
        positionsState(deleteButton, deleteCount, wrap);
      });
    });
  };
  //Общий чекбокс
  const choseAllPositions = () => {
    const allItems = document.querySelectorAll(".item-pos");
    const button = document.querySelector(".all-positions");

    button.addEventListener("click", (e) => {
      allItems.forEach((el) => {
        const input = el.querySelector("input");
        input.checked = button.checked;
        button.checked
          ? (itemPosActiveCount = allItems.length)
          : (itemPosActiveCount = 0);

        positionsState(deleteButton, deleteCount, wrap);
      });
    });
  };
  const deleteButton = document.querySelector(".pos-pag__delete");
  const deleteCount = document.querySelector(".pos-pag__delete-count");
  const wrap = document.querySelector(".pos-pag__wrap");
  const positionsState = (deleteButton, deleteCount, wrap) => {
    itemPosActiveCount > 0
      ? (deleteButton.style.display = "flex")
      : (deleteButton.style.display = "none");

    itemPosActiveCount > 0
      ? (wrap.style.justifyContent = "flex-end")
      : (wrap.style.justifyContent = "space-between");
    deleteCount.textContent = itemPosActiveCount;
  };
  choseAllPositions();
  itemsEvent();
  // Функционал выбора позиций для их удаления --------

  //Сокращенный вид
  const shortPositions = () => {
    if (!document.querySelector(".settings__cut")) return;

    const checkbox = document
      .querySelector(".settings__cut")
      .querySelector("input");
    const positions = document.querySelector(".positions");
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        return positions.classList.add("positions--short");
      }
      return positions.classList.remove("positions--short");
    });
  };
  shortPositions();

  //Кнопка удаления сортировок позиций в датах
  if (document.querySelector(".body-panel__reset-sort")) {
    document
      .querySelector(".body-panel__reset-sort")
      .addEventListener("click", (el) => {
        el.target.classList.remove("active");

        const allSorted = document.querySelectorAll(".active--sort");

        allSorted.forEach((el) => {
          el.classList.remove("active--sort");
          el.dataset.sort = "";
        });
      });
  }

  //Показать меню сортировки у дат
  document.querySelector(".header-pos")?.addEventListener("click", (event) => {
    const item = event.target.closest(".header-pos__date");
    const dropItemCliked = event.target.classList.contains("pos-pag__variable");
    const dropClicked = event.target.classList.contains(
      "project__dropdown-wrapper"
    );

    //Клик по дате
    if (item && !dropClicked) {
      const countPages = () => {
        const t = item;
        var e = t.querySelector(".header-pos__date-button");
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
      };
      countPages();
    }
    if (dropItemCliked) {
      const reserSort = document.querySelector(".body-panel__reset-sort");

      item.classList.add("active--sort");
      item.dataset.sort = event.target.textContent;
      reserSort.classList.add("active");
    }
  });

  //Показать вычисленные суммы
  const summButton = document.querySelector(".settings__summ");
  if (summButton) {
    summButton.addEventListener("click", (e) => {
      const sumBody = document.querySelector(".positions__total");

      if (!sumBody) return;
      if (summButton.querySelector("input").checked) {
        sumBody.classList.add("active");
      } else {
        sumBody.classList.remove("active");
      }
    });
  }

  //Показать/Скрыть график
  const graphicButton = document.querySelector(".settings__graphic");
  const sumBody = document.querySelector(".myChart-wrap");
  const closeButton = document.querySelector(".body-panel__graphic-close");
  if (graphicButton) {
    graphicButton.addEventListener("click", (e) => {
      if (graphicButton.querySelector("input").checked) {
        sumBody.classList.add("active");
        if (closeButton) {
          closeButton.classList.add("active");
        }
      } else {
        sumBody.classList.remove("active");
        closeButton.classList.remove("active");
      }

      //Кнопка на отдельной таблице живой выдачи
      if (document.querySelector(".body-panel__graph")) {
        if (graphicButton.querySelector("input").checked) {
          document.querySelector(".body-panel__graph").classList.add("active");
        } else {
          document
            .querySelector(".body-panel__graph")
            .classList.remove("active");
        }
      }
    });
  }

  //Скопировать текст по клику
  const copyText = (element) => {
    const text = element
      .closest(".item-pos__base")
      .querySelector(".copied-text").textContent;

    navigator.clipboard
      .writeText(text)
      .then(() => alert(`Текст скопирован: ${text}`))
      .catch((err) => console.error("Ошибка копирования: ", err));
  };
  const allURLs = document.querySelectorAll(".copy-item");
  allURLs.forEach((el) => {
    el.addEventListener("click", () => copyText(el));
  });

  //Активация графика при вычисленных суммах
  if (document.querySelector(".settings__summ")) {
    document
      .querySelector(".settings__summ")
      .querySelector("input")
      .addEventListener("change", (el) => {
        if (el.target.checked)
          document.getElementById("checkbox-graphic").disabled = false;

        if (document.querySelector(".body-panel__graph")) {
          document.querySelector(".body-panel__graph").style.display = "block";
        }
      });
    //Кнопка на отдельной таблице живой выдачи для активации графика
    if (document.querySelector(".body-panel__graph")) {
      const graphChose = document.querySelector(".body-panel__graph");
      graphChose.addEventListener("click", (el) => {
        if (graphChose.classList.contains("active")) {
          graphChose.classList.remove("active");
          document.querySelector(".myChart-wrap").classList.remove("active");
        } else {
          graphChose.classList.add("active");
          document.getElementById("checkbox-graphic").disabled = false;
          document.querySelector(".myChart-wrap").classList.add("active");
        }
      });
    }
  }

  //Скрыть график
  if (document.querySelector(".body-panel__graphic-close")) {
    document
      .querySelector(".body-panel__graphic-close")
      .addEventListener("click", () => {
        sumBody.classList.remove("active");
        closeButton.classList.remove("active");
        graphicButton.querySelector("input").checked = false;
      });
  }

  //POSITIONS -------------------------------------

  document.querySelector(".burger").addEventListener("click", (el) => {
    document.querySelector(".content").style.width = "calc(100% - 318px)";
    document.querySelector(".content").style.marginLeft = "318px";
    document.querySelector(".header").style.width = "calc(100% - 318px)";
  });
  // document.querySelector(".cl").addEventListener("click", (el) => {
  //   document.querySelector(".content").style.width = "calc(100% - 76px)";
  //   document.querySelector(".content").style.marginLeft = "72px";
  //   document.querySelector(".header").style.width = "calc(100% - 72px)";
  // });
});
