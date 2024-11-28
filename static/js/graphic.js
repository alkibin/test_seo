const image = new Image();
const iconActive = "./img/svg/glass2.svg";
const iconInActive = "./img/svg/glass.svg";
const icon = new Image();
icon.src = iconActive;
const icon2 = new Image();
icon2.src = iconInActive;
const ctx = document.getElementById("myChart");
const ctx_pop = document.getElementById("myChart-pop");
dates = [
  "2024-10-17",
  "2024-10-16",
  "2024-10-15",
  "2024-10-14",
  "2024-10-13",
  "2024-10-12",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-11",
  "2024-10-222",
];
allDatasets = [
  {
    label: "Топ-3 запросов",
    data: [
      5, 5, 5, 5, 5, 5, 5, 60, 70, 80, 80, 80, 80, 60, 70, 80, 80, 80, 80, 60,
      70, 80, 80, 80, 80, 60, 70, 80, 80, 80, 80,
    ],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Топ-5 запросов",
    data: [5, 5, 5, 5, 5, 5, 5],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Топ-10 запросов",
    data: [5, 5, 5, 5, 5, 5, 5],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Топ-50 запросов",
    data: [
      40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
      40,

      40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,
      40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 133,
    ],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(153, 102, 255)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(153, 102, 255)",
  },
  {
    label: "Клики",
    data: [
      50, 60, 70, 80, 80, 80, 80, 60, 70, 80, 80, 80, 80, 60, 70, 80, 80, 80,
      80, 60, 70, 80, 80, 80, 80, 60, 70, 80, 80, 80, 80, 60, 70, 80, 80, 80,
      80, 60, 70, 80, 80, 80, 80, 60, 70, 80, 80, 80, 80,
    ],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(75, 192, 192)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(75, 192, 192)",
  },
  {
    label: "Показы",
    data: [10, 10, 10, 10, 10, 10, 10],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(54, 162, 235)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(54, 162, 235)",
  },
  {
    label: "Тенденции кликов",
    data: [10, 20, 30, 40, 30, 20, 10],
    cubicInterpolationMode: "monotone",
    pointRadius: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 159, 64)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 159, 64)",
  },
  {
    label: "Тенденции показов",
    data: [20, 20, 20, 20, 20, 20, 100],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 99, 132)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 99, 132)",
  },
  {
    label: "Тенденции топ-50 запросов",
    data: [0, 0, 0, 0, 0, 0, 0],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Тенденции топ-10 запросов",
    data: [5, 5, 5, 5, 5, 5, 5],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Тенденции топ-5 запросов",
    data: [5, 5, 5, 5, 5, 5, 5],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Тенденции топ-3 запросов",
    data: [5, 5, 5, 5, 5, 5, 5],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Средняя позиция",
    data: [110, 110, 110, 110, 110, 110, 110],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Тенденции средней позиции",
    data: [55, 55, 55, 55, 55, 55, 55],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
  {
    label: "Спрос",
    data: [65, 65, 65, 65, 65, 65, 140],
    pointRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 216, 106)",
    pointBorderWidth: 0,
    pointBackgroundColor: "rgba(255, 216, 106)",
  },
];

