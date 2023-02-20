const form = document.querySelector('form')
const fromInput = document.querySelector('[data-from-date]')
const toInput = document.querySelector('[data-to-date]')

const btnToday = document.querySelector('#today')
const btnTomorrow = document.querySelector('#tomorrow')
const btnThisWeekend = document.querySelector('#this_weekend')
const btnNextWeek = document.querySelector('#next_week')
const btnAll = document.querySelector('#all')

form.addEventListener('reset', showAll)
// form.addEventListener('submit', filter)
// fromInput.addEventListener('change', filter)
// toInput.addEventListener('change', filter)


function filterF(desc) {
  let fromDate, toDate
  if (desc == 'today') {
    const today = roundToDay(new Date())
    fromDate = today
    toDate = today
  } else if (desc == 'tomorrow') {
    const tomorrow = roundToDay(new Date())
    tomorrow.setDate(tomorrow.getDate() + 1)
    fromDate = tomorrow
    toDate = tomorrow
  } else if (desc == 'this_weekend') {
    const today = roundToDay(new Date());
    const nextSaturday = new Date(today.getTime());
    nextSaturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);

    const nextSunday = new Date(nextSaturday)
    nextSunday.setDate(nextSaturday.getDate() + 1)

    console.log(nextSaturday)
    console.log(nextSunday)

    fromDate = nextSaturday
    toDate = nextSunday
  } else if (desc == 'next_week') {
    const today = roundToDay(new Date());
    const nextMonday = new Date(today.getTime());
    nextMonday.setDate(today.getDate() + (1 - today.getDay() + 7) % 7);

    const nextSunday = new Date(nextMonday)
    nextSunday.setDate(nextMonday.getDate() + 7)

    fromDate = nextMonday
    toDate = nextSunday
  } else if (desc == 'all') {
    const today = roundToDay(new Date());
    const inAYear = new Date(today.getTime());
    inAYear.setDate(today.getDate() + 365)

    fromDate = today
    toDate = inAYear
  }

  return () => filter(fromDate, toDate)
}

btnToday.addEventListener('click', filterF('today'))
btnTomorrow.addEventListener('click', filterF('tomorrow'))
btnThisWeekend.addEventListener('click', filterF('this_weekend'))
btnNextWeek.addEventListener('click', filterF('next_week'))
btnAll.addEventListener('click', filterF('all'))


function dayOfWeekName(d) {
  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  return weekday[d.getDay()];
}

function roundToDay(d) {
  return new Date(d.toDateString());
}

const eventsTable = document.querySelector('table#events tbody')
const locMap = new Map(locationsData.map(l => [l.id, l]))


let flattenedEventsData = []

for (const e of eventsData) {
  const loc = locMap.get(e.location_id);
  if (e.date.specific) {
    for (const d of e.date.specific) {
      flattenedEventsData.push(
        {
          "date": new Date(d.date),
          "time": d.time,
          "title": e.title,
          "location": loc,
          "url": e.url,
        }
      )
    }
  }

  if (e.date.range) {
    const startDate = new Date(e.date.range.start_date)
    const endDate = new Date(e.date.range.end_date)
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      flattenedEventsData.push(
        {
          "date": new Date(date.getTime()),
          "time": e.date.range.time,
          "title": e.title,
          "location": loc,
          "url": e.url,
        }
      )
    }
  }
}

flattenedEventsData.sort((a, b) => b.date > a.date)

for (const e of flattenedEventsData) {
  const row = eventsTable.insertRow(0);
  row.dataset.event = ''
  row.dataset.date = e.date

  row.classList.add("striped--near-white")
  let cellIdx = 0;
  function addCell(html) {
    const cell = row.insertCell(cellIdx);
    cell.innerHTML = html;
    cell.classList.add("pa3");
    cellIdx += 1;
  }

  // addCell(`$ ${e.date.toLocaleDateString()}`);
  addCell(`<p><span class="b">${dayOfWeekName(e.date)}</span> <span>${e.date.getDate()} ${e.date.toLocaleString('default', { month: 'short' })}</span></p>`)
  addCell(e.time);
  addCell(`<a href=${e.url}>${e.title}</a>`);
  addCell(`<a href="https://google.com/maps/search/${e.location.address}">${e.location.name}</a><br/><em>(${e.location.location_description})</em>`);
}

const events = document.querySelectorAll('[data-event]')

async function filter(fromDate, toDate) {
  // if (!fromInput.value) { showAll(); return }
  // if (!fromDate) { showAll(); return }

  for (const event of events) {
    const eventDate = roundToDay(new Date(event.getAttribute('data-date')))
    event.hidden = !(eventDate >= fromDate && eventDate <= toDate)
  }
}

function showAll() {
    for (const event of events) {
        event.hidden = false
    }
}

// const fromDateString = new URLSearchParams(location.search).get('from')
// const fromDate = new Date(fromDateString)
// if (fromDateString && fromDate) {
//   fromInput.value = `${fromDate.getFullYear()}-${(fromDate.getMonth() + 1).toString().padStart(2, '0')}-${fromDate.getDate().toString().padStart(2, '0')}`
//   filterF('today')()
// }
//
// const toDateString = new URLSearchParams(location.search).get('to')
// const toDate = new Date(toDateString)
// if (toDateString && toDate) {
//     toInput.value = `${toDate.getFullYear()}-${(toDate.getMonth() + 1).toString().padStart(2, '0')}-${toDate.getDate().toString().padStart(2, '0')}`
//   filterF('today')()
// }

filterF('all')()
