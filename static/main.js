/*
  if (this.restoreGame()) {
        var cached = this.restoreGame();
        this.gameOver = cached.gameOver;
        this.turn = cached.turn;
        this.tokenState = cached.tokenState;
        this.p1 = cached.p1;
        this.p2 = cached.p2;
    }
*/
var timeout = 750;

function makeReq(method, target, retCode, action, data) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onreadystatechange = makeHandler(httpRequest, retCode, action);
    httpRequest.open(method, target);

    if (data) {
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.send(data);
    }
    else {
        httpRequest.send();
    }
}
function makeHandler(httpRequest, retCode, action) {
    function handler() {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === retCode && action != null) {
                action(httpRequest.responseText);
            }
            if (httpRequest.status !== retCode){
                alert("There was a problem");
            }
        }
    }
    return handler;
}
/* example of sending xmlhttprequest
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.open("POST", "/save_state/" + gameId);
    httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    httpRequest.send(data);
*/

    makeReq("GET", "/player_username", 200, setID);
    function setID(responseText) {
        currId = responseText;
        //console.log(currId);
    }
    //self.postGame();
    function poller() {
        makeReq("GET", "/game_state/" + gameId, 200, repopulate);

    }

    function repopulate(responseText) {
        if (responseText != "failed") {
            var serverState = JSON.parse(responseText);
            var flag = 0
            //was thinking about engulfing this entire code section in this if block BUT............. ive spent enough time on this project..................
            if (this.Connect4.turn != serverState.turn) {
                flag = 1;
            }
            //console.log(Connect4);
            Connect4 = serverState;
            p1 = Connect4.p1;
            p2 = Connect4.p2;
            console.log(p1);
            console.log(p2);
            currentPlayer = function () {
                if (p1.birthday > p2.birthday) {
                    //console.log(Connect4.turn);
                    return Connect4.turn % 2 == 0 ? Connect4.p2 : Connect4.p1;
                } else {
                    //console.log(Connect4.turn);
                    return Connect4.turn % 2 == 1 ? Connect4.p1 : Connect4.p2;
                }
            }
            
            //console.log("SERVER STATE");
            //console.log(serverState);
            if (Connect4.gameOver || (p1.tokensRemaining === 0 || p2.tokensRemaining === 0)) {
                var cells;
                var winner;
                winner = document.querySelector('li.player-name.current-player')
                winner.classList.add('winner');
                
            
                var winText = document.getElementById('title').textContent;
                //console.log(winner);
                if(p1.name == winner.textContent){
                    winner = p1;
                }else{
                    winner = p2;
                }
                winText = "Winner is: " + winner.name;
                //console.log(winText);
                document.getElementById('title').textContent = winText;
                //POST THE WINNER TO THE DATABASE
                if (currId == winner.id) {
                    winUrl = "/post_winner/"+gameId+"/"+turn;
                    makeReq("POST", winUrl, 200, null, "winner="+currId);
                }
            
                //make sure columns are unclickable and make sure game over is set for each client
                cells = document.querySelectorAll('td.token');

                cells.forEach(function (item) {
                    item.removeEventListener('mouseenter', toggleCellHover);
                    item.removeEventListener('mouseleave', toggleCellHover);
                    item.classList.remove('token-hover');
                    item.removeEventListener('click', handleColumnClick);
                });
                Connect4.gameOver = true;
            }
                        
            p = currentPlayer();

            //console.log(p1);
            //console.log(p2);
            turn = Connect4.turn;
            if (flag == 1 && !Connect4.gameOver && turn != 1) {
                document.getElementById('gameturn').textContent = Connect4.turn;
                document.querySelectorAll('li.player-name').forEach(function (item) {
                    item.classList.toggle('current-player');
                });
            }
            
            //console.log(p);
            document.getElementById('gameturn').textContent = Connect4.turn;
            //console.log(serverState);
            //var openCells = document.getElementsByClassName("token-white");
            //console.log(openCells);
            //UPDATE COLOR ON BOTH SCREENS
            /* for (var i = 0; i < openCells.length; i++) {
                 for (var j = 0; j < this.Connect4.tokenState.length; j++) {
                     if (openCells[i].dataset.col == this.Connect4.tokenState[j].col && openCells[i].dataset.row == this.Connect4.tokenState[j].row) {
                         if (this.Connect4.tokenState[j].color != null) {
                             console.log("NO MATCH");
                             console.log(openCells[i]);
                             openCells[i].classList.add('token-' + this.Connect4.tokenState[j].color);
                             openCells[i].dataset.color = this.Connect4.tokenState[j].color;
                             openCells[i].classList.remove('token-white');
                             console.log(this.Connect4.tokenState[j].color);
                         }
                     }
                 }
             }//end probably the most terrible way to update a token loop*/
            //new way to update tokens
            for (var i = 0; i < Connect4.tokenState.length; i++) {
                if (Connect4.tokenState[i] != null && Connect4.tokenState[i].color != null) {
                    globalTokenState[i] = Connect4.tokenState[i];
                    //console.log(this.Connect4.tokenState[i].color);
                    //console.log("Global token state: ");
                    //console.log(globalTokenState);
                    
                    a = document.querySelectorAll('[data-col="' + Connect4.tokenState[i].col + '"][data-row="' + Connect4.tokenState[i].row + '"]');
                    //console.log(a);
                    a[0].classList.add('token-' + Connect4.tokenState[i].color);
                    a[0].dataset.color = Connect4.tokenState[i].color;
                    a[0].classList.remove('token-white');
                    //console.log(this.Connect4.tokenState[i].col);
                    //console.log(this.Connect4.tokenState[i].row);
                }
            }
            if(globalTokenState != null){
                Connect4.tokenState = globalTokenState;
            }
            
            /*for (var i = 0; i < Connect4.tokenState.length; i++) {
                if (Connect4.tokenState[i] != null && Connect4.tokenState[i].color != null) {
                    a = document.querySelectorAll('[data-col="' + Connect4.tokenState[i].col + '"][data-row="' + Connect4.tokenState[i].row + '"]');
                    //console.log(a);
                    a[0].classList.add('token-' + Connect4.tokenState[i].color);
                    a[0].dataset.color = Connect4.tokenState[i].color;
                    a[0].classList.remove('token-white');
                }
            }*/
            //finish token
            playerdata = document.getElementsByClassName('remaining');

            //console.log(this.Connect4.p1);

            playerdata[0].textContent = p1.tokensRemaining;
            playerdata[1].textContent = p2.tokensRemaining;

            playerdata = document.getElementsByClassName('win-count');
            //console.log(document.getElementById('gameturn').textContent);
            playerdata[0].textContent = p1.remainingToWin;
            playerdata[1].textContent = p2.remainingToWin;

            //console.log(this.Connect4.turn);

            /*console.log("PLAYERS");
            console.log(p1);
            console.log(p2);
            console.log("END PLAYERS");*/
            document.getElementById('p1-display').querySelector('.remaining').textContent = p1.tokensRemaining;
            document.getElementById('p1-display').querySelector('.win-count').textContent = p1.remainingToWin;
            document.getElementById('p2-display').querySelector('.remaining').textContent = p2.tokensRemaining;
            document.getElementById('p2-display').querySelector('.win-count').textContent = p2.remainingToWin;

            //lastly save it to local storage
            localStorage.setItem('game_' + gameId, JSON.stringify(Connect4));

        } 
        else {
            //if there's no game post a new game to the server
            /*postNewGame = function (connect4) {
                var httpRequest = new XMLHttpRequest();

                if (!httpRequest) {
                    alert('Giving up :( Cannot create an XMLHTTP instance');
                    return false;
                }
                console.log("POSTING NEW GAME");
                //console.log(gameId);
                httpRequest.open("POST", "/save_state/" + gameId);
                //console.log(JSON.stringify(connect4));
                httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                data = "state=" + JSON.stringify(connect4);
                httpRequest.send(data);
            }*/
            newGame = new Connect4(p1, p2, gameId);
            makeReq("POST", "/save_state/"+gameId, 200, null, "state="+JSON.stringify(newGame));
            //postNewGame(newGame);
        }
        if (!Connect4.gameOver) {
            timeoutID = window.setTimeout(poller, timeout);
        }
        return responseText;
    }
    setTimeout(poller, timeout);

    function toggleCellHover(e) {
        var c = e.currentTarget.dataset.col;
        var tds = document.querySelectorAll('td.token[data-col="' + c + '"]');
        tds.forEach(function (item) {
            item.classList.toggle('token-hover');
        });
    }

    this.cacheGame = function () {
        var state = JSON.stringify(this);

        localStorage.setItem('game_' + this.gameId, state);
    }

    var handleColumnClick = function (self) {
        return function (e) {
            var el = e.currentTarget;
            self.turn = document.getElementById('gameturn').textContent;
            //var d = p.isRedToken ? document.getElementById('p1-display') : document.getElementById('p2-display');
            if (currId == p.id) {
                // place token
                var openCells = document.querySelectorAll('td.token-white.token[data-col="' + el.dataset.col + '"]');
                var flag = 0;
                if(globalTokenState != null){
                    self.tokenState = globalTokenState;
                }
                if (openCells.length > 0) {
                    var o = openCells[openCells.length - 1];
                    p.isRedToken ? o.classList.add('token-red') : o.classList.add('token-black');
                    p.isRedToken ? o.dataset.color = 'red' : o.dataset.color = 'black';
                    o.classList.remove('token-white');

                    var tokenStateUpdate = self.tokenState.filter(function (item) {
                        return item.row == o.dataset.row && item.col == o.dataset.col;
                    })[0];

                    if(tokenStateUpdate != null){
                        tokenStateUpdate.color = o.dataset.color;
                        tokenStateUpdate.player = p;
                    }else{
                        flag = 1;
                        alert("Please refresh the page.")
                    }

                    // Check win conditions
                    self.checkTokenStatus();

                    //var d = p.isRedToken ? document.getElementById('p1-display') : document.getElementById('p2-display');
                    // Subtract Token and update display
                    p.tokensRemaining = p.tokensRemaining - 1;
                    //d.querySelector('.remaining').textContent = p.tokensRemaining;
                    //d.querySelector('.win-count').textContent = p.remainingToWin;
                    /*if(self.gameOver) {
                        p.winner = true;
                        document.querySelector('li.player-name.current-player').classList.add('winner');
                        self.titleWin();
                    }*/

                    //make sure everything is set before posting the game
                    if (self.p1.id == p.id) {
                        self.p1 = p;
                        self.p2 = p2;
                    } else {
                        self.p2 = p;
                        self.p1 = p1;
                    }
                    self.turn++;
                    document.getElementById('gameturn').textContent = self.turn;
                }
                if(flag != 1){
                    self.postGame();
                }
                //self.cacheGame();
            }
        }
    }(this);

    this.checkTokenStatus = function () {

        var winCondition = false;

        this.tokenState.forEach(function (item, idx, arr) {
            var count = 0;
            var currentRow = item.row;
            var currentCol = item.col;
            var color = item.color;

            if (color != undefined) {
                var rowRangeStart = currentRow - 3 <= 0 ? 0 : currentRow - 3;
                var rowRangeEnd = currentRow + 3 >= 5 ? 5 : currentRow + 3;

                var colRangeStart = currentCol - 3 <= 0 ? 0 : currentCol - 3;
                var colRangeEnd = currentCol + 3 >= 6 ? 6 : currentCol + 3;

                var rowCount = arr.filter(function (rItem) {
                    return rowRangeStart <= rItem.row && rItem.row <= rowRangeEnd && rItem.col == currentCol;
                }).reduce(function (agg, v) {
                    if (v.color == color && color != undefined) {
                        return agg + 1;
                    }
                    return 0;
                }, count);

                var colCount = arr.filter(function (cItem) {
                    return colRangeStart <= cItem.col && cItem.col <= colRangeEnd && cItem.row == currentRow;
                }).reduce(function (agg, v) {
                    if (v.color == color && color != undefined) {
                        return agg + 1;
                    }
                    return 0;
                }, count);

                function getDiagonalPoints(cr, cc, height, width, leftToRight) {
                    var diagPoints = new Array();
                    if (leftToRight) {
                        for (var diag = 0; diag <= width + height - 2; diag++) {
                            points = new Array();
                            for (var j = 0; j <= diag; j++) {
                                var i = diag - j;
                                if (i < height && j < width) {
                                    points.push([i, j]);
                                }
                            }
                            if (points.some(function (item) {
                                return JSON.stringify(item).includes(JSON.stringify([cr, cc]));
                            })) {
                                diagPoints.push(points);
                            }
                        }
                    } else {
                        for (var diag = width + height - 2; diag >= 0; diag--) {
                            points = new Array();
                            for (var j = 0; j <= diag; j++) {
                                var i = diag - j;
                                var y = width - j;
                                if (i < height && y < width) {
                                    points.push([i, y]);
                                }
                            }
                            if (points.some(function (item) {
                                return JSON.stringify(item).includes(JSON.stringify([cr, cc]));
                            })) {
                                diagPoints.push(points);
                            }
                        }
                    }
                    return diagPoints;
                }

                var leftToRightPoints = getDiagonalPoints(currentRow, currentCol, 6, 7, true);
                var rightToLeftPoints = getDiagonalPoints(currentRow, currentCol, 6, 7, false);

                function countDiags(diags) {
                    return arr.filter(function (dItem) {
                        return diags.some(function (pointCheck) {
                            return JSON.stringify(pointCheck).includes(JSON.stringify([dItem.row, dItem.col]));
                        });
                    }).reduce(function (agg, v) {
                        if (v.color == color && color != undefined) {
                            return agg + 1;
                        }
                        return 0;
                    }, count);
                }

                var lDiagCount = countDiags(leftToRightPoints);
                var rDiagCount = countDiags(rightToLeftPoints);

                // console.log(lDiagCount);

                var remaining = 4 - Math.max(rowCount, colCount, lDiagCount, rDiagCount);
                // item.player.remainingToWin = 4 - Math.max(rowCount, colCount, lDiagCount, rDiagCount);

                item.player.remainingToWin = remaining <= item.player.remainingToWin ? remaining : item.player.remainingToWin;

                if (item.player.remainingToWin === 0) {
                    //console.log(item.player.name + " WINS!");
                    winCondition = true;
                }
            }

        });

        this.gameOver = winCondition;
    }

    this.titleWin = function () {
        if (this.gameOver) {
            var winText = document.getElementById('title').textContent;
            if (this.p1.winner) {
                winText = winText + ": " + this.p1.name + " Wins!";
            } else {
                winText = winText + ": " + this.p2.name + " Wins!";
            }

            document.getElementById('title').textContent = winText;
        }
    }

    this.makePlayerDisplay = function (player) {
        var displayEl = player.isRedToken ? document.getElementById('p1-display') : document.getElementById('p2-display');
        var ulel = document.createElement('ul');
        ulel.classList.add('player-data')

        var liUser = document.createElement('li');
        liUser.textContent = player.name;
        liUser.classList.add('player-name')
        if (player == this.currentPlayer() && !this.gameOver) {
            liUser.classList.add('current-player');
        }
        if (player.winner && this.gameOver) {
            liUser.classList.add('current-player', 'winner');
            this.titleWin();
        }
        ulel.appendChild(liUser);

        liTurnsRemaining = document.createElement('li');
        liTurnsRemaining.innerHTML = "Remaining Tokens: <span class='remaining'>" + player.tokensRemaining + "</span>";
        ulel.appendChild(liTurnsRemaining);

        liLeftToWin = document.createElement('li');
        liLeftToWin.innerHTML = "Left to Win: <span class='win-count'>" + player.remainingToWin + "</span>"
        ulel.appendChild(liLeftToWin);

        displayEl.appendChild(ulel);
    }

    this.makeBoard = function () {

        var boardCanvas = document.getElementById('gameboard');

        var table = document.createElement('table');
        var newGame = this.tokenState.length === 0;
        table.id = 'connect-table'
        rows = 6;
        columns = 7;

        for (var i = 0; i < rows; i++) {
            var trEl = document.createElement('tr');
            for (var j = 0; j < columns; j++) {
                var tdEl = document.createElement('td');
                var tokenData;
                if (newGame) {
                    this.tokenState.push({ row: i, col: j, color: undefined, player: undefined });
                    globalTokenState.push({ row: i, col: j, color: undefined, player: undefined });
                } else {
                    tokenData = this.tokenState.filter(function (item) {
                        return item.row == i && item.col == j;
                    })
                }
                if (tokenData && tokenData[0]) {
                    var tmpColor = tokenData[0].color ? tokenData[0].color : 'white'
                    tdEl.dataset.color = tmpColor;
                    tdEl.classList.add('token-' + tmpColor, 'token');
                } else {
                    tdEl.dataset.color = 'white';
                    tdEl.classList.add('token-white', 'token');
                }
                tdEl.dataset.row = i;
                tdEl.dataset.col = j;
                if (!this.gameOver) {
                    tdEl.addEventListener('mouseenter', toggleCellHover);
                    tdEl.addEventListener('mouseleave', toggleCellHover);
                    tdEl.addEventListener('click', handleColumnClick);
                }
                trEl.append(tdEl);
            }
            trEl.classList.add('token-row');
            table.append(trEl);
        }
        boardCanvas.append(table);
    }

    document.addEventListener('DOMContentLoaded', function (self) {
        return function (e) {
            self.makeBoard();
            self.makePlayerDisplay(self.p1);
            self.makePlayerDisplay(self.p2);
            document.getElementById('gameturn').textContent = self.turn;
        }
    }(this));
}