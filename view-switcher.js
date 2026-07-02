// View Switcher for Calendar (Week/Month/Year)
// This file extends the main calendar functionality

window.calendarView = 'month';

window.switchCalendarView = function(view) {
  window.calendarView = view;
  document.querySelectorAll('.view-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  if (view === 'month') {
    renderCalendar();
  } else if (view === 'week') {
    renderWeekView();
  } else if (view === 'year') {
    renderYearView();
  }
};

window.renderWeekView = function() {
  var calendarBody = document.getElementById('calendarBody');
  calendarBody.innerHTML = '';
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  var day = currentDate.getDate();
  var startOfWeek = new Date(year, month, day - ((new Date(year, month, day).getDay() + 6) % 7));
  var weekRow = document.createElement('div');
  weekRow.className = 'week-row';
  weekRow.style.flex = '1';
  for (var i = 0; i < 7; i++) {
    var cellDate = new Date(startOfWeek.getTime() + i * 86400000);
    var dateStr = cellDate.getFullYear() + '-' + String(cellDate.getMonth()+1).padStart(2,'0') + '-' + String(cellDate.getDate()).padStart(2,'0');
    var cell = document.createElement('div');
    cell.className = 'day-cell';
    if (i >= 5) cell.classList.add('weekend');
    var dayEvents = events.filter(function(e) { return e.date === dateStr; }).sort(function(a,b) { return (a.time||'').localeCompare(b.time||''); });
    var eventsHtml = '';
    dayEvents.forEach(function(ev) {
      var cat = categories[ev.category] || categories.other;
      var timeRange = ev.time ? (ev.timeEnd ? ev.time + '–' + ev.timeEnd : ev.time) : '';
      var timePrefix = timeRange ? timeRange + ' ' : '';
      eventsHtml += '<div class="event-chip ' + cat.class + '" title="' + ev.title + (ev.place ? ' — ' + ev.place : '') + '" onclick="event.stopPropagation(); openEditModalById('' + ev.id + '')">' + timePrefix + ev.title + '</div>';
    });
    cell.innerHTML = '<div class="day-number">' + cellDate.getDate() + '</div><div class="day-events">' + eventsHtml + '</div><div class="add-hover">+</div>';
    var dayNum = cellDate.getDate();
    var monthNameCap = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][cellDate.getMonth()];
    cell.onclick = function() { openDayPopup(dateStr, dayNum, monthNameCap); };
    weekRow.appendChild(cell);
  }
  calendarBody.appendChild(weekRow);
};

window.renderYearView = function() {
  var calendarBody = document.getElementById('calendarBody');
  calendarBody.innerHTML = '';
  var year = currentDate.getFullYear();
  var monthNames = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  grid.style.gap = '8px';
  grid.style.padding = '12px';
  grid.style.flex = '1';
  grid.style.overflow = 'auto';
  for (var m = 0; m < 12; m++) {
    var monthCard = document.createElement('div');
    monthCard.style.border = '1px solid #e8e8e8';
    monthCard.style.borderRadius = '8px';
    monthCard.style.padding = '8px';
    monthCard.style.cursor = 'pointer';
    monthCard.style.background = '#fff';
    monthCard.style.transition = 'background 0.2s';
    monthCard.onmouseenter = function() { this.style.background = '#f5f5f5'; };
    monthCard.onmouseleave = function() { this.style.background = '#fff'; };
    var monthEvents = events.filter(function(e) { return e.date && e.date.indexOf(year + '-' + String(m+1).padStart(2,'0')) === 0; }).length;
    monthCard.innerHTML = '<div style="font-weight:700;font-size:13px;color:#333;margin-bottom:4px;">' + monthNames[m] + '</div><div style="font-size:11px;color:#888;">' + monthEvents + ' событий</div>';
    monthCard.onclick = function() { currentDate = new Date(year, m, 1); switchCalendarView('month'); };
    grid.appendChild(monthCard);
  }
  calendarBody.appendChild(grid);
};

// Override prevMonth/nextMonth to handle different views
var originalPrevMonth = prevMonth;
var originalNextMonth = nextMonth;

window.prevMonth = function() {
  if (window.calendarView === 'week') {
    currentDate.setDate(currentDate.getDate() - 7);
    renderWeekView();
  } else if (window.calendarView === 'year') {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderYearView();
  } else {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  }
};

window.nextMonth = function() {
  if (window.calendarView === 'week') {
    currentDate.setDate(currentDate.getDate() + 7);
    renderWeekView();
  } else if (window.calendarView === 'year') {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderYearView();
  } else {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  }
};
