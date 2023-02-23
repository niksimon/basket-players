let allData = {};
let allRoundsData = {};
let roundData = {};
let currentData = {};
let selectedRoundsCount = 0;

for(let i = 1; i <= rounds; i++) {
    const label = document.createElement("label");
    label.setAttribute("for", `round${i}`);
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("id", `round${i}`);
    checkBox.setAttribute("value", i);
    const span = document.createElement("span");
    span.innerText = i;
    label.appendChild(checkBox);
    label.appendChild(span);
    document.getElementById("checkboxes").appendChild(label);
}

for(const team of teams) {
    const opt = document.createElement("option");
    opt.value = team;
    opt.innerText = team;
    document.getElementById("team").appendChild(opt);
}

fetch(`${league}/season6/all-data.json`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        allData = data.all;
        allRoundsData = data.rounds;
        currentData = allData;
        appendData();
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

function appendData() {
    let round = selectedRoundsCount === 1 ?  "one" : "all";
    const team = document.getElementById("team").value;
    const sortBy = document.getElementById("sort").value;
    let players = Object.values(currentData);     

    if(team !== "all") {
        players = players.filter(p => p.team === team);
    }

    if(sortBy === "points") {
        players.sort((a, b) => b.points === a.points ? b.avgPoints - a.avgPoints : b.points - a.points);
    }
    else if(sortBy === "numAsc") {
        players.sort((a, b) => +a.num === +b.num ? a.name.localeCompare(b.name) : a.num - b.num);
    }
    else if(sortBy === "avgInd") {
        players.sort((a, b) => {
            if(round === "all") {
                if(b.indList.length < 3 && a.indList.length < 3) return b.avgInd - a.avgInd;
                if(b.indList.length < 3) return -1;
                if(a.indList.length < 3) return 1;
            }
            //return (1 * b.avgInd + b.indList.length * 2) - (1 * a.avgInd + a.indList.length * 2);
            return b.avgInd - a.avgInd;
        });
    }
    else if(sortBy === "threes") {
        players.sort((a, b) => b.threes[0] === a.threes[0] ? a.threes[1] - b.threes[1] : b.threes[0] - a.threes[0]);
    }
    else if(sortBy === "assists") {
        players.sort((a, b) => b.assists === a.assists ? b.avgAssists - a.avgAssists : b.assists - a.assists);
    }
    else if(sortBy === "steals") {
        players.sort((a, b) => b.steals === a.steals ? b.avgSteals - a.avgSteals : b.steals - a.steals);
    }
    else if(sortBy === "rebounds") {
        players.sort((a, b) => (b.rebounds[0] + b.rebounds[1]) === (a.rebounds[0] + a.rebounds[1]) ? b.avgRebounds - a.avgRebounds : (b.rebounds[0] + b.rebounds[1]) - (a.rebounds[0] + a.rebounds[1]));
    }
    else if(sortBy === "blocks") {
        players.sort((a, b) => b.blocks === a.blocks ? b.avgBlocks - a.avgBlocks : b.blocks - a.blocks);
    }
    else if(sortBy === "attendance") {
        players.sort((a, b) => b.gamesCount === a.gamesCount ? a.num - b.num : b.gamesCount - a.gamesCount);
    }

    const tableBody = document.getElementById("table-body");
    const tableHead = document.getElementById("table-head");

    let content = '';
    let i = 1;

    if(round === "all") {
        tableHead.innerHTML = `<tr>
                        <th>#</th>
                        <th>No.</th>
                        <th>Name / Team</th>
                        <th>Attendance</th>
                        <th>Points</th>
                        <th>Avg<br>points</th>
                        <th>Total<br>points</th>
                        <th>Ind</th>
                        <th>Avg<br>Ind</th>
                        <th>3 points</th>
                        <th>Assists</th>
                        <th>Avg<br>Assists</th>
                        <th>Steals</th>
                        <th>Avg<br>Steals</th>
                        <th colspan="3">Rebounds<br>D O T</th>
                        <th>Avg<br>Rebounds</th>
                        <th>Blocks</th>
                        <th>Avg<br>Blocks</th>
                    </tr>`;
        for(const player of players) {
            content += `<tr>
                    <td width="35" style="max-width:35px; min-width:35px; width:35px;">${i++}</td>
                    <td width="35" style="max-width:35px; min-width:35px; width:35px;">${player.num}</td>
                    <td style='text-align:left'><span style='font-weight:bold;'>${player.name}</span><br><span style='font-size:0.8em;'>${player.team}</span></td>
                    <td>${player.gamesCount}</th>
                    <td style='text-align:left'>${player.pointsList}</td>
                    <td>${player.avgPoints}</td>
                    <td>${player.points}</td>
                    <td style='text-align:left'>${player.indList}</td>
                    <td>${player.avgInd}</td>
                    <td>${player.threes[0]}/${player.threes[1]} ${player.threes[1] === 0 ? '0' : Math.floor((player.threes[0]/player.threes[1])*100)}%</td>
                    <td>${player.assists}</td>
                    <td>${player.avgAssists}</td>
                    <td>${player.steals}</td>
                    <td>${player.avgSteals}</td>
                    <td>${player.rebounds[0]}</td>
                    <td>${player.rebounds[1]}</td>
                    <td>${player.rebounds[0] + player.rebounds[1]}</td>
                    <td>${player.avgRebounds}</td>
                    <td>${player.blocks}</td>
                    <td>${player.avgBlocks}</td>
                    </tr>`;
        }
    }
    else {
        tableHead.innerHTML = `<tr>
                        <th>#</th>
                        <th>No.</th>
                        <th>Name / Team</th>
                        <th>Points</th>
                        <th>Ind</th>
                        <th>3 points</th>
                        <th>Assists</th>
                        <th>Steals</th>
                        <th colspan="3">Rebounds<br>D O T</th>
                        <th>Blocks</th>
                    </tr>`;
        for(const player of players) {
            content += `<tr>
                    <td width="35" style="max-width:35px; min-width:35px; width:35px;">${i++}</td>
                    <td width="35" style="max-width:35px; min-width:35px; width:35px;">${player.num}</td>
                    <td style='text-align:left'><span style='font-weight:bold;'>${player.name}</span><br><span style='font-size:0.8em;'>${player.team}</span></td>
                    <td>${player.points}</td>
                    <td>${player.avgInd}</td>
                    <td>${player.threes[0]}/${player.threes[1]} ${player.threes[1] === 0 ? '0' : Math.floor((player.threes[0]/player.threes[1])*100)}%</td>
                    <td>${player.assists}</td>
                    <td>${player.steals}</td>
                    <td>${player.rebounds[0]}</td>
                    <td>${player.rebounds[1]}</td>
                    <td>${player.rebounds[0] + player.rebounds[1]}</td>
                    <td>${player.blocks}</td>
                    </tr>`;
        }
    }

    tableBody.innerHTML = content;
}

let expanded = false;

document.getElementById("selectBox").addEventListener("click", () => {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
});

document.getElementById("checkboxes").addEventListener("click", (e) => {
    if(e.target.tagName.toLowerCase() === 'input'){
        let selectedRounds = [];
        for(let i = 1; i <= rounds; i++) {
            if(document.getElementById(`round${i}`).checked) {
                selectedRounds.push(i);
            }
        }

        if(selectedRounds.length === 0 || selectedRounds.length === rounds) {
            currentData = allData;
        }
        else {
            const newData = JSON.parse(JSON.stringify(allRoundsData[selectedRounds[0]]));
            for(let i = 1; i < selectedRounds.length; i++) {
                const currentRound = allRoundsData[selectedRounds[i]];
                for(const player in currentRound) {
                    if(newData[player] === undefined) {
                        newData[player] = JSON.parse(JSON.stringify(currentRound[player]));
                    }
                    else {
                        const points = currentRound[player].points;
                        const ind = currentRound[player].avgInd;
                        const threes = [currentRound[player].threes[0], currentRound[player].threes[1]];
                        const assists = currentRound[player].assists;
                        const steals = currentRound[player].steals;
                        const rebounds = [currentRound[player].rebounds[0], currentRound[player].rebounds[1]];
                        const blocks = currentRound[player].blocks;

                        newData[player].gamesCount++;
                        newData[player].pointsList.push(points);
                        newData[player].points += points;
                        newData[player].avgPoints = (newData[player].points / newData[player].gamesCount).toFixed(2);
                        newData[player].indList.push(ind);
                        newData[player].avgInd = (newData[player].indList.reduce((a, c) => a + c, 0) / newData[player].gamesCount).toFixed(2);
                        newData[player].threes[0] += threes[0];
                        newData[player].threes[1] += threes[1];
                        newData[player].assistsList.push(assists);
                        newData[player].assists += assists;
                        newData[player].avgAssists = (newData[player].assists / newData[player].gamesCount).toFixed(2);
                        newData[player].stealsList.push(steals);
                        newData[player].steals += steals;
                        newData[player].avgSteals = (newData[player].steals / newData[player].gamesCount).toFixed(2);
                        newData[player].rebounds[0] += rebounds[0];
                        newData[player].rebounds[1] += rebounds[1];
                        newData[player].avgRebounds = ((newData[player].rebounds[0]+newData[player].rebounds[1])/ newData[player].gamesCount).toFixed(2);
                        newData[player].blocks += blocks;
                        newData[player].avgBlocks = (newData[player].blocks / newData[player].gamesCount).toFixed(2);
                    }
                }
            }
            currentData = newData;
        }
        selectedRoundsCount = selectedRounds.length;
        appendData();
    }
});

document.getElementById("uncheckAll").addEventListener("click", () => {
    if(selectedRoundsCount === 0) {
        for(let i = 1; i <= rounds; i++) {
            document.getElementById(`round${i}`).checked = true;
        }
        selectedRoundsCount = rounds;
    }
    else {
        for(let i = 1; i <= rounds; i++) {
            document.getElementById(`round${i}`).checked = false;
        }
        selectedRoundsCount = 0;
    }
    currentData = allData;
    appendData();
});

// document.getElementById("round").addEventListener("change", (e) => {
//     const round = e.target.value;
//     if(round !== "all") {
//         if(roundData[round] === undefined) {
//             fetch(`${league}/season6/${round}.json`)
//                 .then(function (response) {
//                     return response.json();
//                 })
//                 .then(function (data) {
//                     currentData = data;
//                     roundData[round] = data;
//                     appendData();
//                 })
//                 .catch(function (err) {
//                     console.log('error: ' + err);
//                 });
//         }
//         else {
//             currentData = roundData[round];
//             appendData();
//         }
//     }
//     else {
//         currentData = allData;
//         appendData();
//     }
// });

document.getElementById("team").addEventListener("change", (e) => {
    appendData();
});

document.getElementById("sort").addEventListener("change", (e) => {
    appendData();
});