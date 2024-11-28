document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("datepicker");
  const flatpickrInstance = flatpickr("#datepicker", {
    mode: "range",
    dateFormat: "d.m.Y",
    locale: "ru",
    showMonths: 3,
    appendTo: document.getElementById("flatpickr-custom-container"),
    prevArrow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#747474" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_598_861" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
<rect width="20" height="20" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_598_861)">
<path d="M16.287 5.41998L9.7585 11.8935L9.65108 12L9.7585 12.1065L16.287 18.58L15.0679 19.7887L7.21303 12L15.0679 4.21123L16.287 5.41998Z" fill="#747474" stroke="white" stroke-width="0.3"/>
</g>
</svg>

`,
    nextArrow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#747474" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_598_865" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
<rect width="20" height="20" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_598_865)">
<path d="M7.21303 5.41998L13.7415 11.8935L13.8489 12L13.7415 12.1065L7.21304 18.58L8.43206 19.7887L16.287 12L8.43206 4.21123L7.21303 5.41998Z" fill="#747474" stroke="white" stroke-width="0.3"/>
</g>
</svg>

`,
    clickOpens: true,
    closeOnSelect: false,
    onOpen: function () {
      input.classList.add("active"); // Добавляем класс 'active' при открытии календаря
    },
    onClose: function () {
      input.classList.remove("active"); // Убираем класс 'active' при закрытии календаря
    },
    onReady: function (selectedDates, dateStr, instance) {
      rearrangeMonths(instance); // Переставляем месяцы
      addCustomDateRangeMenu(instance);
      wrapCalendarContent(instance);
      updateMonthYearHeaders(instance);
    },
    onMonthChange: function (selectedDates, dateStr, instance) {
      updateMonthYearHeaders(instance);
    },
  });

  function rearrangeMonths(instance) {
    // Устанавливаем текущий месяц вторым, предыдущий — первым, следующий — третьим
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Устанавливаем месяцы так, чтобы предыдущий месяц был первым, текущий — вторым, следующий — третьим
    instance.currentYear = currentYear;
    instance.currentMonth = currentMonth - 1; // Начинаем с предыдущего месяца

    instance.redraw();
  }

  function addCustomDateRangeMenu(instance) {
    const calendarContainer = instance.calendarContainer;

    const customMenu = document.createElement("div");
    customMenu.className = "custom-date-range-menu";

    customMenu.innerHTML = `
        <div class="separator-line"></div>
            <ul>
                <li data-range="today">Сегодня</li>
                <li data-range="yesterday">Вчера</li>
                <li data-range="last7">Последние 7 дней</li>
                <li data-range="last30">Последние 30 дней</li>
                <li data-range="last90">Последние 90 дней</li>
                <li data-range="start">От начала работы</li>
            </ul>
            <div class="separator-line2"></div>
            <div class="button-container">
                <button class="apply-button">Применить</button>
                <button class="cancel-button">Отменить</button>
            </div>
        `;

    calendarContainer.insertBefore(customMenu, calendarContainer.firstChild);

    customMenu.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", function () {
        const range = this.getAttribute("data-range");
        setRange(range);
      });
    });

    const applyButton = customMenu.querySelector(".apply-button");
    const cancelButton = customMenu.querySelector(".cancel-button");

    applyButton.addEventListener("click", function () {
      const selectedDates = flatpickrInstance.selectedDates;

      if (selectedDates.length === 0) {
        console.log("Диапазон не выбран.");
      } else if (
        selectedDates.length === 1 ||
        selectedDates[0].getTime() === selectedDates[1].getTime()
      ) {
        const singleDate = flatpickr.formatDate(selectedDates[0], "d.m.Y");
        console.log(`Выбранная дата: ${singleDate}`);
      } else if (selectedDates.length === 2) {
        const startDate = flatpickr.formatDate(selectedDates[0], "d.m.Y");
        const endDate = flatpickr.formatDate(selectedDates[1], "d.m.Y");
        console.log(`Выбранный диапазон: ${startDate} - ${endDate}`);
      }
      flatpickrInstance.close();
    });

    cancelButton.addEventListener("click", function () {
      document.querySelector("#datepicker").value = "";
      flatpickrInstance.clear();
    });
  }

  function wrapCalendarContent(instance) {
    const calendarContainer = instance.calendarContainer;

    const monthsContainer =
      calendarContainer.querySelector(".flatpickr-months");
    const innerContainer = calendarContainer.querySelector(
      ".flatpickr-innerContainer"
    );

    const wrapper = document.createElement("div");
    wrapper.className = "calendar-content-wrapper";

    wrapper.appendChild(monthsContainer);
    wrapper.appendChild(innerContainer);

    calendarContainer.appendChild(wrapper);
  }

  function setRange(range) {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case "today":
        startDate = endDate = today;
        break;
      case "yesterday":
        startDate = endDate = new Date(today.setDate(today.getDate() - 1));
        break;
      case "last7":
        startDate = new Date(today.setDate(today.getDate() - 6));
        endDate = new Date();
        break;
      case "last30":
        startDate = new Date(today.setDate(today.getDate() - 29));
        endDate = new Date();
        break;
      case "last90":
        startDate = new Date(today.setDate(today.getDate() - 89));
        endDate = new Date();
        break;
      case "start":
        startDate = new Date(2024, 0, 1);
        endDate = new Date();
        break;
      default:
        return;
    }

    flatpickrInstance.setDate([startDate, endDate], true);
  }

  function updateMonthYearHeaders(instance) {
    const monthElements =
      instance.calendarContainer.querySelectorAll(".flatpickr-month");
    monthElements.forEach((monthEl, index) => {
      const monthSelect = monthEl.querySelector(
        ".flatpickr-monthDropdown-months"
      );
      const yearInput = monthEl.querySelector(".numInputWrapper .numInput");
      if (monthSelect && yearInput) {
        monthSelect.style.display = "none";
        yearInput.style.display = "none";

        const monthYearDisplay = document.createElement("div");
        monthYearDisplay.className = "month-year-display";
        const monthName =
          monthSelect.options[monthSelect.selectedIndex].textContent;
        const year = yearInput.value;

        monthYearDisplay.textContent = `${monthName} ${year}`;
        const currentMonthContainer = monthEl.querySelector(
          ".flatpickr-current-month"
        );
        if (currentMonthContainer.querySelector(".month-year-display")) {
          currentMonthContainer.querySelector(".month-year-display").remove();
        }
        currentMonthContainer.appendChild(monthYearDisplay);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("datepicker-pop");
  const flatpickrInstance = flatpickr("#datepicker-pop", {
    mode: "range",
    dateFormat: "d.m.Y",
    locale: "ru",
    showMonths: 3,
    appendTo: document.getElementById("flatpickr-custom-container-pop"),
    prevArrow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#747474" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_598_861" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
<rect width="20" height="20" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_598_861)">
<path d="M16.287 5.41998L9.7585 11.8935L9.65108 12L9.7585 12.1065L16.287 18.58L15.0679 19.7887L7.21303 12L15.0679 4.21123L16.287 5.41998Z" fill="#747474" stroke="white" stroke-width="0.3"/>
</g>
</svg>

`,
    nextArrow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="#747474" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_598_865" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
<rect width="20" height="20" fill="#D9D9D9"/>
</mask>
<g mask="url(#mask0_598_865)">
<path d="M7.21303 5.41998L13.7415 11.8935L13.8489 12L13.7415 12.1065L7.21304 18.58L8.43206 19.7887L16.287 12L8.43206 4.21123L7.21303 5.41998Z" fill="#747474" stroke="white" stroke-width="0.3"/>
</g>
</svg>

`,
    clickOpens: true,
    closeOnSelect: false,
    onOpen: function () {
      input.classList.add("active"); // Добавляем класс 'active' при открытии календаря
    },
    onClose: function () {
      input.classList.remove("active"); // Убираем класс 'active' при закрытии календаря
    },
    onReady: function (selectedDates, dateStr, instance) {
      rearrangeMonths(instance); // Переставляем месяцы
      addCustomDateRangeMenu(instance);
      wrapCalendarContent(instance);
      updateMonthYearHeaders(instance);
    },
    onMonthChange: function (selectedDates, dateStr, instance) {
      updateMonthYearHeaders(instance);
    },
  });

  function rearrangeMonths(instance) {
    // Устанавливаем текущий месяц вторым, предыдущий — первым, следующий — третьим
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Устанавливаем месяцы так, чтобы предыдущий месяц был первым, текущий — вторым, следующий — третьим
    instance.currentYear = currentYear;
    instance.currentMonth = currentMonth - 1; // Начинаем с предыдущего месяца

    instance.redraw();
  }

  function addCustomDateRangeMenu(instance) {
    const calendarContainer = instance.calendarContainer;

    const customMenu = document.createElement("div");
    customMenu.className = "custom-date-range-menu";

    customMenu.innerHTML = `
        <div class="separator-line"></div>
            <ul>
                <li data-range="today">Сегодня</li>
                <li data-range="yesterday">Вчера</li>
                <li data-range="last7">Последние 7 дней</li>
                <li data-range="last30">Последние 30 дней</li>
                <li data-range="last90">Последние 90 дней</li>
                <li data-range="start">От начала работы</li>
            </ul>
            <div class="separator-line2"></div>
            <div class="button-container">
                <button class="apply-button">Применить</button>
                <button class="cancel-button">Отменить</button>
            </div>
        `;

    calendarContainer.insertBefore(customMenu, calendarContainer.firstChild);

    customMenu.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", function () {
        const range = this.getAttribute("data-range");
        setRange(range);
      });
    });

    const applyButton = customMenu.querySelector(".apply-button");
    const cancelButton = customMenu.querySelector(".cancel-button");

    applyButton.addEventListener("click", function () {
      const selectedDates = flatpickrInstance.selectedDates;

      if (selectedDates.length === 0) {
        console.log("Диапазон не выбран.");
      } else if (
        selectedDates.length === 1 ||
        selectedDates[0].getTime() === selectedDates[1].getTime()
      ) {
        const singleDate = flatpickr.formatDate(selectedDates[0], "d.m.Y");
        console.log(`Выбранная дата: ${singleDate}`);
      } else if (selectedDates.length === 2) {
        const startDate = flatpickr.formatDate(selectedDates[0], "d.m.Y");
        const endDate = flatpickr.formatDate(selectedDates[1], "d.m.Y");
        console.log(`Выбранный диапазон: ${startDate} - ${endDate}`);
      }
      flatpickrInstance.close();
    });

    cancelButton.addEventListener("click", function () {
      document.querySelector("#datepicker").value = "";
      flatpickrInstance.clear();
    });
  }

  function wrapCalendarContent(instance) {
    const calendarContainer = instance.calendarContainer;

    const monthsContainer =
      calendarContainer.querySelector(".flatpickr-months");
    const innerContainer = calendarContainer.querySelector(
      ".flatpickr-innerContainer"
    );

    const wrapper = document.createElement("div");
    wrapper.className = "calendar-content-wrapper";

    wrapper.appendChild(monthsContainer);
    wrapper.appendChild(innerContainer);

    calendarContainer.appendChild(wrapper);
  }

  function setRange(range) {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case "today":
        startDate = endDate = today;
        break;
      case "yesterday":
        startDate = endDate = new Date(today.setDate(today.getDate() - 1));
        break;
      case "last7":
        startDate = new Date(today.setDate(today.getDate() - 6));
        endDate = new Date();
        break;
      case "last30":
        startDate = new Date(today.setDate(today.getDate() - 29));
        endDate = new Date();
        break;
      case "last90":
        startDate = new Date(today.setDate(today.getDate() - 89));
        endDate = new Date();
        break;
      case "start":
        startDate = new Date(2024, 0, 1);
        endDate = new Date();
        break;
      default:
        return;
    }

    flatpickrInstance.setDate([startDate, endDate], true);
  }

  function updateMonthYearHeaders(instance) {
    const monthElements =
      instance.calendarContainer.querySelectorAll(".flatpickr-month");
    monthElements.forEach((monthEl, index) => {
      const monthSelect = monthEl.querySelector(
        ".flatpickr-monthDropdown-months"
      );
      const yearInput = monthEl.querySelector(".numInputWrapper .numInput");
      if (monthSelect && yearInput) {
        monthSelect.style.display = "none";
        yearInput.style.display = "none";

        const monthYearDisplay = document.createElement("div");
        monthYearDisplay.className = "month-year-display";
        const monthName =
          monthSelect.options[monthSelect.selectedIndex].textContent;
        const year = yearInput.value;

        monthYearDisplay.textContent = `${monthName} ${year}`;
        const currentMonthContainer = monthEl.querySelector(
          ".flatpickr-current-month"
        );
        if (currentMonthContainer.querySelector(".month-year-display")) {
          currentMonthContainer.querySelector(".month-year-display").remove();
        }
        currentMonthContainer.appendChild(monthYearDisplay);
      }
    });
  }
});
