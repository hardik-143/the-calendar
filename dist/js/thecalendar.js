$.fn.thecalendar = function (options) {

  let $mainDiv = $(this); // main div element which will contain the calendar
  let validDateFormats = [
    "yyyy-mm-dd",
    "dd-mm-yyyy",
    "yyyy/mm/dd",
    "dd/mm/yyyy",
  ]; // valid date formats
  let defaultDateFormat = "dd-mm-yyyy";
  let validViews = ["month", "year"]; // valid views
  let currentDate = new Date(); // current date object

  if(!options) {
    options = {};
  }
  /**
   * Converts a date string to a formatted date object.
   *
   * @param {string} date - The date string to be converted.
   * @param {string} [format] - The format of the date string. Defaults to `defaultDateFormat`.
   * @returns {Date} - The formatted date object.
   */
  const getFormattedDateObj = (date, format) => {
    if (!format) {
      format = defaultDateFormat;
    }
    format = format.toLowerCase();
    let dateObj = new Date();
    let dateArr = date.split(/[-/]/);
    if (format === "yyyy-mm-dd") {
      dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    }
    if (format === "dd-mm-yyyy") {
      dateObj = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    }
    if (format === "yyyy/mm/dd") {
      dateObj = new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    }
    if (format === "dd/mm/yyyy") {
      dateObj = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
    }
    return dateObj;
  };

  /**
   * Checks if a given date string is in a valid format.
   *
   * @param {string} date - The date string to validate.
   * @returns {boolean} - Returns true if the date is in a valid format, otherwise false.
   */
  const isValidDateFormat = (date, format = "") => {
    let isValid = false;
    if (format) {
      let isFormat = validDateFormats.includes(format.toLowerCase());
      if (!isFormat) {
        throw new Error(
          "Invalid date format. Please use valid date format. \n\n" +
            validDateFormats.join("\n")
        );
        return;
      }
    }
    let formatList = format ? [format] : validDateFormats;
    for (let i = 0; i < formatList.length; i++) {
      let format = formatList[i];
      let dateArr = date.split(/[-/]/);
      let formatArr = format.split(/[-/]/);
      let isYearMatch = false;
      let isMonthMatch = false;
      let isDayMatch = false;
      if (dateArr.length !== formatArr.length) {
        continue;
      }
      for (let j = 0; j < formatArr.length; j++) {
        if (formatArr[j] === "yyyy" && dateArr[j].length === 4) {
          isYearMatch = true;
        }
        if (
          formatArr[j] === "mm" &&
          dateArr[j].length === 2 &&
          dateArr[j] >= 1 &&
          dateArr[j] <= 12
        ) {
          isMonthMatch = true;
        }
        if (
          formatArr[j] === "dd" &&
          dateArr[j].length === 2 &&
          dateArr[j] >= 1 &&
          dateArr[j] <= 31
        ) {
          isDayMatch = true;
        }
        if (isYearMatch && isMonthMatch && isDayMatch) {
          defaultDateFormat = format;
          isValid = true;
          break;
        }
      }
    }

    return isValid;
  };

  /**
   * Returns the name of the month based on the given month number.
   *
   * @param {number} month - The month number (0-11).
   * @returns {string} The name of the month.
   */
  const getMonthName = (month) => {
    return new Date(2021, month).toLocaleString("default", { month: "long" });
  };

  if (options.date) {
    // if date is a string
    if (typeof options.date === "string") {
      // Check if date is provided
      let isDateValid = isValidDateFormat(options.date);
      if (!isDateValid) {
        // Check if date is in valid format
        throw new Error(
          "Invalid date format. Please use valid date format. \n\n" +
            validDateFormats.join("\n")
        );
        return;
      } else {
        currentDate = getFormattedDateObj(options.date);
      }
    } else if (typeof options.date === "object") {
      // if date is an object
      if (options.date instanceof Date) {
        // if date is a date object
        currentDate = options.date;
      } else if (options.date.date && options.date.format) {
        // if date is an object with date and format
        let isDateMatchingWithFormat = isValidDateFormat(
          options.date.date,
          options.date.format
        ); // Check if given date is in the given format
        if (!isDateMatchingWithFormat) {
          throw new Error("Date format does not match with the provided date");
          return;
        }
        currentDate = getFormattedDateObj(
          options.date.date,
          options.date.format
        );
      } else if (Array.isArray(options.date)) {
        // if date is an array
        let date = options.date[0];
        let format = options.date[1];
        let isDateValid = isValidDateFormat(date, format); // Check if date is in valid format
        if (!isDateValid) {
          // Check if date is in valid format
          throw new Error(
            "Invalid date format. Please use valid date format. \n\n" +
              validDateFormats.join("\n")
          );
          return;
        } else {
          currentDate = getFormattedDateObj(date, format);
        }
      }
    }
  }

  const eventProperties = [
    "onDateClick",
    "onMonthChange",
    "onYearChange",
    "onBeforeInit",
    "onAfterInit",
    "onBeforeMonthChange",
    "onBeforeYearChange",
    "onViewChange",
    "onHighlightDatesClick",
  ];

  console.log($.fn.thecalendar.defaults);
  let _func = function () {}
  var defaultOptions = {
    today: $.fn.thecalendar.defaults.today || true,
    date: $.fn.thecalendar.defaults.date || currentDate,
    type: $.fn.thecalendar.defaults.type || "month",
    highlightDates: [],
  }; // Default options object


  let _options = {
    today: options.today || defaultOptions.today, // highlight today's date
    date: currentDate || defaultOptions.date, // date object
    type: options.type ? options.type.toLowerCase() : defaultOptions.type, // month or year
  }; // Making options object

  // Event properties
  eventProperties.forEach((property) => {
    if (options[property] && typeof options[property] === "function") {
      _options[property] = options[property];
    } else {
      _options[property] = $.fn.thecalendar.defaults[property] || _func;
    }
  });

  // if highlightDates is a function
  if (typeof options.highlightDates === "function") {
    _options.highlightDates = options.highlightDates();
  } else {
    _options.highlightDates =
      options.highlightDates || defaultOptions.highlightDates;
  }

  _options.onBeforeInit($mainDiv, _options); // onBeforeInit callback

  let calendarMode = {
    year: new Date(_options.date).getFullYear(),
    month: new Date(_options.date).getMonth(),
    type: _options.type,
  }; // Calendar mode object to keep track of the current view

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  } // Function to get the number of days in a month

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]; // Function to get the name of the weekday

  /**
   * Returns an object representing a month.
   *
   * @param {number} month - The month index (0-11).
   * @param {number} year - The year.
   * @returns {Object} - The month object.
   */
  const getMonthObject = (month, year) => {
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });
    const monthObject = {
      monthName: monthName,
      monthIndex: month,
      prevMonthIndex: new Date(year, month - 1).getMonth(),
      prevYear: new Date(year, month - 1).getFullYear(),
      nextMonthIndex: new Date(year, month + 1).getMonth(),
      currentYear: year,
      nextYear: new Date(year, month + 1).getFullYear(),
      weeks: [],
      totalDaysInMonth: daysInMonth(month, year),
      totalWeeksInMonth: Math.ceil(
        (daysInMonth(month, year) + new Date(year, month, 1).getDay()) / 7
      ),
    };
    let day = 1;
    let date = new Date(year, month, day);
    while (date.getMonth() === month) {
      const weekObject = { days: [] };
      for (let weekday = 0; weekday < 7; weekday++) {
        let dayObject = {};
        if (weekday === date.getDay() && day <= daysInMonth(month, year)) {
          dayObject.date = day;
          // add dateString in dayObject in yyyy-mm-dd format
          let strMonth = (month + 1).toString().padStart(2, "0");
          let strDay = day.toString().padStart(2, "0");
          dayObject.dateString = `${strDay}-${strMonth}-${year}`;
          dayObject.weekday = weekdays[weekday];
          dayObject.inView = true;
          dayObject.isCurrentDate =
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;
          day++;
          date = new Date(year, month, day);
        } else {
          if (day > daysInMonth(month, year)) {
            dayObject.date = day - daysInMonth(month, year);
            let strMonth = (month + 2).toString().padStart(2, "0");
            let strDay = (day - daysInMonth(month, year))
              .toString()
              .padStart(2, "0");
            dayObject.dateString = `${strDay}-${strMonth}-${year}`;
            dayObject.weekday = weekdays[weekday];
            dayObject.inView = false;
            day++;
            date = new Date(year, month, day);
          } else {
            dayObject.date =
              daysInMonth(month, year) -
              new Date(year, month, 1).getDay() +
              weekday +
              1;
            let strMonth = month.toString().padStart(2, "0");
            let strDay = (
              daysInMonth(month, year) -
              new Date(year, month, 1).getDay() +
              weekday +
              1
            )
              .toString()
              .padStart(2, "0");
            dayObject.dateString = `${strDay}-${strMonth}-${year}`;
            dayObject.weekday = weekdays[weekday];
            dayObject.inView = false;
          }
        }
        weekObject.days.push(dayObject);
      }
      monthObject.weeks.push(weekObject);
    }
    return monthObject;
  };

  /**
   * Creates a year calendar object for the given year.
   *
   * @param {number} year - The year for which to create the calendar.
   * @returns {object} - The year calendar object containing information about the current year, previous year, next year, and an array of month objects.
   */
  const createYearCalendar = (year) => {
    const yearObject = {
      currentYear: year,
      prevYear: year - 1,
      nextYear: year + 1,
      months: [],
    };
    for (let month = 0; month < 12; month++) {
      const monthObject = getMonthObject(month, year);
      yearObject.months.push(monthObject);
    }
    return yearObject;
  };

  const createMonthCalendar = (month, year) => {
    const monthObject = getMonthObject(month, year);
    return monthObject;
  }; // Function to create a month object for a given month

  const getDaysList = (daysFor) => {
    let str = "";
    let $daysList = $(`<div></div>`);
    $daysList.addClass(`days-list`);

    for (let i = 0; i < 7; i++) {
      let $days = $(`<div></div>`);
      $days.addClass("days");
      $days.text(weekdays[i].substring(0, daysFor === "months" ? 3 : 1));
      $daysList.append($days);
    }
    return $daysList;
  }; // Function to create a list of days

  const getLeftArrow = () => {
    return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>`;
  }; // Function to get the left arrow svg
  const getRightArrow = () => {
    return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path></svg>`;
  }; // Function to get the right arrow svg

  /**
   * Checks if the given date string is the same as today's date.
   *
   * @param {string} dateString - The date string to compare with today's date.
   * @returns {boolean} Returns true if the date string is the same as today's date, otherwise returns false.
   */
  const isDateSameAsToday = (dateString) => {
    let _d = new Date();
    let date = _d.getDate().toString().padStart(2, "0");
    let month = (_d.getMonth() + 1).toString().padStart(2, "0");
    let year = _d.getFullYear();
    let todayString = `${date}-${month}-${year}`;
    return dateString === todayString;
  };

  const getDatesView = (monthObject) => {
    let $datesView = $(`<div></div>`);
    $.each(monthObject.weeks, function (index, value) {
      // loops through weeks
      let $daysRow = $(`<div></div>`);
      $daysRow.addClass("day-row");
      $.each(value.days, function (index, value) {
        // loops through days
        data_dateString = value.date ? `data-date="${value.dateString}"` : ""; // date-date
        data_day = value.weekday ? `data-day="${value.weekday}"` : ""; // data-day
        dateValue = value.date ? value.date : "";
        isToday =
          _options.today && isDateSameAsToday(value.dateString) ? " today" : "";
        isHighlighted = _options.highlightDates.includes(value.dateString);

        let $day = $(`<div></div>`);
        $day.addClass(`days`);
        if (_options.today && isDateSameAsToday(value.dateString)) {
          $day.addClass("today");
        }

        if (_options.highlightDates.includes(value.dateString)) {
          $day.addClass("thecalendar-highlight");
        }

        if (!value.inView) {
          $day.addClass("disabled");
        }

        $day.attr("data-date", value.dateString);
        $day.attr("data-day", value.weekday);
        $day.text(dateValue);

        $daysRow.append($day);
      });

      $datesView.append($daysRow);
    });
    return $datesView.html();
  };

  const getMonthHeading = (obj) => {
    let $heading = $(`<div class="${_options.type}-heading"></div>`);
    let $headingText = $(`<div class="heading-text">${obj.monthName}</div>`);
    let $headingTextTitle = $(
      `<div class="heading-text year-title">${obj.currentYear}</div>`
    );
    $headingTextTitle.attr("data-year", obj.currentYear);
    $headingTextTitle.attr("data-month", obj.monthIndex);
    $headingTextTitle.attr("data-type", "year");

    $heading.append($headingText);
    $heading.append($headingTextTitle);

    let $navigationWrapper = $(
      `<div class="thecalendar-navigation-wrapper"></div>`
    );
    let $prevBtn = $(
      `<button class="prev thecalendar-navigation-btn" data-type="month" data-month="${
        obj.prevMonthIndex
      }" data-year="${obj.prevYear}">${getLeftArrow()}</button>`
    );
    let $nextBtn = $(
      `<button class="next thecalendar-navigation-btn" data-type="month" data-month="${
        obj.nextMonthIndex
      }" data-year="${obj.nextYear}">${getRightArrow()}</button>`
    );
    $navigationWrapper.append($prevBtn);
    $navigationWrapper.append($nextBtn);

    let $wrapper = $("<div></div>");
    $wrapper.append($heading);
    $wrapper.append($navigationWrapper);
    return $wrapper.html();
  };
  const getYearHeading = (obj) => {
    let $heading = $(`<div class="${_options.type}-heading"></div>`);
    let $navigationWrapper = $(
      `<div class="thecalendar-navigation-wrapper"></div>`
    );
    let $prevBtn = $(
      `<button class="prev thecalendar-navigation-btn" data-type="year" data-year="${
        obj.prevYear
      }">${getLeftArrow()}</button>`
    );
    let $headingText = $(`<div class="heading-text">${obj.currentYear}</div>`);
    let $nextBtn = $(
      `<button class="next thecalendar-navigation-btn" data-type="year" data-year="${
        obj.nextYear
      }">${getRightArrow()}</button>`
    );
    $navigationWrapper.append($prevBtn);
    $navigationWrapper.append($headingText);
    $navigationWrapper.append($nextBtn);
    $heading.append($navigationWrapper);

    return $heading;
  };

  const makeMonthView = (obj) => {
    let $theCalendar = $(
      `<div class="thecalendar ${_options.type}-view"></div>`
    );
    let $theCalendarInner = $('<div class="thecalendar-inner"></div>');
    let $theCalendarHeader = $(
      `<div class="thecalendar-header thecalendar-header-${_options.type}-wrapper"></div>`
    );
    $theCalendarHeader.html(getMonthHeading(obj));
    let $theCalendarBody = $(
      `<div class="thecalendar-body thecalendar-${_options.type}-body"></div>`
    );
    let $theCalendarTypeInner = $(
      `<div class="thecalendar-${_options.type}-inner"></div>`
    );

    let daysListHTML = getDaysList("months");

    let $daysList = $(daysListHTML);
    let $dates = $(`<div class="dates">${getDatesView(obj)}</div>`);

    $theCalendarTypeInner.append($daysList);
    $theCalendarTypeInner.append($dates);
    $theCalendarBody.append($theCalendarTypeInner);
    $theCalendarInner.append($theCalendarHeader);
    $theCalendarInner.append($theCalendarBody);
    $theCalendar.append($theCalendarInner);
    $mainDiv.html($theCalendar);
  };

  const makeYearView = (obj) => {
    let daysListHTML = getDaysList("years");

    let $theCalendar = $(
      `<div class="thecalendar ${_options.type}-view"></div>`
    );
    let $theCalendarInner = $('<div class="thecalendar-inner"></div>');
    let $theCalendarHeader = $(
      `<div class="thecalendar-header thecalendar-header-${_options.type}-wrapper"></div>`
    );
    $theCalendarHeader.html(getYearHeading(obj));
    let $theCalendarBody = $(
      `<div class="thecalendar-body thecalendar-${_options.type}-body"></div>`
    );
    let $theCalendarTypeInner = $(
      `<div class="thecalendar-${_options.type}-inner"></div>`
    );

    obj.months.forEach((singleMonth) => {
      let $monthsWrapper = $('<div class="months-wrapper"></div>');
      let $monthName = $(
        `<div class="month-name" role="button" data-month="${singleMonth.monthIndex}" data-year="${singleMonth.currentYear}" data-type="month">${singleMonth.monthName}</div>`
      );
      let $daysList = $(daysListHTML);
      let $dates = $(`<div class="dates"></div>`);
      $dates.html(getDatesView(singleMonth));
      $monthsWrapper.append($monthName);
      $monthsWrapper.append($daysList);
      $monthsWrapper.append($dates);
      $theCalendarTypeInner.append($monthsWrapper);
    });

    $theCalendarBody.append($theCalendarTypeInner);
    $theCalendarInner.append($theCalendarHeader);
    $theCalendarInner.append($theCalendarBody);
    $theCalendar.append($theCalendarInner);
    $mainDiv.html($theCalendar);
  };

  const initCalendarView = () => {
    let type = _options.type;
    let year = calendarMode.year;
    let month = calendarMode.month;
    let calendarobj = {};
    if (type === "year") {
      calendarobj = createYearCalendar(year);
      makeYearView(calendarobj);
    } else {
      calendarobj = createMonthCalendar(month, year);
      makeMonthView(calendarobj);
    }
    return;
  };

  const updateCalendarView = (obj) => {
    _options.type = obj.type;
    calendarMode = {
      ...calendarMode,
      ...obj,
    };
    initCalendarView();
  };

  // Function to initialize events on the calendar
  const initEvents = () => {
    // navigation buttons to change the month or year
    $mainDiv.on("click", ".thecalendar-navigation-btn", function () {
      let $this = $(this);
      let month = $this.attr("data-month") || null;
      let year = $this.attr("data-year") || null;
      let oldYear = calendarMode.year;
      let oldMonth = calendarMode.month;
      calendarMode.year = parseInt(year);
      calendarMode.month = parseInt(month);
      updateCalendarView({
        type: $this.attr("data-type"),
        year: calendarMode.year,
        month: calendarMode.month,
      });

      let type = $this.attr("data-type");
      if (type === "year") {
        _options.onBeforeYearChange($mainDiv, {
          year: oldYear,
        });
        let yearObj = {
          year: calendarMode.year,
          oldYear,
        };
        $mainDiv.trigger("tc.year.change", yearObj);
        _options.onYearChange($mainDiv, yearObj);
      } else {
        _options.onBeforeMonthChange($mainDiv, {
          year: oldYear,
          month: oldMonth,
          monthName: getMonthName(oldMonth),
        });
        let monthObj = {
          year: calendarMode.year,
          month: calendarMode.month,
          oldMonth,
          monthName: getMonthName(calendarMode.month),
          oldMonthName: getMonthName(oldMonth),
        };
        $mainDiv.trigger("tc.month.change", monthObj);
        _options.onMonthChange($mainDiv, monthObj);
      }
    });

    // select date
    $mainDiv.on("click", ".days", function () {
      let $this = $(this);
      let date = $this.attr("data-date") || null;
      let day = $this.attr("data-day") || null;
      let isDayHighlighted = $this.hasClass("thecalendar-highlight");
      let month =
        $this.closest(".months-wrapper").find(".month-name").data("month") ||
        null;

      let onSelectObj = {
        date,
        day,
        month,
        monthName: getMonthName(month),
        year: calendarMode.year,
        isHighlighted: isDayHighlighted,
      };

      if (isDayHighlighted) {
        let hightlightObj = {
          ...onSelectObj,
          highlightDates: _options.highlightDates,
        };
        $mainDiv.trigger("tc.highlight.click", hightlightObj);
        _options.onHighlightDatesClick($mainDiv, hightlightObj);
      } else {
        $mainDiv.trigger("tc.date.click", onSelectObj);
        _options.onDateClick($mainDiv, onSelectObj);
      }
    });

    // To change the view of calendar
    $mainDiv.on(
      "click",
      ".thecalendar-year-body .month-name,.thecalendar-header-month-wrapper .year-title",
      function () {
        let $this = $(this);
        let month = $this.attr("data-month") || null;
        let year = $this.attr("data-year") || null;
        let type = $this.attr("data-type") || null;
        calendarMode.year = parseInt(year);
        calendarMode.month = parseInt(month);
        calendarMode.type = type;
        _options.onViewChange($mainDiv, {
          type,
          year: calendarMode.year,
          month: calendarMode.month,
        });
        updateCalendarView({
          type,
          year: calendarMode.year,
          month: calendarMode.month,
        });
      }
    );

    // month to year
    $mainDiv.on("click", ".thecalendar-year-body .year-title", function () {
      let $this = $(this);
      let year = $this.attr("data-year") || null;
      let type = $this.attr("data-type") || null;
      calendarMode.year = parseInt(year);
      calendarMode.type = type;
      updateCalendarView({
        type: "year",
        year: calendarMode.year,
        month: calendarMode.month,
      });
    });
  };

  function _init() {
    initCalendarView();
    initEvents();
  }
  function _destroy() {
    $mainDiv.html("");
  }
  _init();

  let returnObj = {
    elements: {
      // elements object to keep track of the elements
      main: $mainDiv,
      header: $mainDiv.find(".thecalendar-header"),
      body: $mainDiv.find(".thecalendar-body"),
      prevBtn: $mainDiv.find(".thecalendar-navigation-btn.prev"),
      nextBtn: $mainDiv.find(".thecalendar-navigation-btn.next"),
    },
    getCalendarMode: () => {
      // getCalendarMode function to get the current calendar mode
      return calendarMode;
    },
    updateCalendarMode: (mode) => {
      // updateCalendarMode function to update the calendar mode
      calendarMode = {
        ...calendarMode,
        ...mode,
      };
      updateCalendarView({
        type: calendarMode.type,
        year: calendarMode.year,
        month: calendarMode.month,
      });
    },
    setYear: (year) => {
      // setYear function to set the year
      if (year == null) {
        throw new Error("Please provide a year");
        return;
      }
      if (typeof year !== "number") {
        throw new Error("Please provide a valid year");
        return;
      }
      if (year.toString().length !== 4) {
        throw new Error("Invalid year. Please provide a valid year");
        return;
      }
      calendarMode.year = year;
      // console.log(calendarMode);
      updateCalendarView({
        type: calendarMode.type,
        year: calendarMode.year,
        month: calendarMode.month,
      });
    },
    setMonth: (month) => {
      // setMonth function to set the month
      if (calendarMode.type === "year") {
        throw new Error("Cannot set month in year view");
        return;
      }
      if (month == null) {
        throw new Error("Please provide a month");
        return;
      }
      if (typeof month !== "number") {
        throw new Error("Please provide a valid month");
        return;
      }
      if (month < 0 || month > 11) {
        throw new Error(
          "Invalid month. Please provide a month between 0 and 11"
        );
        return;
      }
      if (calendarMode.month === month) {
        return;
      }
      calendarMode.month = month - 1;
      updateCalendarView({
        type: calendarMode.type,
        year: calendarMode.year,
        month: calendarMode.month,
      });
    },
    getCurrentMonthName: () => {
      if (calendarMode.type === "year") {
        throw new Error("Cannot get month name in year view");
        return;
      }
      return getMonthName(calendarMode.month);
    },
    getNextMonthName: () => {
      if (calendarMode.type === "year") {
        throw new Error("Cannot get month name in year view");
        return;
      }
      return getMonthName(
        calendarMode.month === 11 ? 0 : calendarMode.month + 1
      );
    },
    getPrevMonthName: () => {
      if (calendarMode.type === "year") {
        throw new Error("Cannot get month name in year view");
        return;
      }
      return getMonthName(
        calendarMode.month === 0 ? 11 : calendarMode.month - 1
      );
    },
    getCurrentYear: () => {
      return calendarMode.year;
    },
    getNextYear: () => {
      return calendarMode.year + 1;
    },
    getPrevYear: () => {
      return calendarMode.year - 1;
    },
    getHighlightDates: () => {
      return _options.highlightDates;
    },
    changeView: (type) => {
      if (validViews.includes(type.toLowerCase())) {
        if (type.toLowerCase() === calendarMode.type) {
          return;
        }
        calendarMode.type = type.toLowerCase();
        calendarMode.month = new Date().getMonth();
        updateCalendarView({
          type: calendarMode.type,
          year: calendarMode.year,
          month: calendarMode.month,
        });
      } else {
        throw new Error("Invalid view type. Please provide a valid view type");
      }
    },
    nextMonth: () => {
      const currentMonth = calendarMode.month;
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear =
        nextMonth === 0 ? calendarMode.year + 1 : calendarMode.year;
      updateCalendarView({
        type: calendarMode.type,
        year: nextYear,
        month: nextMonth,
      });
    },
    prevMonth: () => {
      const currentMonth = calendarMode.month;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear =
        prevMonth === 11 ? calendarMode.year - 1 : calendarMode.year;
      updateCalendarView({
        type: calendarMode.type,
        year: prevYear,
        month: prevMonth,
      });
    },
    nextYear: () => {
      const nextYear = calendarMode.year + 1;
      updateCalendarView({
        type: calendarMode.type,
        year: nextYear,
        month: calendarMode.month,
      });
    },
    prevYear: () => {
      const prevYear = calendarMode.year - 1;
      updateCalendarView({
        type: calendarMode.type,
        year: prevYear,
        month: calendarMode.month,
      });
    },
    destroy: _destroy,
    init: _init,
  };

  // trigger tc.init
  setTimeout(() => {
    $mainDiv.trigger("tc.init", [returnObj]);
  }, 0);

  _options.onAfterInit($mainDiv, returnObj); // onAfterInit callback

  return returnObj;
};