const cfg = {
  type: "line",
  data: {
    labels: dates,
    datasets: allDatasets.slice(0, -3),
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          padding: 0,
          autoSkip: true,
          maxRotation: 60,
          minRotation: 60,
        },
        grid: {
          color: "#f7f7f7", // Цвет сетки для оси X
          lineWidth: 1, // Ширина линии сетки
        },
      },
      y: {
        ticks: {
          padding: 30,
        },
        grid: {
          color: "#f7f7f7", // Цвет сетки для оси X
          lineWidth: 1, // Ширина линии сетки
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          generateLabels: function (chart) {
            const originalLabels =
              Chart.defaults.plugins.legend.labels.generateLabels(chart);
            return originalLabels.map((label) => {
              let inactiveColor = label.fillStyle;
              inactiveColor = inactiveColor.slice(0, -1) + ", 0.5)";

              if (label.hidden === false) {
                label.fillStyle = label.fillStyle;
                label.strokeStyle = label.fillStyle;
                label.fontColor = "#404040";
                label.icon = icon;
              } else {
                label.fillStyle = inactiveColor;
                label.strokeStyle = inactiveColor;
                label.fontColor = "#bbbbbb";
                label.icon = icon2;
              }

              return label;
            });
          },

          boxWidth: 20,
          padding: 36, // Отступ
          pointStyle: "circle",
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 1)", // Цвет фона
        titleColor: "#404040", // Цвет заголовка
        bodyColor: "#404040", // Цвет текста
        borderColor: "#E5E5EA", // Цвет рамки
        borderWidth: 1, // Толщина рамки
        padding: 10, // Внутренний отступ
        cornerRadius: 8, // Радиус скругления углов
        displayColors: false, // Отключить цветные боксы в легенде
        titleFont: {
          size: 14, // Размер шрифта заголовка
          weight: "bold",
        },
        bodyFont: {
          size: 12, // Размер шрифта текста
        },
        callbacks: {
          label: function (context) {
            return `Значение: ${context.formattedValue}`; // Формат текста
          },
        },
      },
    },
  },
  plugins: [
    {
      id: "customIconLegend", //Отрисовка глазка
      afterDraw(chart) {
        const { ctx, legend } = chart;
        const iconSize = 16;
        const { legendHitBoxes } = chart.legend;
        labelPositions = [];

        // Сохраняем координаты каждой метки в legendItems
        legendHitBoxes.forEach((label, index) => {
          // Вычисляем координаты на основе позиции легенды и индекса
          const x = label.left + label.width + 4; // Смещение по горизонтали
          const y = label.top - 1; // Смещение по вертикали

          labelPositions.push({
            text: label.text,
            x: x,
            y: y,
            icon: label.icon,
          });
        });

        // Убедитесь, что изображение загрузилось
        if (icon.complete) {
          legend.legendItems.forEach((label, i) => {
            const x = labelPositions[i].x;
            const y = labelPositions[i].y;
            // Отрисовка иконки
            ctx.drawImage(label.icon, x, y, iconSize, iconSize);
          });
        } else {
          // Если изображение ещё не загружено, вызываем повторную отрисовку после загрузки
          icon.onload = () => chart.update();
        }
      },
    },
  ],
};
const totalDataPoints = dates.length; // Общее количество данных
const visibleDataPoints = 10; // Видимая область (например, 10 элементов)
let isDragging = false; // Флаг для отслеживания "перетаскивания" прогресс-бара

const cfg_pop = {
  type: "line",
  data: {
    labels: dates,
    datasets: allDatasets.slice(0, 4),
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        min: 0,
        max: 10,
        type: "category",
        display: true,
        ticks: {
          padding: 0,
          autoSkip: true,
          maxRotation: 60,
          minRotation: 60,
        },
        grid: {
          color: "#f7f7f7", // Цвет сетки для оси X
          lineWidth: 1, // Ширина линии сетки
        },
      },
      y: {
        display: true,
        ticks: {
          padding: 30,
        },
        grid: {
          color: "#f7f7f7", // Цвет сетки для оси X
          lineWidth: 1, // Ширина линии сетки
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          generateLabels: function (chart) {
            const originalLabels =
              Chart.defaults.plugins.legend.labels.generateLabels(chart);
            return originalLabels.map((label) => {
              let inactiveColor = label.fillStyle;
              inactiveColor = inactiveColor.slice(0, -1) + ", 0.5)";

              if (label.hidden === false) {
                label.fillStyle = label.fillStyle;
                label.strokeStyle = label.fillStyle;
                label.fontColor = "#404040";
                label.icon = icon;
              } else {
                label.fillStyle = inactiveColor;
                label.strokeStyle = inactiveColor;
                label.fontColor = "#bbbbbb";
                label.icon = icon2;
              }

              return label;
            });
          },

          boxWidth: 20,
          padding: 36, // Отступ
          pointStyle: "circle",
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 1)", // Цвет фона
        titleColor: "#404040", // Цвет заголовка
        bodyColor: "#404040", // Цвет текста
        borderColor: "#E5E5EA", // Цвет рамки
        borderWidth: 1, // Толщина рамки
        padding: 10, // Внутренний отступ
        cornerRadius: 8, // Радиус скругления углов
        displayColors: false, // Отключить цветные боксы в легенде
        titleFont: {
          size: 14, // Размер шрифта заголовка
          weight: "bold",
        },
        bodyFont: {
          size: 12, // Размер шрифта текста
        },
        callbacks: {
          label: function (context) {
            return `Значение: ${context.formattedValue}`; // Формат текста
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Только по оси X
          sensitivity: 6,
          threshold: 8,
          onPan: updateProgressBar,
        },
        // zoom: {
        //   wheel: {
        //     enabled: true,
        //     speed: 0.2, // Скорость масштабирования колесиком
        //   },
        //   pinch: {
        //     enabled: true, // Масштабирование пальцами
        //   },
        //   mode: "x",
        // },
      },
    },
  },
  plugins: [
    {
      id: "customIconLegend", //Отрисовка глазка
      afterDraw(chart) {
        const { ctx, legend } = chart;
        const iconSize = 16;
        const { legendHitBoxes } = chart.legend;
        labelPositions = [];

        // Сохраняем координаты каждой метки в legendItems
        legendHitBoxes.forEach((label, index) => {
          // Вычисляем координаты на основе позиции легенды и индекса
          const x = label.left + label.width + 4; // Смещение по горизонтали
          const y = label.top - 1; // Смещение по вертикали

          labelPositions.push({
            text: label.text,
            x: x,
            y: y,
            icon: label.icon,
          });
        });

        // Убедитесь, что изображение загрузилось
        if (icon.complete) {
          legend.legendItems.forEach((label, i) => {
            const x = labelPositions[i].x;
            const y = labelPositions[i].y;
            // Отрисовка иконки
            ctx.drawImage(label.icon, x, y, iconSize, iconSize);
          });
        } else {
          // Если изображение ещё не загружено, вызываем повторную отрисовку после загрузки
          icon.onload = () => chart.update();
        }
      },
    },
  ],
};
Chart.defaults.font.size = 12;
Chart.defaults.font.family = "PT Root UI";
Chart.defaults.font.weight = 500;
new Chart(ctx, cfg);
const popChart = new Chart(ctx_pop, cfg_pop);

