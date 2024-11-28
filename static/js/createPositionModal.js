const createPositionModalId   = "create-position-modal-id"
const regionsBodyId = "regions-body-id"
const defaultRegionValue = "Выбрать регион"
let regionsCount = 0

const SEARCH_REGIONS_BASE_URL = window.location.origin + "/admin/list_menu/search_regions"

const createdRegions = new Map()

const modalIds = {
    name:                       "create-position-name-input-id",
    domain:                     "create-position-domain-input-id",
    queries:                    "create-position-queries-input-id",
    queriesFile:                "create-position-queries-file-input-id",
    requestsQueries:            "create-position-requests-queries-input-id",
    searchRegions:              "create-position-input-search-regions-id",
    searchRegionsDropdownItems: "create-position-search-regions-dropdown-items-id",
    timeMenu:                   "create-position-time-menu-dropdown-id",
    timePickerDaily:            "create-position-time-picker-daily-id",
    timePickerWeekly:           "create-position-time-picker-weekly-id",
    timePickerHourly:           "create-position-time-picker-hourly-id",
    timePickerWeekdays:         "create-position-time-picker-weekdays-id",
    timePickerMonthdays:        "create-position-time-picker-monthdays-id",
}

const modalButtonIds = {
    yandexSearchSystem: "yandex-search-system-button-id",
    googleSearchSystem: "google-search-system-button-id",
    deleteAllRegions: "delete-all-regions-button-id",
}


const updateTimeType = {
    disabled: "disabled",
    weekdays: "weekdays",
    monthdays: "monthdays",
    daily: "daily",
    hourly: "hourly",
}

const selectedDays = {
    type: updateTimeType.disabled,
    days: Array(31).fill(false),
    minutes: 0,
    hours: 0,
    selectedDay: 0, // needed to check which day selected if you have weekly updates
    closeAllExcept(id) {
        [
            document.getElementById(modalIds.timeMenu),
            document.getElementById(modalIds.timePickerDaily),
            document.getElementById(modalIds.timePickerWeekly),
            document.getElementById(modalIds.timePickerHourly),
            document.getElementById(modalIds.timePickerWeekdays),
            document.getElementById(modalIds.timePickerMonthdays),
        ].map((item) => {
            console.log(item)
            if (!item) return
            item.id !== id && item.classList.remove("active")
        })
    },
    reset() {
        this.days.fill(false)
    },
    disable() {
        this.closeAllExcept()
        this.type = updateTimeType.disabled
    },
    selectDaily() {
        this.type = updateTimeType.weekdays
        for (let i = 0; i < 7; i++)
            this.days[i] = true
        const id = modalIds.timePickerDaily
        const element = document.getElementById(id)
        this.closeAllExcept(id)
        element.classList.add("active")
    },
    selectWeekly() {
        this.type = updateTimeType.weekdays
        for (let i = 0; i < 7; i++)
            this.days[i] = true
        const id = modalIds.timePickerWeekly
        const element = document.getElementById(id)
        this.closeAllExcept(id)
        element.classList.add("active")
    },
    selectWeekdays() {
        this.type = updateTimeType.weekdays
        this.reset()
        const id = modalIds.timePickerWeekdays
        const element = document.getElementById(id)
        this.closeAllExcept(id)
        element.classList.add("active")
    },
    selectHourly() {
        this.type = updateTimeType.hourly
        this.reset()
        const id = modalIds.timePickerHourly
        const element = document.getElementById(id)
        this.closeAllExcept(id)
        element.classList.add("active")
    },
    selectMonthdays() {
        const id = modalIds.timePickerMonthdays
        const element = document.getElementById(id)
        this.closeAllExcept(id)
        element.classList.add("active")
        this.reset()
    },
    selectWeeklyDay(i) {
        this.selectedDay = i
    },
    toggleDay(i) {
        this.days[i] = !this.days[i]
    },
}

function toggleTimeMenu() {
    const menu = document.getElementById(modalIds.timeMenu)
    menu.classList.toggle("active")
}

popUpBackground.addEventListener("click", () => {
    try {
        closeCreatePositionModal()
    } catch (e) {}
})

let activatedSearchSystemBtnId = modalButtonIds.googleSearchSystem

const googleSearchSystemIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1549 10.1874C18.1549 9.63883 18.1064 9.118 18.023 8.61108H10.1758V11.743H14.6689C14.4674 12.7708 13.8772 13.6388 13.0022 14.2291V16.3124H15.6827C17.2522 14.8611 18.1549 12.7222 18.1549 10.1874Z" fill="#4285F4"></path>
            <path d="M10.1758 18.3334C12.4258 18.3334 14.3077 17.5834 15.6827 16.3126L13.0022 14.2292C12.2522 14.7292 11.3008 15.0348 10.1758 15.0348C8.00217 15.0348 6.1619 13.5695 5.50217 11.5903H2.73828V13.7362C4.10634 16.4584 6.91884 18.3334 10.1758 18.3334Z" fill="#34A853"></path>
            <path d="M5.50347 11.5903C5.32987 11.0903 5.23958 10.5556 5.23958 10.0001C5.23958 9.44448 5.33681 8.90973 5.50347 8.40973V6.26392H2.73958C2.17014 7.38892 1.84375 8.65282 1.84375 10.0001C1.84375 11.3472 2.17014 12.6111 2.73958 13.7361L5.50347 11.5903Z" fill="#FBBC05"></path>
            <path d="M10.1758 4.96536C11.405 4.96536 12.5022 5.38897 13.3702 6.21536L15.7452 3.84036C14.3077 2.49314 12.4258 1.66675 10.1758 1.66675C6.91884 1.66675 4.10634 3.54175 2.73828 6.26397L5.50217 8.40983C6.1619 6.43064 8.00217 4.96536 10.1758 4.96536Z" fill="#EA4335"></path>
        </svg>`

const yandexSearchSystemIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5415 18.3334H12.6295V3.9195H11.329C8.94812 3.9195 7.7027 5.10997 7.7027 6.88653C7.7027 8.90116 8.56354 9.83525 10.34 11.0257L11.8053 12.0147L7.59281 18.3334H4.46094L8.25215 12.6924C6.07266 11.1356 4.84555 9.6155 4.84555 7.05137C4.84555 3.84623 7.07999 1.66675 11.3108 1.66675H15.5232V18.3334H15.5415Z" fill="#FC3F1D"></path>
        </svg>`

