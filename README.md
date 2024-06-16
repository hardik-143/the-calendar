# the-calendar

## Description

A simple calendar application that allows users to display a calendar for a specific month and year. The calendar will display the days of the week and the dates for the month. The user can also highlight a specific date on the calendar.


## CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/hardik-143/the-calendar/dist/css/thecalendar.css">

<!-- Js -->
<script src="https://cdn.jsdelivr.net/gh/hardik-143/the-calendar/dist/js/thecalendar.js"></script>
```

## Requirements

- jQuery

## Usage

Call the plugin on a div element to display the calendar.

```javascript
$(document).ready(function () {
  $("#calendar").thecalendar();
});
```

## Options

The plugin accepts an object as an argument to customize the calendar.

```javascript
$(document).ready(function () {
  $("#calendar").thecalendar({
    date: "14-03-2024",
    today: false,
  });
});
```

Default options can be overridden by passing an object to the plugin.

```javascript
$.fn.thecalendar.defaults = {
  date: new Date(),
  today: true,
};
```



## Table of options available

| Option                | Type                     | Default      | Description                                           |
| --------------------- | ------------------------ | ------------ | ----------------------------------------------------- |
| date                  | `string`,`Date` | `new Date()` | The date to display on the calendar.                  |
| today                 | `boolean`                | `true`       | Highlight today's date on the calendar.               |
| type                  | `string`                 | `month`      | The type of calendar to display.                      |
| highlightDates        | `array`                  | `[]`         | An array of dates to highlight on the calendar.       |
| onDateClick           | `function`               | `null`       | Callback function when a date is clicked.             |
| onMonthChange         | `function`               | `null`       | Callback function when the month is changed.          |
| onYearChange          | `function`               | `null`       | Callback function when the year is changed.           |
| onBeforeInit          | `function`               | `null`       | Callback function before the calendar is initialized. |
| onAfterInit           | `function`               | `null`       | Callback function after the calendar is initialized.  |
| onBeforeMonthChange   | `function`               | `null`       | Callback function before the month is changed.        |
| onBeforeYearChange    | `function`               | `null`       | Callback function before the year is changed.         |
| onViewChange          | `function`               | `null`       | Callback function when the view is changed.           |
| onHighlightDatesClick | `function`               | `null`       | Callback function when a highlighted date is clicked. |

## Events

The plugin triggers events when certain actions are performed.

`tc.init` - Triggered when the calendar is initialized.

```javascript
$("#calendar").on("tc.init", function (e, date) {
  console.log("Calendar initialized", date);
});
```


`tc.date.click` - Triggered when a date is clicked.

```javascript
$("#calendar").on("tc.date.click", function (e, date) {
  console.log("Date clicked", date);
});
```

`tc.month.change` - Triggered when the month is changed.

```javascript
$("#calendar").on("tc.month.change", function (e, month) {
  console.log("Month changed", month);
});
```

`tc.year.change` - Triggered when the year is changed.

```javascript
$("#calendar").on("tc.year.change", function (e, year) {
  console.log("Year changed", year);
});
```

`tc.view.change` - Triggered when the view is changed.

```javascript
$("#calendar").on("tc.view.change", function (e, view) {
  console.log("View changed", view);
});
```

`tc.highlight.click` - Triggered when a highlighted date is clicked.

```javascript
$("#calendar").on("tc.highlight.click", function (e, date) {
  console.log("Highlighted date clicked", date);
});
```

### Callback Functions
The plugin provides several callback functions that you can use to perform custom actions when certain events occur. Here are some examples:

```javascript
$("#calendar").thecalendar({
    onDateClick: function(date) {
        console.log("Date clicked:", date);
    },
    onMonthChange: function(month) {
        console.log("Month changed:", month);
    },
    onYearChange: function(year) {
        console.log("Year changed:", year);
    },
    onViewChange: function(view) {
        console.log("View changed:", view);
    },
    onHighlightDatesClick: function(date) {
        console.log("Highlighted date clicked:", date);
    },
    onBeforeInit: function() {
        console.log("Before calendar initialization");
    },
    onAfterInit: function() {
        console.log("After calendar initialization");
    },
    onBeforeMonthChange: function() {
        console.log("Before month change");
    },
    onBeforeYearChange: function() {
        console.log("Before year change");
    },
});
```

After initializing the calendar, you can listen for these events and perform custom actions.


At first
```javascript
let calendar = $("#calendar").thecalendar();
```

Above code will return an object with the following properties and methods:
```javascript
{
    elements: {
      main: // main element,
      header: // header element,
      body: // body element,
      prevBtn: // previous button ,
      nextBtn: // next button,
    },
    getCalendarMode: // to get the calendar mode,
    updateCalendarMode: // to update the calendar mode,
    setYear: // to set the year,
    setMonth: // to set the month,
    getCurrentMonthName: // to get the current month name,
    getNextMonthName: // to get the next month name,
    getPrevMonthName: // to get the previous month name,
    getCurrentYear: // to get the current year,
    getNextYear: // to get the next year,
    getPrevYear: // to get the previous year,
    getHighlightDates: // to get the highlighted dates,
    changeView: // to change the view,
    nextMonth: // to go to the next month,
    prevMonth: // to go to the previous month,
    nextYear: // to go to the next year,
    prevYear: // to go to the previous year,
    destroy: // to destroy the calendar,
    init: // to initialize the calendar,
  }
```
You can use these properties and methods to interact with the calendar and customize its behavior dynamically.