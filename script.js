window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    document.querySelector("#intro").addEventListener("mousedown", toggle);
    document.querySelector("#intro").addEventListener("mouseup", toggle);
    document.querySelector("#intro").addEventListener("touchstart", toggle);
    document.querySelector("#intro").addEventListener("touchend", toggle);
    fetch("/be/be.php").then(response => response.json()).then(data => {
        render(data["result"]["koncerts"]);
        render2(data["result"]["oldkoncerts"], data["result"]["oldkoncerts-count"]);
    })
});

function toggle() {
    document.querySelector("#intro").classList.toggle("active")
}

months = [
    'leden',
    'únor',
    'březen',
    'duben',
    'květen',
    'červen',
    'červenec',
    'srpen',
    'září',
    'říjen',
    'listopad',
    'prosinec'
],
    days = [
        'neděle',
        'pondělí',
        'úterý',
        'středa',
        'čtvrtek',
        'pátek',
        'sobota',

    ];

function render(data) {
    if (!data || data.length === 0) {
        document.querySelector("#koncert-list").innerHTML = `Momentálně nic neplánujeme`;
    }
    html = data.map(element => {
        let date = new Date(element["date"] * 1000)
        element["datumParsed"] = '<i>' + days[date.getDay()] + '</i> ' + date.getDate() + '. ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' <i>' + date.getHours() + ':' + ('00' + date.getMinutes()).slice(-2) + '</i>';
        return element
    }).map(item => {
        item["adresaUlice"] = item["adresaUlice"] || "";
        return item;
    }).map(element => {
        return `<span class=date>${element["datumParsed"]}</span> <div> <b>${element["jmeno"]}</b>  ${element["adresaUlice"]} <b>${element["adresaMesto"]}</b></div> <div>${element["poznamka"]}</div>`
    }).map(item => {
        return "<li>" + item + "</li>";
    });
    if (html.length > 0) {
        document.querySelector("#koncert-list").innerHTML = `<ul id=koncerty-list>${html.join("")}</ul>`;
    }
}

function render2(data, count) {
    document.querySelector("#count").innerHTML = count;
    html = data.map((element, index) => {
        let date = new Date(element["date"] * 1000)
        element["date"] = date
        element["index"] = data.length - index
        element["datumParsed"] = ('00' + date.getDate()).slice(-2) + '. ' + ('00' + (date.getMonth() + 1)).slice(-2) + ' ' + date.getFullYear();
        return element
    }).filter((item, index) => {
        return index < 100
    }).map(item => {
        item["adresaUlice"] = item["adresaUlice"] || "";
        return item;
    }).map(element => {
        return `<div><span class="date-old">${element["datumParsed"]}</span> <b>${element["adresaMesto"]}</b> ${element["jmeno"]} </div>`
    }).map(item => {
        return `<li>${item}</li>`;
    });
    if (html.length > 0) {
        document.querySelector("#koncert-old-list").innerHTML = `<ul id=koncerty-list>${html.join("")}</ul>`;
    }
}