const createPositionModalHTML = `
            <div class="pop-pos__exit-button pop-pos__exit">
                <button 
                    class="borderless-transparent-button" 
                    onclick="closeCreatePositionModal()" type="button" style="cursor: pointer"
                    >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_440_47439" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                            <rect width="24" height="24" fill="white" />
                        </mask>
                        <g mask="url(#mask0_440_47439)">
                            <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="#BBBBBB" />
                        </g>
                    </svg>
                </button>
            </div>
            <div class="popup-title">Создание съема позиций</div>
            <div class="pop-pos__quiz pop-pos__quiz-1">
                <div class="input-title">Название</div>
                <input 
                    name="" 
                    type="text"
                    class="input input--mb pop-pos__quiz-1-name" 
                    placeholder="Введите название проекта"
                    id="${modalIds.name}">
                <div class="input-title__error">Необходимо указать название проекта</div>
                <div class="input-title">Домен</div>
                <input 
                    name=""
                    type="text" 
                    class="input input--mb pop-pos__quiz-1-domain" 
                    placeholder="Введите URL домена"
                    id="${modalIds.domain}">
                <div class="input-title__error">Необходимо указать корректный URL домена</div>
                <div class="pop-project__buttons">
                    <button class="blue-button blue-button--mr btn-reset" data-quiz="pop-pos__quiz-1 pop-pos__quiz-2">Продолжить</button>
                    <button class="transparent-button pop-project__exit-button pop-pos__exit borderless-transparent-button" onclick="closeCreatePositionModal()">
                        Отменить
                    </button>
                </div>
            </div>
            <div class="pop-pos__quiz pop-pos__quiz-2 pop-pos--hidden">
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">1</div>
                        <div class="quiz-title__name">Запросы</div>
                    </div>
                    <div class="pop-pos__max">
                        <span>0</span>/3000
                    </div>
                </div>
                <div class="pop-pos__block">
                    <textarea class="textarea pop-pos__quiz-2-requests" placeholder="Введите запросы, каждый с новой строки" id="${modalIds.requestsQueries}"></textarea>
                    <div class="input-title__error mt-8">Необходимо указать хотя бы 1 запрос</div>
                    <div class="file-chose">
                        <div class="file-chose__preload active">
                            <div class="file-chose__title">Выберите файл или перетащите его сюда</div>
                            <input 
                                type="file" 
                                id="${modalIds.queriesFile}" accept=".txt, .csv" style="display: none">
                            <label for="${modalIds.queriesFile}" class="input-file blue-button">
                                Выбрать файл
                            </label>
                            <div class="file-chose__types">
                                <div class="file-chose__type">TXT</div>
                                <div class="file-chose__type">CSV</div>
                            </div>
                        </div>
                        <div class="file-chose__onload ">
                            <div class="file-chose__title">Файл загружается, дождитесь окончания</div>
                            <div class="loadbar">
                                <div class="loadbar__value">0%</div>
                                <div class="loadbar__line">
                                    <div class="loadbar__body"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="quiz-title deactive">
                    <div class="quiz-title__number">2</div>
                    <div class="quiz-title__name">Конкуренты</div>
                </div>
                <div class="quiz-title deactive">
                    <div class="quiz-title__number">3</div>
                    <div class="quiz-title__name">Поисковые системы, регионы и устройства</div>
                </div>
                <div class="quiz-title deactive">
                    <div class="quiz-title__number">4</div>
                    <div class="quiz-title__name">Расписание сбора</div>
                </div>
                <div class="pop-project__buttons">
                    <button class="blue-button blue-button--mr btn-reset" data-quiz="pop-pos__quiz-2 pop-pos__quiz-3">Продолжить</button>
                    <div class="transparent-button" data-quizback="pop-pos__quiz-1">Вернуться назад</div>
                </div>
            </div>
            <div class="pop-pos__quiz pop-pos__quiz-3 pop-pos--hidden">
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">1</div>
                        <div class="quiz-title__name">Запросы</div>
                    </div>
                </div>
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">2</div>
                        <div class="quiz-title__name">Конкуренты</div>
                    </div>
                    <div class="pop-pos__max">
                        <span>0</span>/10
                    </div>
                </div>
                
                <div class="pop-pos__block">
                    <textarea class="textarea pop-pos__quiz-3-requests" id="" placeholder="Введите запросы, каждый с новой строки"></textarea>
                    <div class="input-title__error mt-8">Необходимо указать хотя бы 1 запрос</div>
                    <div class="file-chose">
                        <div class="file-chose__preload active">
                            <div class="file-chose__title">Выберите файл или перетащите его сюда</div>
                            <input type="file" id="input-file">
                            <label for="input-file" class="input-file blue-button">Выбрать файл</label>
                            <div class="file-chose__types">
                                <div class="file-chose__type">TXT</div>
                                <div class="file-chose__type">CSV</div>
                            </div>
                        </div>
                        <div class="file-chose__onload ">
                            <div class="file-chose__title">Файл загружается, дождитесь окончания</div>
                            <div class="loadbar">
                                <div class="loadbar__value">0%</div>
                                <div class="loadbar__line">
                                    <div class="loadbar__body"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="quiz-title deactive">
                    <div class="quiz-title__number">3</div>
                    <div class="quiz-title__name">Поисковые системы, регионы и устройства</div>
                </div>
                <div class="quiz-title deactive">
                    <div class="quiz-title__number">4</div>
                    <div class="quiz-title__name">Расписание сбора</div>
                </div>
                <div class="pop-project__buttons">
                    <button class="blue-button blue-button--mr btn-reset" data-quiz="pop-pos__quiz-3 pop-pos__quiz-4">Продолжить</button>
                    <div class="transparent-button" data-quizback="pop-pos__quiz-2">Вернуться назад</div>
                </div>
            </div>
            <div class="pop-pos__quiz pop-pos__quiz-4 pop-pos--hidden">
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">1</div>
                        <div class="quiz-title__name">Запросы</div>
                    </div>
                </div>
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">2</div>
                        <div class="quiz-title__name">Конкуренты</div>
                    </div>
                </div>
                <div class="quiz-title">
                    <div class="quiz-title__number">3</div>
                    <div class="quiz-title__name">Поисковые системы, регионы и устройства</div>
                </div>
                <div class="pop-pos__block">
                    <div class="search-system">
                        <div class="search-system__title">Поисковая система</div>
                        <div class="search-system__block">
                            <button class="search-system__google search-system__item borderless-transparent-button active" id="${modalButtonIds.googleSearchSystem}">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.1549 10.1874C18.1549 9.63883 18.1064 9.118 18.023 8.61108H10.1758V11.743H14.6689C14.4674 12.7708 13.8772 13.6388 13.0022 14.2291V16.3124H15.6827C17.2522 14.8611 18.1549 12.7222 18.1549 10.1874Z" fill="#4285F4" />
                                    <path d="M10.1758 18.3334C12.4258 18.3334 14.3077 17.5834 15.6827 16.3126L13.0022 14.2292C12.2522 14.7292 11.3008 15.0348 10.1758 15.0348C8.00217 15.0348 6.1619 13.5695 5.50217 11.5903H2.73828V13.7362C4.10634 16.4584 6.91884 18.3334 10.1758 18.3334Z" fill="#34A853" />
                                    <path d="M5.50347 11.5903C5.32987 11.0903 5.23958 10.5556 5.23958 10.0001C5.23958 9.44448 5.33681 8.90973 5.50347 8.40973V6.26392H2.73958C2.17014 7.38892 1.84375 8.65282 1.84375 10.0001C1.84375 11.3472 2.17014 12.6111 2.73958 13.7361L5.50347 11.5903Z" fill="#FBBC05" />
                                    <path d="M10.1758 4.96536C11.405 4.96536 12.5022 5.38897 13.3702 6.21536L15.7452 3.84036C14.3077 2.49314 12.4258 1.66675 10.1758 1.66675C6.91884 1.66675 4.10634 3.54175 2.73828 6.26397L5.50217 8.40983C6.1619 6.43064 8.00217 4.96536 10.1758 4.96536Z" fill="#EA4335" />
                                </svg>
                                <span>Google</span>
                            </button>
                            <button class="search-system__yandex search-system__item borderless-transparent-button" id="${modalButtonIds.yandexSearchSystem}">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5415 18.3334H12.6295V3.9195H11.329C8.94812 3.9195 7.7027 5.10997 7.7027 6.88653C7.7027 8.90116 8.56354 9.83525 10.34 11.0257L11.8053 12.0147L7.59281 18.3334H4.46094L8.25215 12.6924C6.07266 11.1356 4.84555 9.6155 4.84555 7.05137C4.84555 3.84623 7.07999 1.66675 11.3108 1.66675H15.5232V18.3334H15.5415Z" fill="#FC3F1D" />
                                </svg>
                                <span>Яндекс</span>
                            </button>
                        </div>
                    </div>
                    <div class="regions">
                        <div class="regions__head">
                            <div class="regions__title">Регионы</div>
                            <button class="regions__add borderless-transparent-button" onclick="createRegion()">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.11111 16V8.88889H0V7.11111H7.11111V0H8.88889V7.11111H16V8.88889H8.88889V16H7.11111Z" fill="#0076F5" />
                                </svg>
                            </button>
                            <button class="regions__delete borderless-transparent-button" id="${modalButtonIds.deleteAllRegions}">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_2049_10699" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_2049_10699)">
                                        <path d="M5.975 6.66667V6.56667H5.875H5.1V4.98889H9.375H9.475V4.88889V4.1H14.525V4.88889V4.98889H14.625H18.9V6.56667H18.125H18.025V6.66667V18.2222C18.025 18.6849 17.864 19.0782 17.5397 19.4076C17.2154 19.737 16.829 19.9 16.375 19.9H7.625C7.171 19.9 6.78456 19.737 6.46033 19.4076C6.13605 19.0782 5.975 18.6849 5.975 18.2222V6.66667ZM16.475 6.66667V6.56667H16.375H7.625H7.525V6.66667V18.2222V18.3222H7.625H16.375H16.475V18.2222V6.66667ZM11.025 8.54444V16.3444H9.475V8.54444H11.025ZM14.525 8.54444V16.3444H12.975V8.54444H14.525Z" fill="#E50C00" stroke="#FFE7E6" stroke-width="0.2" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                        <div class="regions__body" id="${regionsBodyId}">
                        </div>
                    </div>
                    <div class="input-title__error">Необходимо добавить хотя бы 1 регион для любой поисковой системы</div>
                </div>
                <div class="quiz-title deactive">
                    <div class="quiz-title__number">4</div>
                    <div class="quiz-title__name">Расписание сбора</div>
                </div>
                <div class="pop-project__buttons">
                    <button class="blue-button blue-button--mr btn-reset" data-quiz="pop-pos__quiz-4 pop-pos__quiz-5">Продолжить</button>
                    <div class="transparent-button" data-quizback="pop-pos__quiz-3">Вернуться назад</div>
                </div>
            </div>
            <div class="pop-pos__quiz pop-pos__quiz-5 pop-pos--hidden">
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">1</div>
                        <div class="quiz-title__name">Запросы</div>
                    </div>
                </div>
                <div class="pop-pos__stage">
                    <div class="quiz-title">
                        <div class="quiz-title__number">2</div>
                        <div class="quiz-title__name">Конкуренты</div>
                    </div>
                </div>
                <div class="quiz-title">
                    <div class="quiz-title__number">3</div>
                    <div class="quiz-title__name">Поисковые системы, регионы и устройства</div>
                </div>
                <div class="quiz-title">
                    <div class="quiz-title__number">4</div>
                    <div class="quiz-title__name">Расписание сбора</div>
                </div>
                <div class="search-folders time-menu" id="${modalIds.timeMenu}" >
                    <button class="select-btn time-btn btn-reset borderless-transparent-button" style="border-color: rgb(0, 118, 245);"
                     onclick="toggleTimeMenu()">
                        <span>Выберите частоту сбора</span>
                        <svg class="project__btn-icon" width="16" height="16">
                            <use href="/static/img/svg/sprite.svg#arrow_dropdown"></use>
                        </svg>
                    </button>
                    <div class="input-title__error input-title__error-1">Необходимо настроить расписание съема позиций</div>
                    <div class="search__dropdown-wrapper">
                        <div class="project__dropdown">
                            <div class="folder" data-visible="false">
                                <button class="folder__btn btn-reset">
                                    <span>По требованию</span>
                                </button>
                            </div>
                            <div class="folder" data-visible="false">
                                <button class="folder__btn btn-reset" onclick="selectedDays.selectHourly()">
                                    <span>Ежечасно</span>
                                </button>
                            </div>
                            <div class="folder" data-visible="false" >
                                <button class="folder__btn btn-reset" onclick="selectedDays.selectDaily()">
                                    <span>Ежедневно</span>
                                </button>
                            </div>
                            <div class="folder" data-visible="false">
                                <button class="folder__btn btn-reset" onclick="selectedDays.selectWeekly()" >
                                    <span>Еженедельно</span>
                                </button>
                            </div>
                            <div class="folder" data-visible="false">
                                <button class="folder__btn btn-reset" onclick="selectedDays.selectWeekdays()">
                                    <span>В определенные дни недели</span>
                                </button>
                            </div>
                            <div class="folder" data-visible="false">
                                <button class="folder__btn btn-reset" onclick="selectedDays.selectMonthdays()">
                                    <span>В определенные дни месяца</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="time-type time-type-daily" id="${modalIds.timePickerDaily}">
                    <div class="time-type__clock">
                        <div class="input" id="">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.275 8.2V8.27118L8.33622 8.3075L11.8274 10.3789L11.3579 11.149L7.325 8.72923V4.125H8.275V8.2ZM0.125 8C0.125 3.65287 3.6452 0.125 7.992 0.125C12.347 0.125 15.875 3.65312 15.875 8C15.875 12.3469 12.347 15.875 7.992 15.875C3.6452 15.875 0.125 12.3471 0.125 8ZM1.475 8C1.475 11.605 4.39496 14.525 8 14.525C11.605 14.525 14.525 11.605 14.525 8C14.525 4.39496 11.605 1.475 8 1.475C4.39496 1.475 1.475 4.39496 1.475 8Z" fill="#BBBBBB" stroke="white" stroke-width="0.25" />
                            </svg>
                            <input type="text" maxlength="5" class="time-input timeInput" placeholder="00:00">
                        </div>
                        <div class="time-type__info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.49929 11.6993C8.36564 11.8329 8.20148 11.9 8 11.9C7.79852 11.9 7.63437 11.8329 7.50071 11.6993C7.36706 11.5656 7.3 11.4015 7.3 11.2C7.3 10.9985 7.36706 10.8344 7.50071 10.7007C7.63437 10.5671 7.79852 10.5 8 10.5C8.20148 10.5 8.36564 10.5671 8.49929 10.7007C8.63294 10.8344 8.7 10.9985 8.7 11.2C8.7 11.4015 8.63294 11.5656 8.49929 11.6993ZM8.7 8.7H7.3V4.1H8.7V8.7ZM8 15.9C6.90635 15.9 5.87989 15.6925 4.91962 15.2782C3.95741 14.863 3.12141 14.3 2.41071 13.5893C1.70001 12.8786 1.13702 12.0426 0.721817 11.0804C0.307452 10.1201 0.1 9.09365 0.1 8C0.1 6.90635 0.307452 5.87989 0.721817 4.91962C1.13702 3.95741 1.70001 3.12141 2.41071 2.41071C3.12141 1.70001 3.95741 1.13702 4.91962 0.721817C5.87989 0.307452 6.90635 0.1 8 0.1C9.09365 0.1 10.1201 0.307452 11.0804 0.721817C12.0426 1.13702 12.8786 1.70001 13.5893 2.41071C14.3 3.12141 14.863 3.95741 15.2782 4.91962C15.6925 5.87989 15.9 6.90635 15.9 8C15.9 9.09365 15.6925 10.1201 15.2782 11.0804C14.863 12.0426 14.3 12.8786 13.5893 13.5893C12.8786 14.3 12.0426 14.863 11.0804 15.2782C10.1201 15.6925 9.09365 15.9 8 15.9ZM8 14.5C9.81263 14.5 11.3516 13.8699 12.6107 12.6107C13.8699 11.3516 14.5 9.81263 14.5 8C14.5 6.18737 13.8699 4.64844 12.6107 3.38929C11.3516 2.13014 9.81263 1.5 8 1.5C6.18737 1.5 4.64844 2.13014 3.38929 3.38929C2.13014 4.64844 1.5 6.18737 1.5 8C1.5 9.81263 2.13014 11.3516 3.38929 12.6107C4.64844 13.8699 6.18737 14.5 8 14.5Z" fill="#0076F5" stroke="#F2F8FE" stroke-width="0.2" />
                            </svg>
                            <span>Время должно указываеться по МСК</span>
                        </div>
                    </div>
                </button>
                <div class="time-type time-type-weekly" id="${modalIds.timePickerWeekly}">
                    <div class="time-type__clock">
                        <div class="input">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.275 8.2V8.27118L8.33622 8.3075L11.8274 10.3789L11.3579 11.149L7.325 8.72923V4.125H8.275V8.2ZM0.125 8C0.125 3.65287 3.6452 0.125 7.992 0.125C12.347 0.125 15.875 3.65312 15.875 8C15.875 12.3469 12.347 15.875 7.992 15.875C3.6452 15.875 0.125 12.3471 0.125 8ZM1.475 8C1.475 11.605 4.39496 14.525 8 14.525C11.605 14.525 14.525 11.605 14.525 8C14.525 4.39496 11.605 1.475 8 1.475C4.39496 1.475 1.475 4.39496 1.475 8Z" fill="#BBBBBB" stroke="white" stroke-width="0.25" />
                            </svg>
                            <input type="text" maxlength="5" class="time-input timeInput" placeholder="00:00">
                        </div>
                        <div class="time-type__info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.49929 11.6993C8.36564 11.8329 8.20148 11.9 8 11.9C7.79852 11.9 7.63437 11.8329 7.50071 11.6993C7.36706 11.5656 7.3 11.4015 7.3 11.2C7.3 10.9985 7.36706 10.8344 7.50071 10.7007C7.63437 10.5671 7.79852 10.5 8 10.5C8.20148 10.5 8.36564 10.5671 8.49929 10.7007C8.63294 10.8344 8.7 10.9985 8.7 11.2C8.7 11.4015 8.63294 11.5656 8.49929 11.6993ZM8.7 8.7H7.3V4.1H8.7V8.7ZM8 15.9C6.90635 15.9 5.87989 15.6925 4.91962 15.2782C3.95741 14.863 3.12141 14.3 2.41071 13.5893C1.70001 12.8786 1.13702 12.0426 0.721817 11.0804C0.307452 10.1201 0.1 9.09365 0.1 8C0.1 6.90635 0.307452 5.87989 0.721817 4.91962C1.13702 3.95741 1.70001 3.12141 2.41071 2.41071C3.12141 1.70001 3.95741 1.13702 4.91962 0.721817C5.87989 0.307452 6.90635 0.1 8 0.1C9.09365 0.1 10.1201 0.307452 11.0804 0.721817C12.0426 1.13702 12.8786 1.70001 13.5893 2.41071C14.3 3.12141 14.863 3.95741 15.2782 4.91962C15.6925 5.87989 15.9 6.90635 15.9 8C15.9 9.09365 15.6925 10.1201 15.2782 11.0804C14.863 12.0426 14.3 12.8786 13.5893 13.5893C12.8786 14.3 12.0426 14.863 11.0804 15.2782C10.1201 15.6925 9.09365 15.9 8 15.9ZM8 14.5C9.81263 14.5 11.3516 13.8699 12.6107 12.6107C13.8699 11.3516 14.5 9.81263 14.5 8C14.5 6.18737 13.8699 4.64844 12.6107 3.38929C11.3516 2.13014 9.81263 1.5 8 1.5C6.18737 1.5 4.64844 2.13014 3.38929 3.38929C2.13014 4.64844 1.5 6.18737 1.5 8C1.5 9.81263 2.13014 11.3516 3.38929 12.6107C4.64844 13.8699 6.18737 14.5 8 14.5Z" fill="#0076F5" stroke="#F2F8FE" stroke-width="0.2" />
                            </svg>
                            <span>Время должно указываться по МСК</span>
                        </div>
                    </div>
                    <div class="time-type__dates">
                        <div class="time-type__dates-items chose-one-date">
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(0)">
                                ПН
                            </div>
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(1)">
                                ВТ
                            </div>
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(2)">
                                СР
                            </div>
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(3)">
                                ЧТ
                            </div>
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(4)">
                                ПН
                            </div>
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(5)">
                                СБ
                            </div>
                            <div class="time-type__dates-item" onclick="selectedDays.selectWeeklyDay(6)">
                                ВС
                            </div>
                        </div>
                        <button class="time-type__dates-reset" onclick="selectedDays.reset()">Очистить</button>
                    </div>
                    <div class="input-title__error mt-8 input-title__error-2">Необходимо выбрать день недели</div>
                </div>
                <div class="time-type time-type-certain" id="${modalIds.timePickerWeekly}">
                    <div class="time-type__clock">
                        <div class="input">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.275 8.2V8.27118L8.33622 8.3075L11.8274 10.3789L11.3579 11.149L7.325 8.72923V4.125H8.275V8.2ZM0.125 8C0.125 3.65287 3.6452 0.125 7.992 0.125C12.347 0.125 15.875 3.65312 15.875 8C15.875 12.3469 12.347 15.875 7.992 15.875C3.6452 15.875 0.125 12.3471 0.125 8ZM1.475 8C1.475 11.605 4.39496 14.525 8 14.525C11.605 14.525 14.525 11.605 14.525 8C14.525 4.39496 11.605 1.475 8 1.475C4.39496 1.475 1.475 4.39496 1.475 8Z" fill="#BBBBBB" stroke="white" stroke-width="0.25" />
                            </svg>
                            <input type="text" maxlength="5" class="time-input timeInput" placeholder="00:00">
                        </div>
                        <div class="time-type__info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.49929 11.6993C8.36564 11.8329 8.20148 11.9 8 11.9C7.79852 11.9 7.63437 11.8329 7.50071 11.6993C7.36706 11.5656 7.3 11.4015 7.3 11.2C7.3 10.9985 7.36706 10.8344 7.50071 10.7007C7.63437 10.5671 7.79852 10.5 8 10.5C8.20148 10.5 8.36564 10.5671 8.49929 10.7007C8.63294 10.8344 8.7 10.9985 8.7 11.2C8.7 11.4015 8.63294 11.5656 8.49929 11.6993ZM8.7 8.7H7.3V4.1H8.7V8.7ZM8 15.9C6.90635 15.9 5.87989 15.6925 4.91962 15.2782C3.95741 14.863 3.12141 14.3 2.41071 13.5893C1.70001 12.8786 1.13702 12.0426 0.721817 11.0804C0.307452 10.1201 0.1 9.09365 0.1 8C0.1 6.90635 0.307452 5.87989 0.721817 4.91962C1.13702 3.95741 1.70001 3.12141 2.41071 2.41071C3.12141 1.70001 3.95741 1.13702 4.91962 0.721817C5.87989 0.307452 6.90635 0.1 8 0.1C9.09365 0.1 10.1201 0.307452 11.0804 0.721817C12.0426 1.13702 12.8786 1.70001 13.5893 2.41071C14.3 3.12141 14.863 3.95741 15.2782 4.91962C15.6925 5.87989 15.9 6.90635 15.9 8C15.9 9.09365 15.6925 10.1201 15.2782 11.0804C14.863 12.0426 14.3 12.8786 13.5893 13.5893C12.8786 14.3 12.0426 14.863 11.0804 15.2782C10.1201 15.6925 9.09365 15.9 8 15.9ZM8 14.5C9.81263 14.5 11.3516 13.8699 12.6107 12.6107C13.8699 11.3516 14.5 9.81263 14.5 8C14.5 6.18737 13.8699 4.64844 12.6107 3.38929C11.3516 2.13014 9.81263 1.5 8 1.5C6.18737 1.5 4.64844 2.13014 3.38929 3.38929C2.13014 4.64844 1.5 6.18737 1.5 8C1.5 9.81263 2.13014 11.3516 3.38929 12.6107C4.64844 13.8699 6.18737 14.5 8 14.5Z" fill="#0076F5" stroke="#F2F8FE" stroke-width="0.2" />
                            </svg>
                            <span>Время должно указываться по МСК</span>
                        </div>
                    </div>
                    <div class="time-type__dates">
                        <div class="time-type__dates-items chose-more-date">
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(0)">
                                ПН 
                            </button>
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(1)">
                                ВТ 
                            </button>
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(2)">
                                СР 
                            </button>
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(3)">
                                ЧТ 
                            </button>
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(4)">
                                ПН 
                            </button>
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(5)">
                                СБ 
                            </button>
                            <button class="time-type__dates-item" onclick="selectedDays.toggleDay(6)">
                                ВС 
                            </button>
                        </div>
                        <button class="time-type__dates-reset" onclick="selectedDays.reset()">Очистить</button>
                    </div>
                    <div class="input-title__error mt-8 input-title__error-3">Необходимо выбрать хотя бы 1 день недели</div>
                </div>
                <div class="time-type time-type-month" id="${modalIds.timePickerMonthdays}">
                    <div class="time-type__clock">
                        <div class="input">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.275 8.2V8.27118L8.33622 8.3075L11.8274 10.3789L11.3579 11.149L7.325 8.72923V4.125H8.275V8.2ZM0.125 8C0.125 3.65287 3.6452 0.125 7.992 0.125C12.347 0.125 15.875 3.65312 15.875 8C15.875 12.3469 12.347 15.875 7.992 15.875C3.6452 15.875 0.125 12.3471 0.125 8ZM1.475 8C1.475 11.605 4.39496 14.525 8 14.525C11.605 14.525 14.525 11.605 14.525 8C14.525 4.39496 11.605 1.475 8 1.475C4.39496 1.475 1.475 4.39496 1.475 8Z" fill="#BBBBBB" stroke="white" stroke-width="0.25" />
                            </svg>
                            <input type="text" maxlength="5" class="time-input timeInput" placeholder="00:00">
                        </div>
                        <div class="time-type__info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.49929 11.6993C8.36564 11.8329 8.20148 11.9 8 11.9C7.79852 11.9 7.63437 11.8329 7.50071 11.6993C7.36706 11.5656 7.3 11.4015 7.3 11.2C7.3 10.9985 7.36706 10.8344 7.50071 10.7007C7.63437 10.5671 7.79852 10.5 8 10.5C8.20148 10.5 8.36564 10.5671 8.49929 10.7007C8.63294 10.8344 8.7 10.9985 8.7 11.2C8.7 11.4015 8.63294 11.5656 8.49929 11.6993ZM8.7 8.7H7.3V4.1H8.7V8.7ZM8 15.9C6.90635 15.9 5.87989 15.6925 4.91962 15.2782C3.95741 14.863 3.12141 14.3 2.41071 13.5893C1.70001 12.8786 1.13702 12.0426 0.721817 11.0804C0.307452 10.1201 0.1 9.09365 0.1 8C0.1 6.90635 0.307452 5.87989 0.721817 4.91962C1.13702 3.95741 1.70001 3.12141 2.41071 2.41071C3.12141 1.70001 3.95741 1.13702 4.91962 0.721817C5.87989 0.307452 6.90635 0.1 8 0.1C9.09365 0.1 10.1201 0.307452 11.0804 0.721817C12.0426 1.13702 12.8786 1.70001 13.5893 2.41071C14.3 3.12141 14.863 3.95741 15.2782 4.91962C15.6925 5.87989 15.9 6.90635 15.9 8C15.9 9.09365 15.6925 10.1201 15.2782 11.0804C14.863 12.0426 14.3 12.8786 13.5893 13.5893C12.8786 14.3 12.0426 14.863 11.0804 15.2782C10.1201 15.6925 9.09365 15.9 8 15.9ZM8 14.5C9.81263 14.5 11.3516 13.8699 12.6107 12.6107C13.8699 11.3516 14.5 9.81263 14.5 8C14.5 6.18737 13.8699 4.64844 12.6107 3.38929C11.3516 2.13014 9.81263 1.5 8 1.5C6.18737 1.5 4.64844 2.13014 3.38929 3.38929C2.13014 4.64844 1.5 6.18737 1.5 8C1.5 9.81263 2.13014 11.3516 3.38929 12.6107C4.64844 13.8699 6.18737 14.5 8 14.5Z" fill="#0076F5" stroke="#F2F8FE" stroke-width="0.2" />
                            </svg>
                            <span>Время должно указываться по МСК</span>
                        </div>
                    </div>
                    <div class="time-type__dates">
                        <div class="time-type__month chose-more-month"">
                            <button class="time-type__day" onclick="selectedDays.toggleDay(0)">
                                1
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(1)">
                                2
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(2)">
                                3
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(3)">
                                4
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(4)">
                                5
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(5)">
                                6
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(6)">
                                7
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(7)">
                                8
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(8)">
                                9
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(9)">
                                10
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(10)">
                                11
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(11)">
                                12
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(12)">
                                13
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(13)">
                                14
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(14)">
                                15
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(15)">
                                16
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(16)">
                                17
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(17)">
                                18
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(18)">
                                19
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(19)">
                                20
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(20)">
                                21
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(21)">
                                22
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(22)">
                                23
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(23)">
                                24
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(24)">
                                25
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(25)">
                                26
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(26)">
                                27
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(27)">
                                28
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(28)">
                                29
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(29)">
                                30
                            </button>
                            <button class="time-type__day" onclick="selectedDays.toggleDay(30)">
                                31
                            </button>
                        </div>
                        <button class="time-type__dates-reset" onclick="selectedDays.resetDays()">Очистить</button>
                    </div>
                    <div class="input-title__error mt-8 input-title__error-4">Необходимо выбрать хотя бы 1 день месяца</div>
                </div>
                <div class="pop-project__buttons">
                    <button class="blue-button blue-button--mr btn-reset" data-quiz="pop-pos__quiz-5 pop-pos__quiz-6">
                        Запустить съем позиций
                    </button>
                    <div class="transparent-button" data-quizback="pop-pos__quiz-4">
                        Вернуться назад
                    </div>
                </div>
            </div>
            <div class="pop-pos__quiz-6 pop-pos--hidden">
                <div class="time-type__info">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.95071 9.51071L11.4 5.06142L12.3786 6.04L6.88 11.5386L3.62142 8.28L4.6 7.30142L6.80929 9.51071L6.88 9.58142L6.95071 9.51071ZM8 15.9C6.90635 15.9 5.87989 15.6925 4.91962 15.2782C3.95741 14.863 3.12141 14.3 2.41071 13.5893C1.70001 12.8786 1.13702 12.0426 0.721817 11.0804C0.307452 10.1201 0.1 9.09365 0.1 8C0.1 6.90635 0.307452 5.87989 0.721817 4.91962C1.13702 3.95741 1.70001 3.12141 2.41071 2.41071C3.12141 1.70001 3.95741 1.13702 4.91962 0.721817C5.87989 0.307452 6.90635 0.1 8 0.1C9.09365 0.1 10.1201 0.307452 11.0804 0.721817C12.0426 1.13702 12.8786 1.70001 13.5893 2.41071C14.3 3.12141 14.863 3.95741 15.2782 4.91962C15.6925 5.87989 15.9 6.90635 15.9 8C15.9 9.09365 15.6925 10.1201 15.2782 11.0804C14.863 12.0426 14.3 12.8786 13.5893 13.5893C12.8786 14.3 12.0426 14.863 11.0804 15.2782C10.1201 15.6925 9.09365 15.9 8 15.9ZM8 14.5C9.81263 14.5 11.3516 13.8699 12.6107 12.6107C13.8699 11.3516 14.5 9.81263 14.5 8C14.5 6.18737 13.8699 4.64844 12.6107 3.38929C11.3516 2.13014 9.81263 1.5 8 1.5C6.18737 1.5 4.64844 2.13014 3.38929 3.38929C2.13014 4.64844 1.5 6.18737 1.5 8C1.5 9.81263 2.13014 11.3516 3.38929 12.6107C4.64844 13.8699 6.18737 14.5 8 14.5Z" fill="#009906" stroke="white" stroke-width="0.2" />
                    </svg>
                    <span>Съем позиций успешно запущен</span>
                </div>
                <div class="pop-project__buttons">
                    <button class="blue-button btn-reset pop-pos__exit">Завершить</button>
                </div>
            </div>
            <div class="pop-pos__quiz-7 pop-pos--hidden">
                <div class="time-type__info">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.49929 11.6993C8.36564 11.8329 8.20148 11.9 8 11.9C7.79852 11.9 7.63437 11.8329 7.50071 11.6993C7.36706 11.5656 7.3 11.4015 7.3 11.2C7.3 10.9985 7.36706 10.8344 7.50071 10.7007C7.63437 10.5671 7.79852 10.5 8 10.5C8.20148 10.5 8.36564 10.5671 8.49929 10.7007C8.63294 10.8344 8.7 10.9985 8.7 11.2C8.7 11.4015 8.63294 11.5656 8.49929 11.6993ZM8.7 8.7H7.3V4.1H8.7V8.7ZM8 15.9C6.90635 15.9 5.87989 15.6925 4.91962 15.2782C3.95741 14.863 3.12141 14.3 2.41071 13.5893C1.70001 12.8786 1.13702 12.0426 0.721817 11.0804C0.307452 10.1201 0.1 9.09365 0.1 8C0.1 6.90635 0.307452 5.87989 0.721817 4.91962C1.13702 3.95741 1.70001 3.12141 2.41071 2.41071C3.12141 1.70001 3.95741 1.13702 4.91962 0.721817C5.87989 0.307452 6.90635 0.1 8 0.1C9.09365 0.1 10.1201 0.307452 11.0804 0.721817C12.0426 1.13702 12.8786 1.70001 13.5893 2.41071C14.3 3.12141 14.863 3.95741 15.2782 4.91962C15.6925 5.87989 15.9 6.90635 15.9 8C15.9 9.09365 15.6925 10.1201 15.2782 11.0804C14.863 12.0426 14.3 12.8786 13.5893 13.5893C12.8786 14.3 12.0426 14.863 11.0804 15.2782C10.1201 15.6925 9.09365 15.9 8 15.9ZM8 14.5C9.81263 14.5 11.3516 13.8699 12.6107 12.6107C13.8699 11.3516 14.5 9.81263 14.5 8C14.5 6.18737 13.8699 4.64844 12.6107 3.38929C11.3516 2.13014 9.81263 1.5 8 1.5C6.18737 1.5 4.64844 2.13014 3.38929 3.38929C2.13014 4.64844 1.5 6.18737 1.5 8C1.5 9.81263 2.13014 11.3516 3.38929 12.6107C4.64844 13.8699 6.18737 14.5 8 14.5Z" fill="#E50C00" stroke="#FDF4F4" stroke-width="0.2" />
                    </svg>
                    <span>Не удалось создать съем позиций. Проверьте правильность введенных данных и попробуйте снова. Если ошибка повторится, обратитесь в поддержку.</span>
                </div>
                <div class="pop-project__buttons">
                    <button class="blue-button btn-reset">Завершить</button>
                </div>
            </div>
`

