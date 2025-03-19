var over = false
var me = true //我
var _nowi = 0,
    _nowj = 0 //记录自己下棋的坐标
var _compi = 0,
    _compj = 0 //记录计算机当前下棋的坐标
var _myWin = [],
    _compWin = [] //记录我，计算机赢的情况
var backAble = false,
    returnAble = false
var resultTxt = document.getElementById('result-wrap')
var chressBord = [] //棋盘
for (var i = 0; i < 15; i++) {
    chressBord[i] = []
    for (var j = 0; j < 15; j++) {
        chressBord[i][j] = 0
    }
}
//赢法的统计数组
var myWin = []
var computerWin = []
//赢法数组
var wins = []
for (var i = 0; i < 15; i++) {
    wins[i] = []
    for (var j = 0; j < 15; j++) {
        wins[i][j] = []
    }
}
var count = 0 //赢法总数
//横线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true
        }
        count++
    }
}
//竖线赢法
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true
        }
        count++
    }
}
//正斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true
        }
        count++
    }
}
//反斜线赢法
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true
        }
        count++
    }
}
// debugger;
for (var i = 0; i < count; i++) {
    myWin[i] = 0
    _myWin[i] = 0
    computerWin[i] = 0
    _compWin[i] = 0
}
var chess = document.getElementById('chess')
var context = chess.getContext('2d')
context.strokeStyle = '#bfbfbf' //边框颜色
var backbtn = document.getElementById('goback')
var returnbtn = document.getElementById('return')
window.onload = function () {
    drawChessBoard() // 画棋盘
}
document.getElementById('restart').onclick = function () {
    window.location.reload()
}
// 我，下棋
chess.onclick = function (e) {
    if (over) {
        return
    }
    if (!me) {
        return
    }
    // 悔棋功能可用
    backbtn.className = backbtn.className.replace(
        new RegExp('(\\s|^)unable(\\s|$)'),
        ' '
    )
    var x = e.offsetX
    var y = e.offsetY
    var i = Math.floor(x / 30)
    var j = Math.floor(y / 30)
    _nowi = i
    _nowj = j
    if (chressBord[i][j] == 0) {
        oneStep(i, j, me)
        chressBord[i][j] = 1 //我，已占位置

        for (var k = 0; k < count; k++) {
            // 将可能赢的情况都加1
            if (wins[i][j][k]) {
                // debugger;
                myWin[k]++
                _compWin[k] = computerWin[k]
                computerWin[k] = 6 //这个位置对方不可能赢了
                if (myWin[k] == 5) {
                    // window.alert('你赢了');
                    resultTxt.innerHTML = '恭喜，你赢了！'
                    over = true
                }
            }
        }
        if (!over) {
            me = !me
            computerAI()
        }
    }
}
// 悔棋
backbtn.onclick = function (e) {
    if (!backAble) {
        return
    }
    over = false
    me = true
    // resultTxt.innerHTML = 'o(╯□╰)o，悔棋中';
    // 撤销悔棋功能可用
    returnbtn.className = returnbtn.className.replace(
        new RegExp('(\\s|^)unable(\\s|$)'),
        ' '
    )
    // 我，悔
    chressBord[_nowi][_nowj] = 0 //我，已占位置 还原
    minusStep(_nowi, _nowj) //销毁棋子

    for (var k = 0; k < count; k++) {
        // 将可能赢的情况都减1
        if (wins[_nowi][_nowj][k]) {
            myWin[k]--
            computerWin[k] = _compWin[k] //这个位置对方可能赢
        }
    }
    // 计算机相应的悔棋
    chressBord[_compi][_compj] = 0 //计算机，已占位置 还原
    minusStep(_compi, _compj) //销毁棋子

    for (var k = 0; k < count; k++) {
        // 将可能赢的情况都减1
        if (wins[_compi][_compj][k]) {
            computerWin[k]--
            myWin[k] = _myWin[i] //这个位置对方可能赢
        }
    }
    resultTxt.innerHTML = '--我爱五子棋--'
    returnAble = true
    backAble = false
}
// 撤销悔棋
returnbtn.onclick = function (e) {
    if (!returnAble) {
        return
    }
    // 我，撤销悔棋
    chressBord[_nowi][_nowj] = 1 //我，已占位置
    oneStep(_nowi, _nowj, me)
    for (var k = 0; k < count; k++) {
        if (wins[_nowi][_nowj][k]) {
            myWin[k]++
            _compWin[k] = computerWin[k]
            computerWin[k] = 6 //这个位置对方不可能赢
        }
        if (myWin[k] == 5) {
            resultTxt.innerHTML = '恭喜，你赢了！'
            over = true
        }
    }
    // 计算机撤销相应的悔棋
    chressBord[_compi][_compj] = 2 //计算机，已占位置
    oneStep(_compi, _compj, false)
    for (var k = 0; k < count; k++) {
        // 将可能赢的情况都减1
        if (wins[_compi][_compj][k]) {
            computerWin[k]++
            _myWin[k] = myWin[k]
            myWin[k] = 6 //这个位置对方不可能赢
        }
        if (computerWin[k] == 5) {
            resultTxt.innerHTML =
                'o(╯□╰)o，计算机赢了，继续加油哦！'
            over = true
        }
    }
    returnbtn.className += '' + 'unable'
    returnAble = false
    backAble = true
}

