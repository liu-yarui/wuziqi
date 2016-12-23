window.addEventListener("load",chessBoard,false);

var chess = document.getElementById("chess");
var ctx = chess.getContext("2d");
ctx.strokeStyle = "#bababa";
//判断游戏是否结束
var over = false;
//判断是否是玩家落子
var m = true;
//记录棋盘的落子情况，0表示没有棋子，1表示黑棋，2表示白旗
var chessManArray = [];
//初始化棋盘落子
for(var i=0;i<21;i++){
    chessManArray[i] = [];
    for(var j=0;j<21;j++){
        chessManArray[i][j] = 0;
    }
}

//算法实现
//赢法数组
var wins = [];
for(var i=0;i<21;i++){
    wins[i] = [];
    for(var j=0;j<21;j++){
        wins[i][j] = [];
    }
}
//赢法的种类
var count = 0;
//横线赢法
for(var i=0;i<21;i++){
    for(var j=0;j<17;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count] = true;
        }
        count++;
    }
}
//竖线赢法
for(var i=0;i<21;i++){
    for(var j=0;j<17;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count] = true;
        }
        count++;
    }
}
//斜线赢法
for(var i=0;i<17;i++){
    for(var j=0;j<17;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count] = true;
        }
        count++;
    }
}
//反斜线赢法
for(var i=0;i<17;i++){
    for(var j=20;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count] = true;
        }
        count++;
    }
}
console.log(count);

//赢法统计数组
var myWin = [];
var comWin = [];

for(var i=0;i<count;i++){
    myWin[i] = 0;
    comWin[i] = 0;
}


//棋盘划线
function chessBoard(){
    for(var i=0;i<21;i++){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(20,i*23+20);
        ctx.lineTo(480,i*23+20);
        ctx.stroke();
        ctx.moveTo(i*23+20,20);
        ctx.lineTo(i*23+20,480);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

//棋子造型
function chessMan(i,j,m){
    ctx.beginPath();
    ctx.arc(i*23+20,j*23+20,10,0,360*Math.PI/180,false);
    var gradient = ctx.createRadialGradient(i*23+20,j*23+20,10,i*23+20,j*23+20,0);
    if(m){
        gradient.addColorStop(0,"#0a0a0a");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#d1d1d1");
        gradient.addColorStop(1,"#f9f9f9");
    }
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

chess.onclick = function(e){
    if(over){
        return;
    }
    if(!m){
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x/23);
    var j = Math.floor(y/23);
    if(chessManArray[i][j] == 0){
        chessMan(i,j,m);
        chessManArray[i][j] = 1;
        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                comWin[k] = 10;
                if(myWin[k] == 5){
                    setTimeout(function(){window.alert("您儿赢咧");},100);
                    over = true;
                }
            }
        }
        if(!over){
            m = !m;
            comAI();
        }
    }
}


var comAI = function(){
    var myScore = [];
    var comScore = [];
    var max = 0;
    var xPos = 0, yPos = 0
    for(var i=0;i<21;i++){
        myScore[i] = [];
        comScore[i] = [];
        for(var j=0;j<21;j++){
            myScore[i][j] = 0;
            comScore[i][j] = 0;
        }
    }
    for(var i=0;i<21;i++){
        for(var j=0;j<21;j++){
            if(chessManArray[i][j] == 0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200;
                        }else if(myWin[k] == 2){
                            myScore[i][j] += 400;
                        }else if(myWin[k] == 3){
                            myScore[i][j] += 2000;
                        }else if(myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }
                        if(comWin[k] == 1){
                            comScore[i][j] += 250;
                        }else if(comWin[k] == 2){
                            comScore[i][j] += 600;
                        }else if(comWin[k] == 3){
                            comScore[i][j] += 3000;
                        }else if(comWin[k] == 4){
                            comScore[i][j] += 15000;
                        }
                    }
                }
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    xPos = i;
                    yPos = j;
                }else if(myScore[i][j] == max){
                    if(comScore[i][j] > comScore[xPos][yPos]){
                        xPos = i;
                        ypos = j;
                    }
                }
                if(comScore[i][j] > max){
                    max = comScore[i][j];
                    xPos = i;
                    yPos = j;
                }else if(comScore[i][j] == max){
                    if(myScore[i][j] > myScore[xPos][yPos]){
                        xPos = i;
                        ypos = j;
                    }
                }
            }
        }
    }
    chessMan(xPos,yPos,false);
    chessManArray[xPos][yPos] = 2;
    for(var k=0;k<count;k++){
        if(wins[xPos][yPos][k]){
            comWin[k]++;
            myWin[k] = 10;
            if(comWin[k] == 5){
                setTimeout(function(){window.alert("计算机儿赢咧");},100);
                over = true;
            }
        }
    }
    if(!over){
        m = !m;
    }
}