function createSearchDropdownId(id) {
    return `search-dropdown-${id}`;
}

function createDeleteRegionButtonId(id) {
    return `delete-region-${id}-id`
}

function createRegionButtonId(id) {
    return `region-btn-${id}-id`
}

function createRegionInputId(id) {
    return `region-input-${id}-id`
}

function createRegionTitleSpanId(id) {
    return `region-name-span-${id}-id`
}

function createDropdownItemsBodyId(id) {
    return `dropdown-items-body-${id}-id`
}

function createSearchInputId(id) {
    return `search-input-${id}-id`
}

function createRegionItemId(id) {
    return `region-item-${id}-id`
}

function prepareAndRenderRegionHTML(title, baseId) {
    const regionItemId = createRegionItemId(baseId)
    const ids = {
        regionItem: regionItemId,
        regionInput: createRegionInputId(baseId),
        regionDeleteBtn: createDeleteRegionButtonId(baseId),
        searchDropdown: createSearchDropdownId(baseId),
        regionBtn: createRegionButtonId(baseId),
        titleSpan: createRegionTitleSpanId(baseId),
    }
    const regionsBody = document.getElementById(regionsBodyId)

    const searchSystemIcon =
        activatedSearchSystemBtnId === modalButtonIds.googleSearchSystem ?
            googleSearchSystemIcon : yandexSearchSystemIcon

    const html = `
    <div class="region region-item" 
         id="${ids.regionItem}">
        <div class="region__browser">
        ${searchSystemIcon}
        </div>
    
        <div class="search-folders regions-menu">
            <button 
                class="select-btn regions-btn btn-reset" 
                style="border-color: rgb(0, 118, 245);"
                id="${ids.regionBtn}"
                >
                <span id="${ids.titleSpan}">${title}</span>
                <svg class="project__btn-icon" width="16" height="16">
                    <use href="/static/img/svg/sprite.svg#arrow_dropdown"></use>
                </svg>
            </button>
            <div id="${ids.searchDropdown}"></div>
        </div>
        <div class="region__device">
            <div class="region__device-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_2049_26958" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_2049_26958)">
                        <path d="M4.91662 16.0667V16.1667H5.01662H18.9803H19.0803V16.0667V6.53338V6.43338H18.9803H5.01662H4.91662V6.53338V16.0667ZM2.49844 20.3V18.7667H21.4984V20.3H2.49844ZM5.01662 17.7C4.56313 17.7 4.17752 17.5408 3.85436 17.2199C3.53122 16.899 3.37116 16.5164 3.37116 16.0667V6.53338C3.37116 6.08367 3.53122 5.70107 3.85436 5.38017C4.17752 5.05926 4.56313 4.90005 5.01662 4.90005H18.9803C19.4338 4.90005 19.8194 5.05926 20.1425 5.38017C20.4657 5.70107 20.6257 6.08367 20.6257 6.53338V16.0667C20.6257 16.5164 20.4657 16.899 20.1425 17.2199C19.8194 17.5408 19.4338 17.7 18.9803 17.7H5.01662Z" fill="#0076F5" stroke="white" stroke-width="0.2" />
                    </g>
                </svg>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5714 6C10.651 6 10.729 6.02069 10.7967 6.05974C10.8644 6.09879 10.9192 6.15467 10.9548 6.22111C10.9903 6.28756 11.0054 6.36194 10.9983 6.43592C10.9911 6.50991 10.962 6.58057 10.9143 6.64L8.34286 9.84C8.30294 9.88968 8.25117 9.93 8.19166 9.95777C8.13215 9.98554 8.06653 10 8 10C7.93347 10 7.86785 9.98554 7.80834 9.95777C7.74883 9.93 7.69706 9.88968 7.65714 9.84L5.08572 6.64C5.03796 6.58057 5.00888 6.50991 5.00173 6.43592C4.99458 6.36194 5.00965 6.28756 5.04525 6.22112C5.08084 6.15467 5.13555 6.09879 5.20326 6.05974C5.27096 6.02069 5.34898 6 5.42857 6L10.5714 6Z" fill="#0076F5" />
                </svg>
            </div>
            <div class="project__dropdown-wrapper">
                <div class="body-panel__google-item active">
                    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.08182 9.38889V9.48889H2.18182H13.8182H13.9182V9.38889V1.44444V1.34444H13.8182H2.18182H2.08182V1.44444V9.38889ZM0.1 12.9V11.6556H15.9V12.9H0.1ZM2.18182 10.7333C1.80833 10.7333 1.4912 10.6024 1.22501 10.3381C0.95884 10.0738 0.827273 9.75915 0.827273 9.38889V1.44444C0.827273 1.07418 0.95884 0.759584 1.22501 0.495262C1.4912 0.23092 1.80833 0.1 2.18182 0.1H13.8182C14.1917 0.1 14.5088 0.23092 14.775 0.495262C15.0412 0.759584 15.1727 1.07418 15.1727 1.44444V9.38889C15.1727 9.75915 15.0412 10.0738 14.775 10.3381C14.5088 10.6024 14.1917 10.7333 13.8182 10.7333H2.18182Z" fill="#404040" stroke="#F7F7F7" stroke-width="0.2" />
                    </svg>
                    <span>Компьютер</span>
                </div>
                <div class="body-panel__google-item">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.7 2.16667V1.96667H2.5H1.66667H1.46667V2.16667V12.1667V12.3667H1.66667H2.5H2.7V12.1667V2.16667ZM3.96667 12.1667V12.3667H4.16667H14.1667H14.3667V12.1667V2.16667V1.96667H14.1667H4.16667H3.96667V2.16667V12.1667ZM15.8333 1.96667H15.6333V2.16667V12.1667V12.3667H15.8333H16.6667H16.8667V12.1667V2.16667V1.96667H16.6667H15.8333ZM1.66667 13.6333C1.2618 13.6333 0.920186 13.4915 0.631005 13.2023C0.341824 12.9131 0.2 12.5715 0.2 12.1667V2.16667C0.2 1.7618 0.341824 1.42019 0.631005 1.131C0.920186 0.841824 1.2618 0.7 1.66667 0.7H16.6667C17.0715 0.7 17.4131 0.841824 17.7023 1.131C17.9915 1.42019 18.1333 1.7618 18.1333 2.16667V12.1667C18.1333 12.5715 17.9915 12.9131 17.7023 13.2023C17.4131 13.4915 17.0715 13.6333 16.6667 13.6333H1.66667Z" fill="#404040" stroke="white" stroke-width="0.4"/>
                        <path d="M12.8584 13.5819H12.7584V13.6819V14.288V14.388H12.8584H18.8108H18.9108V14.288V13.6819V13.5819H18.8108H12.8584ZM12.7584 12.4698V12.5698H12.8584H18.8108H18.9108V12.4698V5.19705V5.09705H18.8108H12.8584H12.7584V5.19705V12.4698ZM12.7584 3.98493V4.08493H12.8584H18.8108H18.9108V3.98493V3.37887V3.27887H18.8108H12.8584H12.7584V3.37887V3.98493ZM12.8584 15.4001C12.5584 15.4001 12.3037 15.2925 12.089 15.074C11.8743 14.8553 11.768 14.5951 11.768 14.288V3.37887C11.768 3.07169 11.8743 2.81151 12.089 2.59288C12.3037 2.3743 12.5584 2.26675 12.8584 2.26675H18.8108C19.1109 2.26675 19.3656 2.3743 19.5803 2.59288C19.795 2.81151 19.9013 3.07169 19.9013 3.37887V14.288C19.9013 14.5951 19.795 14.8553 19.5803 15.0739C19.3656 15.2925 19.1109 15.4001 18.8108 15.4001H12.8584Z" fill="#404040" stroke="white" stroke-width="0.2"/>
                    </svg>
                    <span>Планшет и смартфон (любая ОС)</span>
                </div>
                <div class="body-panel__google-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3101 16.6566L10.3116 16.6566C11.0647 16.6605 11.5406 16.842 11.9547 17.018C11.9848 17.0308 12.0144 17.0435 12.0437 17.056C12.4148 17.2149 12.7303 17.3499 13.1868 17.3499H13.2113C13.4948 17.3499 13.8334 17.2357 14.2049 17.012C14.5746 16.7896 14.9662 16.4652 15.3526 16.0613C16.0987 15.2814 16.8148 14.2161 17.3089 13.0492C16.2382 12.4601 15.5043 11.3222 15.5043 9.99992C15.5043 8.71415 16.1992 7.60319 17.2219 7.00075C16.3309 5.43604 14.8267 4.74465 13.7256 4.74465C13.1159 4.74465 12.5516 4.95072 11.9889 5.16831C11.9593 5.17975 11.9297 5.19124 11.9 5.20275C11.3769 5.40568 10.8447 5.61216 10.3109 5.61216C9.77702 5.61216 9.2448 5.40568 8.72173 5.20275C8.69207 5.19124 8.66245 5.17975 8.63285 5.16831C8.07019 4.95073 7.5059 4.74466 6.89623 4.74465L10.3101 16.6566ZM10.3101 16.6566C9.55708 16.6605 9.08136 16.842 8.66734 17.018C8.63734 17.0308 8.60779 17.0434 8.57857 17.0559C8.20746 17.2148 7.89192 17.3499 7.4349 17.3499H7.41048C7.01708 17.3499 6.52144 17.1304 5.98755 16.7176C5.4581 16.3082 4.90948 15.723 4.41305 15.0259C3.41853 13.6293 2.65 11.8074 2.65 10.0927C2.65 6.31469 5.23567 4.74548 6.89616 4.74465L10.3101 16.6566ZM6.89616 6.11131H6.89602C5.91741 6.11223 4.01667 7.12168 4.01667 10.0927C4.01667 11.5197 4.64609 12.9335 5.37106 14.01C5.73445 14.5496 6.12503 15.0093 6.47935 15.3483C6.65647 15.5178 6.82618 15.6587 6.98046 15.7647C7.13245 15.8691 7.27857 15.946 7.40755 15.9774L7.42727 15.9822L7.44755 15.9816C7.61899 15.9764 7.74205 15.9283 8.03616 15.8018C8.51177 15.5974 9.21488 15.2957 10.3011 15.2899C11.4051 15.2957 12.1105 15.5976 12.5856 15.8018L12.5857 15.8018C12.8912 15.933 13.0114 15.9811 13.1735 15.9832L13.1931 15.9835L13.2122 15.9787C13.334 15.9479 13.4868 15.8635 13.6523 15.7456C13.8216 15.625 14.0164 15.4604 14.2237 15.2558C14.6384 14.8467 15.1084 14.2726 15.5281 13.559L15.5861 13.4603L15.5062 13.3783C14.6408 12.4903 14.1393 11.2914 14.1393 9.99992C14.1393 8.85768 14.5388 7.77814 15.2395 6.92626L15.3362 6.80881L15.2174 6.71382C14.6874 6.29003 14.1129 6.11131 13.7256 6.11131C13.5239 6.11131 13.3071 6.15882 13.0878 6.22583C12.8682 6.29295 12.6361 6.38286 12.4042 6.47273L12.4035 6.47301L12.4035 6.47302C11.7776 6.71567 11.0956 6.97882 10.3109 6.97882C9.5262 6.97882 8.84594 6.71573 8.22002 6.47306C7.98726 6.38261 7.75458 6.29258 7.53433 6.22548C7.31469 6.15856 7.09779 6.11131 6.89616 6.11131ZM10.1439 4.24669C10.1808 3.45158 10.496 2.51979 10.9796 1.99103C11.5231 1.40125 12.3313 1.02689 13.1817 0.986828C13.1615 1.89568 12.9575 2.57613 12.4762 3.13411C11.9554 3.73499 11.0314 4.19785 10.1439 4.24669Z" fill="#404040" stroke="white" stroke-width="0.3"></path>
                    </svg>
                    <span>Планшет и смартфон (iOS)</span>
                </div>
                <div class="body-panel__google-item">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.2345 7.64953L13.9827 8.0848L14.4194 8.33415C16.7011 9.63692 18.2395 11.9175 18.6091 14.4999H1.39217C1.76179 11.9175 3.30021 9.63692 5.5819 8.33415L6.01861 8.0848L5.76676 7.64953L4.24275 5.01565C4.2403 5.00884 4.24015 5.00208 4.24179 4.99577C4.24279 4.99197 4.24433 4.98887 4.24605 4.98645C4.24703 4.98509 4.24833 4.98355 4.25024 4.9819C4.25302 4.98097 4.2579 4.98022 4.26559 4.98199C4.27478 4.98411 4.28208 4.98863 4.28729 4.99445L5.84318 7.67588L6.06444 8.0572L6.47047 7.88542C8.72927 6.92978 11.272 6.92978 13.5308 7.88542L13.9369 8.0572L14.1581 7.67588L15.7158 4.9914C15.7175 4.98937 15.7191 4.98802 15.7205 4.98701C15.7229 4.98528 15.726 4.98374 15.7298 4.98275C15.7364 4.98103 15.7435 4.98127 15.7507 4.98408C15.7531 4.98594 15.7562 4.98953 15.7583 4.99649C15.7605 5.00348 15.7604 5.00995 15.7583 5.01611L14.2345 7.64953ZM4.29232 11.6666C4.29232 12.5177 4.98284 13.2083 5.83398 13.2083C6.68513 13.2083 7.37565 12.5177 7.37565 11.6666C7.37565 10.8155 6.68513 10.1249 5.83398 10.1249C4.98284 10.1249 4.29232 10.8155 4.29232 11.6666ZM12.6256 11.6666C12.6256 12.5177 13.3162 13.2083 14.1673 13.2083C15.0185 13.2083 15.709 12.5177 15.709 11.6666C15.709 10.8155 15.0185 10.1249 14.1673 10.1249C13.3162 10.1249 12.6256 10.8155 12.6256 11.6666Z" stroke="#404040"></path>
                    </svg>
                    <span>Планшет и смартфон (Android)</span>
                </div>
            </div>
        </div>
        <button class="region__delete borderless-transparent-button" id="${ids.regionDeleteBtn}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_2049_10699" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                    <rect width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_2049_10699)">
                    <path d="M5.975 6.66667V6.56667H5.875H5.1V4.98889H9.375H9.475V4.88889V4.1H14.525V4.88889V4.98889H14.625H18.9V6.56667H18.125H18.025V6.66667V18.2222C18.025 18.6849 17.864 19.0782 17.5397 19.4076C17.2154 19.737 16.829 19.9 16.375 19.9H7.625C7.171 19.9 6.78456 19.737 6.46033 19.4076C6.13605 19.0782 5.975 18.6849 5.975 18.2222V6.66667ZM16.475 6.66667V6.56667H16.375H7.625H7.525V6.66667V18.2222V18.3222H7.625H16.375H16.475V18.2222V6.66667ZM11.025 8.54444V16.3444H9.475V8.54444H11.025ZM14.525 8.54444V16.3444H12.975V8.54444H14.525Z" fill="#E50C00" stroke="#FFE7E6" stroke-width="0.2" />
                </g>
            </svg>
        </button>
    </div> 
    `

    regionsBody.insertAdjacentHTML("beforeend", html)

    createdRegions.set(
        ids.regionItem,
        {
            name: defaultRegionValue,
            regionId: -1,
            searchSystem: activatedSearchSystemBtnId === modalButtonIds.yandexSearchSystem ? "Yandex" : "Google",
        })

    const regionBtn = document.getElementById(ids.regionBtn);
    const deleteRegionButton = document.getElementById(ids.regionDeleteBtn);

    deleteRegionButton.addEventListener("click", () => {
        const region = document.getElementById(ids.regionItem)
        region.remove()
        createdRegions.delete(ids.regionItem)
    })

    regionBtn.addEventListener("click", () => {toggleSearchRegions(baseId)})
    const searchRegionsDropdownBody = document.getElementById(ids.searchDropdown)
}

