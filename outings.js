const outingsTable = document.querySelector('table#outings tbody')
const locMap = new Map(locationsData.map(l => [l.id, l]))

let flattenedOutingsData = []

for (const e of outingsData) {
  const loc = locMap.get(e.location_id);
  flattenedOutingsData.push(
    {
      "title": e.title,
      "description": e.description,
      "location": loc,
      "url": e.url,
    }
  )
}

for (const e of flattenedOutingsData) {
  const row = outingsTable.insertRow(0);
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

  addCell(`<a href=${e.url}>${e.title}</a>`);
  addCell(`${e.description}`);
  addCell(`<a href="https://google.com/maps/search/${e.location.address}">${e.location.name}</a><br/><em>(${e.location.location_description})</em>`);
}