function showDataset(datasetIndices) {
  let newDatasets;
  const tabs = document.querySelectorAll(".legend-tab");
  tabs.forEach((el) => {
    el.classList.remove("active");
  });
  switch (datasetIndices) {
    case "Топ":
      newDatasets = allDatasets.slice(0, 4);
      tabs[0].classList.add("active");
      break;
    case "Клики":
      newDatasets = allDatasets.slice(4, 5);
      tabs[2].classList.add("active");
      break;
    case "Показы":
      newDatasets = allDatasets.slice(5, 6);
      tabs[3].classList.add("active");
      break;
    case "Средняя позиция":
      newDatasets = allDatasets.slice(12, 14);
      tabs[1].classList.add("active");
      break;
    case "Спрос":
      newDatasets = allDatasets.slice(14, 15);
      tabs[4].classList.add("active");
      break;
  }
  popChart.data.datasets = newDatasets;
  popChart.update(); // Обновляем график после изменения видимости
}

// Функция обновления прогресс-бара
function updateProgressBar({ chart }) {
  const xScale = chart.scales.x;
  const min = xScale.min;
  const max = xScale.max;
  const visibleRange = max - min;
  const progress = (min / (totalDataPoints - visibleRange)) * 100;

  document.getElementById("progressBar").style.width = `${progress}%`;
}

// Добавление событий для управления прокруткой через прогресс-бар
const progressContainer = document.getElementById("scrollProgress");
const progressBar = document.getElementById("progressBar");

progressContainer.addEventListener("pointerdown", (e) => {
  isDragging = true;
  moveProgressBar(e);
});

document.addEventListener("pointermove", (e) => {
  if (isDragging) {
    moveProgressBar(e);
  }
});

document.addEventListener("pointerup", () => {
  isDragging = false;
});

function moveProgressBar(e) {
  const containerRect = progressContainer.getBoundingClientRect();
  const newLeft = e.clientX - containerRect.left;

  // Вычисляем новый прогресс в процентах
  const progressPercentage = Math.min(
    Math.max(newLeft / containerRect.width, 0),
    1
  );

  // Пересчет диапазона графика на основе нового прогресса
  const newMin = Math.round(
    progressPercentage * (totalDataPoints - visibleDataPoints)
  );
  const newMax = newMin + visibleDataPoints - 1;

  popChart.options.scales.x.min = newMin;
  popChart.options.scales.x.max = newMax;
  popChart.update();

  // Обновляем положение прогресс-бара
  progressBar.style.width = `${progressPercentage * 100}%`;
}

positionsGraphic = () => {
  const t = document.querySelector(".positios-list");
  var e = t.querySelector(".select-posttions-btn");
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
positionsGraphic();