function selectRegion(region, regionItemId, titleSpanId) {
    const titleSpan = document.getElementById(titleSpanId)
    titleSpan.textContent = region.name
    const selectedRegion = createdRegions.get(regionItemId)
    selectedRegion.name = region.name
    selectedRegion.regionId = region.id
}

function toggleSearchRegions(id) {
    const ids = {
        regionItem: createRegionItemId(id),
        searchRegions: createSearchDropdownId(id),
        titleSpan: createRegionTitleSpanId(id),
        itemsBody: createDropdownItemsBodyId(id),
        searchInput: createSearchInputId(id),
    }
    const search = document.getElementById(ids.searchRegions);
    const html = `
    <div class="search__dropdown-wrapper">
        <div class="input-wrap">
            <input id="${ids.searchInput}" type="text" class="input input--icon" placeholder="Введите название региона">
            <label class="input-wrap-icon" for="${ids.searchInput}"></label>
        </div>
        <div class="project__dropdown" id ="${ids.itemsBody}"></div>
    </div>`
    search.insertAdjacentHTML("beforeend", html)
    const searchFolder = document.querySelector(`#${ids.regionItem} .search-folders`)
    const itemsBody = document.getElementById(ids.itemsBody)
    if (searchFolder.classList.contains("active")) {
        while(search.firstChild) search.removeChild(search.firstChild)
        searchFolder.classList.remove("active")
        return
    } else {
        searchFolder.classList.add("active")
    }

    const searchInput = document.getElementById(ids.searchInput)
    let debounceTimeout;
    searchInput.addEventListener("input", async () => {
        clearTimeout(debounceTimeout)
        if (searchInput.value.length < 3) return;
        itemsBody.innerHTML = ""

        debounceTimeout = setTimeout(async () => {
            const url = new URL(SEARCH_REGIONS_BASE_URL)
            url.searchParams.set("s", searchInput.value.toLowerCase())
            let regions = await fetch(url)
                .then((response) => response.json())
            for (const region in regions) {
                const buttonId = `${id}-region-item-${region}-button-id`
                const html = `
                    <div class="folder" data-visible="false">
                        <button class="folder__btn btn-reset borderless-transparent-button" 
                            id="${buttonId}">
                            <span>
                                ${region}
                            </span>
                        </button>
                    </div>
                `
                itemsBody.insertAdjacentHTML("beforeend", html)
                const btn = document.getElementById(buttonId)
                btn.addEventListener("click", () => {
                    selectRegion({name: region, id: regions[region]}, ids.regionItem, ids.titleSpan)
                    search.classList.toggle("active");
                    search.querySelector(".search__dropdown-wrapper").classList.toggle("active");
                    searchFolder.classList.remove("active")
                    while(search.firstChild) search.removeChild(search.firstChild)
                })
            }}, 300)
    })
}