// 计算机下棋
var computerAI = function () {
    var myScore = []
    var computerScore = []
    var max = 0
    var u = 0,
        v = 0
    for (var i = 0; i < 15; i++) {
        myScore[i] = []
        computerScore[i] = []
        for (var j = 0; j < 15; j++) {
            myScore[i][j] = 0
            computerScore[i][j] = 0
        }
    }
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
            if (chressBord[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000
                        }

                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 220
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 420
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2100
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000
                        }
                    }
                }

                if (myScore[i][j] > max) {
                    max = myScore[i][j]
                    u = i
                    v = j
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i
                        v = j
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j]
                    u = i
                    v = j
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i
                        v = j
                    }
                }
            }
        }
    }
    _compi = u
    _compj = v
    oneStep(u, v, false)
    chressBord[u][v] = 2 //计算机占据位置
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++
            _myWin[k] = myWin[k]
            myWin[k] = 6 //这个位置对方不可能赢了
            if (computerWin[k] == 5) {
                resultTxt.innerHTML =
                    'o(╯□╰)o，计算机赢了，继续加油哦！'
                over = true
            }
        }
    }
    if (!over) {
        me = !me
    }
    backAble = true
    returnAble = false
    var hasClass = new RegExp('unable').test(
        '' + returnbtn.className + ''
    )
    if (hasClass) {
        returnbtn.className += '' + 'unable'
    }
}
//绘画棋盘
var drawChessBoard = function () {
    for (var i = 0; i < 15; i++) {
        context.moveTo(15 + i * 30, 15)
        context.lineTo(15 + i * 30, 435)
        context.stroke()
        context.moveTo(15, 15 + i * 30)
        context.lineTo(435, 15 + i * 30)
        context.stroke()
    }
}
//画棋子
var oneStep = function (i, j, me) {
    context.beginPath()
    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI) // 画圆
    context.closePath()
    //渐变
    var gradient = context.createRadialGradient(
        15 + i * 30 + 2,
        15 + j * 30 - 2,
        13,
        15 + i * 30 + 2,
        15 + j * 30 - 2,
        0
    )
    if (me) {
        gradient.addColorStop(0, '#0a0a0a')
        gradient.addColorStop(1, '#636766')
    } else {
        gradient.addColorStop(0, '#d1d1d1')
        gradient.addColorStop(1, '#f9f9f9')
    }
    context.fillStyle = gradient
    context.fill()
}
//销毁棋子
var minusStep = function (i, j) {
    //擦除该圆
    context.clearRect(i * 30, j * 30, 30, 30)
    // 重画该圆周围的格子
    context.beginPath()
    context.moveTo(15 + i * 30, j * 30)
    context.lineTo(15 + i * 30, j * 30 + 30)
    context.moveTo(i * 30, j * 30 + 15)
    context.lineTo((i + 1) * 30, j * 30 + 15)

    context.stroke()
}