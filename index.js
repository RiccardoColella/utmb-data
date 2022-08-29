import fetch from 'node-fetch';
import fs from 'fs';
import jsdom from 'jsdom';

const athletsToFetch = 1789 // total number of finishers;
const urlFinalRankings = `https://utmblive-api.utmb.world/races/utmb/progressive?type=FINAL_RANKING&page=0&limit=${athletsToFetch}`;
const optionsFinalRankings = {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-IT,en;q=0.9,it-IT;q=0.8,it;q=0.7,en-GB;q=0.6,en-US;q=0.5,de;q=0.4",
        "content-type": "application/json",
        "x-tenant": "utmb",
        "Referer": "https://live.utmb.world/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
};

// Fetching the rankings
fetch(urlFinalRankings, optionsFinalRankings)
    .then(res => res.text())
    .then(text => JSON.parse(text))
    .then(json => JSON.stringify(json, 4, 2))
    .then(text => fs.writeFileSync("./data/rankings.json", text));

// looping across all the athlets
for (let currAthlete = 1; currAthlete <= athletsToFetch; currAthlete++) {
    // retrieving athlete lap times
    let urlSingleAthlete = `https://live.utmb.world/utmb/runners/${currAthlete}`;
    fetch(urlSingleAthlete)
        .then(res => res.text())
        .then(html => {        
            const dom = new jsdom.JSDOM(html);
            return dom.window.document.querySelector("#__NEXT_DATA__").textContent;
        })
        .then(text => JSON.parse(text))
        .then(json => JSON.stringify(json, 4, 2))
        .then(text => fs.writeFileSync(`./data/athletes/${currAthlete}.json`, text));    
}