function createRegion() {
    prepareAndRenderRegionHTML(defaultRegionValue, regionsCount)
    regionsCount++
}


function quiz(){
    const allQuizes = document.querySelectorAll(".pop-pos__quiz");

    allQuizes.forEach((el) => {
        el.querySelector("[data-quiz]").addEventListener("click", () => {
            //Данные для валидации
            let error;
            const thisQuiz = el
                .querySelector("[data-quiz]")
                .dataset.quiz.split(" ")[0];
            const thisQuizElement = document.querySelector(`.${thisQuiz}`);

            //Валидация перехода
            switch (true) {
                case thisQuizElement.classList.contains("pop-pos__quiz-1"):
                    error = false;
                    const input1 = thisQuizElement.querySelector(
                        ".pop-pos__quiz-1-name"
                    );
                    const input2 = thisQuizElement.querySelector(
                        ".pop-pos__quiz-1-domain"
                    );

                    if (input1.value.length <= 0) {
                        input1.classList.add("input-error");
                        input1.nextElementSibling.classList.add("active");
                        error = true;
                    } else {
                        input1.classList.remove("input-error");
                        input1.nextElementSibling.classList.remove("active");
                    }
                    if (input2.value.length <= 0) {
                        input2.classList.add("input-error");
                        input2.nextElementSibling.classList.add("active");
                        error = true;
                    } else {
                        input2.classList.remove("input-error");
                        input2.nextElementSibling.classList.remove("active");
                    }
                    if (error === true) return;
                    break;
                case thisQuizElement.classList.contains("pop-pos__quiz-2"):
                    error = false;
                    const input3 = thisQuizElement.querySelector(
                        ".pop-pos__quiz-2-requests"
                    );

                    if (input3.value.length <= 0) {
                        input3.classList.add("input-error");
                        input3.nextElementSibling.classList.add("active");
                        error = true;
                    } else {
                        input3.classList.remove("input-error");
                        input3.nextElementSibling.classList.remove("active");
                    }
                    if (error === true) return;
                    break;
                case thisQuizElement.classList.contains("pop-pos__quiz-3"):
                    // error = false;
                    // const input4 = thisQuizElement.querySelector(
                    //   ".pop-pos__quiz-3-requests"
                    // );

                    // if (input4.value.length <= 0) {
                    //   input4.classList.add("input-error");
                    //   input4.nextElementSibling.classList.add("active");
                    //   error = true;
                    // } else {
                    //   input4.classList.remove("input-error");
                    //   input4.nextElementSibling.classList.remove("active");
                    // }
                    // if (error === true) return;
                    break;
                case thisQuizElement.classList.contains("pop-pos__quiz-4"):
                    error = false;
                    const region = thisQuizElement.querySelector(".region");

                    if (!region) {
                        document
                            .querySelector(".regions")
                            .nextElementSibling.classList.add("active");
                        error = true;
                    } else {
                        document
                            .querySelector(".regions")
                            .nextElementSibling.classList.remove("active");
                    }
                    if (error === true) return;
                    break;
                case thisQuizElement.classList.contains("pop-pos__quiz-5"):
                    error = false;
                    const input5 = thisQuizElement.querySelector(".time-btn");

                    if (
                      input5.textContent.replace(/\s+/g, "") === "Выберитечастотусбора"
                    ) {
                      input5.nextElementSibling.classList.add("active");
                      error = true;
                    } else {
                      input5.nextElementSibling.classList.remove("active");
                    }

                    if (input5.textContent.replace(/\s+/g, "") === "Еженедельно") {
                      error = true;
                      document
                        .querySelector(".time-type-weekly")
                        .querySelectorAll(".time-type__dates-item")
                        .forEach((el) => {
                          if (el.classList.contains("active")) {
                            error = false;
                          }
                        });

                      if (error === true) {
                        document
                          .querySelector(".input-title__error-2")
                          .classList.add("active");
                      } else {
                        document
                          .querySelector(".input-title__error-2")
                          .classList.remove("active");
                      }
                    }

                    if (
                      input5.textContent.replace(/\s+/g, "") === "Вопределенныеднинедели"
                    ) {
                      error = true;
                      document
                        .querySelector(".time-type-certain")
                        .querySelectorAll(".time-type__dates-item")
                        .forEach((el) => {
                          if (el.classList.contains("active")) {
                            error = false;
                          }
                        });

                      if (error === true) {
                        document
                          .querySelector(".input-title__error-3")
                          .classList.add("active");
                      } else {
                        document
                          .querySelector(".input-title__error-3")
                          .classList.remove("active");
                      }
                    }

                    if (
                      input5.textContent.replace(/\s+/g, "") === "Вопределенныеднимесяца"
                    ) {
                      error = true;
                      document
                        .querySelector(".time-type-month")
                        .querySelectorAll(".time-type__day")
                        .forEach((el) => {
                          if (el.classList.contains("active")) {
                            error = false;
                          }
                        });

                      if (error === true) {
                        console.log(document.querySelector(".input-title__error-3"));
                        document
                          .querySelector(".input-title__error-4")
                          .classList.add("active");
                      } else {
                        document
                          .querySelector(".input-title__error-4")
                          .classList.remove("active");
                      }
                    }
                    if (error === true) return;
                    break;
            }

            //Переход вперед
            allQuizes.forEach((quiz) => {
                quiz.classList.add("pop-pos--hidden");
            });
            const nextQuiz = el
                .querySelector("[data-quiz]")
                .dataset.quiz.split(" ")[1];
            document
                .querySelector(`.${nextQuiz}`)
                .classList.remove("pop-pos--hidden");
        });

        //Переход назад
        if (!el.querySelector("[data-quizback]")) return;
        el.querySelector("[data-quizback]").addEventListener(
            "click",
            (button) => {
                allQuizes.forEach((quiz) => {
                    quiz.classList.add("pop-pos--hidden");
                });
                const nextQuiz = button.target.dataset.quizback;
                document
                    .querySelector(`.${nextQuiz}`)
                    .classList.remove("pop-pos--hidden");
            }
        );
    });
}


function prepareModalButtons() {
    const googleBtn = document.getElementById(modalButtonIds.googleSearchSystem)
    const yandexBtn = document.getElementById(modalButtonIds.yandexSearchSystem)
    const deleteButton = document.getElementById(modalButtonIds.deleteAllRegions);

    googleBtn.addEventListener("click", () => {
        googleBtn.classList.add("active")
        yandexBtn.classList.remove("active")
        activatedSearchSystemBtnId = modalButtonIds.googleSearchSystem
    })
    yandexBtn.addEventListener("click", () => {
        yandexBtn.classList.add("active")
        googleBtn.classList.remove("active")
        activatedSearchSystemBtnId = modalButtonIds.yandexSearchSystem
    })
    deleteButton.addEventListener("click", () => {
        const regions = document.querySelectorAll(".region-item");
        regions.forEach((region) => region.remove());
        createdRegions.clear()
    });
}


const choseOneDate = (wrap) => {
    const items = document.querySelector(`${wrap} .chose-one-date`);
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
const choseMoreDate = (wrap) => {
    const items = document.querySelector(`${wrap} .chose-more-date`);
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

const choseMoreMonth = (wrap) => {
    const items = document.querySelector(`${wrap} .chose-more-month`);
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


function showCreatePositionModal() {
    const createModal = document.createElement("div")
    createModal.id = createPositionModalId
    createModal.classList.add("pop-pos", "active")
    createModal.insertAdjacentHTML('beforeend', createPositionModalHTML)
    popupParent.appendChild(createModal)
    activatePopUp()
    prepareModalButtons()

    if (document.querySelector(".pop-pos")) {
        choseOneDate(".pop-pos");
        choseMoreDate(".pop-pos");
        choseMoreMonth(".pop-pos");
    }
    if (document.querySelector(".edit .time-type")) {
        choseOneDate(".edit");
        choseMoreDate(".edit");
        choseMoreMonth(".edit");
    }
    quiz()
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
}

function closeCreatePositionModal() {
    const createModal = document.getElementById(createPositionModalId)
    popupParent.removeChild(createModal)
    deactivatePopUp()
}

window.addEventListener("load", () => {
    showCreatePositionModal()
})