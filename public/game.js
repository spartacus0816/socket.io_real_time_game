
var myGamePiece;
let bullets = [];
let myinfo;
var items = [];
let shooters = [];
let enermies = [];
let username = '';
let myip = '';
let teamState={};
const imoticon = ["🤣","😍","😴","😫","😜","😭","🤬","👊","🥺", "🤐", ""];
let itemlist = [];

let aniText;


function startGame() {
  username = document.getElementById("username").value;
  const usercolor = document.getElementById("usercolor").value;
  let usergroup = document.getElementById("usergroup").value;
  const userDiv = document.getElementById("userInput");
  userDiv.innerHTML = "";
  if(username == "") username="player";
  if (usergroup == 0) {
    console.log(teamState);
    if(teamState.redTeam >= teamState.blueTeam) usergroup = 2;
    else usergroup = 1;
  }
    sendName(username, usercolor, usergroup);
    myGameArea.start();
}

const generateItem = () => {
  for(let i = 0; i< 100; i++)
  {
    let posX = Math.floor(Math.random() * 4000);
    let posY = Math.floor(Math.random() * 4000);
    let newitem = new item(posX, posY, "tomato", 5);
    items.push(newitem);
  }
};

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        // this.canvas.style.cursor = "none"; //hide the original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.timeOut = 0;
        this.areaPos = {x:'0', y:'0'};
        generateItem();

        this.interval = setInterval(updateGameArea, 25);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })

        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })

        window.addEventListener('mousemove', function (e) {
          myGameArea.x = e.pageX;
          myGameArea.y = e.pageY;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop : function (){
      clearInterval(interval);
    }
}

function item(x, y, color, r){
  this.x = x;
  this.y = y;
  this.r = r;
  this.genTime = 150;
  
  this.update = () => {
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x - myGameArea.areaPos.x, this.y - myGameArea.areaPos.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
  }

}

function upItem(x, y, type, r){
  this.x = x - myGameArea.areaPos.x;
  this.y = y - myGameArea.areaPos.y;
  this.r = r;
  this.type = type;
  this.colors=["cyan", "grey", "brown", "black", "doderblue", "violet", "slateblue", "mediumseagreen", "tomato", "red", "pink" ,"orange", "gold"];
  this.titles=["💚", "🪓", "👟", "🎭", "🏅", "🚀", "💚", "💚","💚", "💚", "💚", "💚"];

  
  this.update = () => {

    ctx = myGameArea.context;
    ctx.fillStyle = this.colors[type];
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.textAlign="center";
    ctx.font="20px comic sans ms"
    ctx.fillText(this.titles[this.type], this.x, this.y + 7);
  }

}

const drawMiniMap = () => {
  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.fillStyle = "#00000060";
  ctx.fillRect(100, 50, 4000/20, 4000/20);
  shooters.sort(function(a, b){return b.exp - a.exp});
  ctx.fillStyle = "#ffffffb0";
  ctx.font = "12px comic sans ms";
  ctx.textAlign = "center";
  for(let i = 0; i < shooters.length; i++){
    ctx.fillStyle = "#ffffffb0";
    if(shooters[i].group == myGamePiece.group)
      ctx.fillStyle="#ff0000b0";
    // else continue;
    if(shooters[i].ip == myip){
      ctx.fillStyle = "#00ff00b0";
    }
    ctx.fillRect(100 + shooters[i].x/20, 50 + shooters[i].y/20, 7, 7);

    ctx.fillText(shooters[i].group + "-"+shooters[i].name, 100 + shooters[i].x/20, 47 + shooters[i].y/20);
  }
}

const drawText = () => {
  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.textAlign = "left";

  ctx.font="24px Comic Sans Ms";
  ctx.fillStyle = "mediumseagreen";
  ctx.fillText(" PosX : " + (myGamePiece.x + myGameArea.areaPos.x) , 100, 300 );
  ctx.fillText(" PosY : " + (myGamePiece.y + myGameArea.areaPos.y) , 100, 350 );
  if(myinfo !== undefined){
    ctx.textAlign = "left";  
    ctx.fillText(" Level : " + (myinfo.level) , 100, 400 );
    ctx.fillText(" Damage : " + (myinfo.damage) , 100, 450 );
    ctx.fillText(" ShootSpeed : " + (myinfo.shootSpeed) , 100, 500 );
    ctx.fillText(" MoveSpeed : " + (myinfo.moveSpeed) , 100, 550 );
    ctx.fillText(" bulletSpeed : " + (myinfo.bulletSpeed) , 100, 600 );
  }


  ctx.font="24px Comic Sans Ms";
  ctx.fillStyle = myGamePiece.color;
  ctx.fillText("Ranking", myGameArea.canvas.width - 300, 100)
  ctx.font="18px segoe ui";
  ctx.fillStyle = "black";

  shooters.sort(function(a, b){return b.exp - a.exp});
  let redExp = 0, blueExp = 0;
  for (let shooter of shooters) {
    if(shooter.group == 1) redExp += shooter.exp;
    else blueExp += shooter.exp;
  }
  let k = 1;
  ctx.fillStyle = "tomato";
  ctx.fillText("RedTeam Exp:" + redExp, myGameArea.canvas.width - 300, 130 );

  for (let i = 0; i < shooters.length; i++) {
    if (shooters[i].group == 1) {
      ctx.fillText( shooters[i].name + " : " + shooters[i].exp, myGameArea.canvas.width - 280,  k * 24 + 130 );
      k++;    
    }
  }

  ctx.fillStyle = "dodgerblue";
  ctx.fillText("BlueTeam Exp:" + blueExp, myGameArea.canvas.width - 300,  k * 24 + 130 );

  for (let i = 0; i < shooters.length; i++) {
    if (shooters[i].group == 2) {
      k++;   
      ctx.fillText( shooters[i].name + " : " + shooters[i].exp, myGameArea.canvas.width - 280,  k * 24 + 130 );
 
    }
  }
  // let groupExp = [];
  // for(let i = 1; i < 3; i++){
  //   const groupLank = {};
  //   groupLank.no = "group-"+i;
  //   groupLank.totalExp = 0;
  //   for(let shooter of shooters){
  //     if(shooter.group == i) groupLank.totalExp += shooter.exp;
  //   }
  //   groupExp.push(groupLank);
  // }
  // groupExp.sort(function(a, b){return b.totalExp - a.totalExp});

  // let k = 0;
  // for(let exp of groupExp){
  //   if(exp.totalExp >= 600){
  //     alert("Group-"+ exp.no +" Win! Press F5 to Restart the game.");
  //   } 
  //   k++;
  //   ctx.fillText(exp.no+" Exp:"+exp.totalExp, myGameArea.canvas.width - 300,  k * 24 + 130 );    
  // }
  
}


function component(width, height, color, x, y, angle, heart, name, group, emoticon) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.moveSpeed = 3;
    this.angle = angle;
    this.speedX = 0;
    this.group = group;
    this.speedY = 0;
    this.shootSpeed = 30;
    this.bulletSpeed = 2;
    this.bulletTime = 10;
    this.bulletDamage = 50;
    this.heart = heart;
    this.name = name;
    this.emoticon = emoticon;
    this.x = x - myGameArea.areaPos.x;
    this.y = y - myGameArea.areaPos.y;    
    this.update = function() {


        ctx = myGameArea.context;


        /**
         * text Drawing
         */

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        


        
        ctx.fillStyle = color;

        ctx.fillRect(this.width / 3, this.height / -6 , this.width / 2, this.height / 3);
        

        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, 2 * Math.PI);
        ctx.fill();
        

        //ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);

        /*
          textDrwaing
        */
        if(this.group == 1) ctx.fillStyle = "tomato";
        else ctx.fillStyle = "dodgerblue";
        ctx.font="20px Comic Sans Ms";
        ctx.textAlign = "center";
        ctx.fillText(this.group +" - "+ this.name , this.width/ -10, this.height );

        /*
        ***heart bar***
        */
        ctx.font="20px Comic Sans Ms";
        ctx.textAlign = "center";
        ctx.fillText(this.heart , this.width/ -10, -this.height );
        ctx.fillStyle = "green";
        ctx.fillRect(-this.width/ 2 , -this.height  , this.width, this.height / 4);
        ctx.fillStyle = "red";
        if(this.heart >= 100){
          ctx.fillRect(-this.width / 2 , -this.height , (this.width / 100) * 100, this.height / 4);
        }else{
          ctx.fillRect(-this.width / 2 , -this.height , (this.width / 100) * this.heart, this.height / 4);
        }


        /**
         * 
         * Emoticon Draw
         */

        if (this.emoticon !== 10) {
          ctx.font = "36pt arial";
          ctx.textAlign = "center";
          ctx.fillText(imoticon[this.emoticon], 0, 12);
        }

        ctx.restore();
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }    

    this.stopMove = () => {
      this.speedX = 0;
      this.speedY = 0;
    }

}

function bullet(width, height, color, x, y, angle){
  this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.x = x;
    this.color = color;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x-myGameArea.areaPos.x , this.y-myGameArea.areaPos.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
}

const checkMultiInput = () => {
  if (myGameArea.keys && myGameArea.keys[65]) {
    if(myGameArea.areaPos.x > 0 && myGamePiece.x < 350 ){
      myGameArea.areaPos.x -= myGamePiece.moveSpeed;
    }else if(myGamePiece.x > 37){
      myGamePiece.speedX = -myGamePiece.moveSpeed;
    } 
  }
  if (myGameArea.keys && myGameArea.keys[68]) {
    if(myGameArea.areaPos.x < (4000 - myGameArea.canvas.width) && myGamePiece.x >= myGameArea.canvas.width-350){
      myGameArea.areaPos.x += myGamePiece.moveSpeed;
    }else if(myGamePiece.x < myGameArea.canvas.width - 37){
      myGamePiece.speedX = myGamePiece.moveSpeed;
    } 
  }
  if (myGameArea.keys && myGameArea.keys[87]) {
    if( myGameArea.areaPos.y > 0 && myGamePiece.y < 350){
      myGameArea.areaPos.y -= myGamePiece.moveSpeed;
    }else if(myGamePiece.y > 37){
      myGamePiece.speedY = -myGamePiece.moveSpeed;
    } 
  }
  if (myGameArea.keys && myGameArea.keys[83]) {
    if(myGameArea.areaPos.y < (4000 - myGameArea.canvas.height) && myGamePiece.y >= myGameArea.canvas.height-350){
      myGameArea.areaPos.y += myGamePiece.moveSpeed;
    }else if(myGamePiece.y < myGameArea.canvas.height-37){
      myGamePiece.speedY = myGamePiece.moveSpeed;
    } 
  }
  if (myGameArea.keys && myGameArea.keys[49]) {
    myGamePiece.emoticon = 1;
  }
  if (myGameArea.keys && myGameArea.keys[50]) {
    myGamePiece.emoticon = 2;
  }
  if (myGameArea.keys && myGameArea.keys[51]) {
    myGamePiece.emoticon = 3;
  }
  if (myGameArea.keys && myGameArea.keys[52]) {
    myGamePiece.emoticon = 4;
  }
  if (myGameArea.keys && myGameArea.keys[53]) {
    myGamePiece.emoticon = 5;
  }
  if (myGameArea.keys && myGameArea.keys[54]) {
    myGamePiece.emoticon = 6;
  }
  if (myGameArea.keys && myGameArea.keys[55]) {
    myGamePiece.emoticon = 7;
  }
  if (myGameArea.keys && myGameArea.keys[56]) {
    myGamePiece.emoticon = 8;
  }
  if (myGameArea.keys && myGameArea.keys[57]) {
    myGamePiece.emoticon = 9;
  }
  if (myGameArea.keys && myGameArea.keys[48]) {
    myGamePiece.emoticon = 10;
  }
}



function updateGameArea() {
    myGameArea.clear();
    myGamePiece.stopMove();
    checkMultiInput();
    for(let item of items) item.update();
    for(let upitem of itemlist) upitem.update();
    for(let enermy of enermies){ 
      enermy.update();
    };
    for(let bullet of bullets){
      bullet.update();
    }
    myGamePiece.angle =  Math.atan2( myGameArea.y - myGamePiece.y , myGameArea.x - myGamePiece.x);
    myGamePiece.newPos();
    myGamePiece.update();
    curStatus();
    
    drawText();
    drawMiniMap();
    aniText.update();
}


const everyInterval = (n) => {
  if (myGameArea.frameNo % n == 0) {
    return true;
  }
  return false;
}

const timeOut = (n) => {
  if (myGameArea.timeOut == n ){
    myGameArea.timeOut = 0;
    return true;
  }
  return false;
}


function textAnimation(text, interval, timeout, x, y, color){
  this.text = text;

  this.len = 0;
  
  this.update = function(){
    myGameArea.frameNo++;
    if (everyInterval(3) || myGameArea.frameNo == 1) {
      if(this.len < this.text.length){
        this.len ++;
      }
      else{
        myGameArea.timeOut ++;
        if(timeOut(50)){
          this.len = 0;
          this.text = "";
        }
      }
      // else{
      //   myGameArea.timeOut ++;
      //   if(timeOut(50)){  
      //     this.len = 0;
      //     this.text = "Mad Guy!!! Bye Bye!!!";
      //   } 
      // }
    }

      ctx = myGameArea.context;
      ctx.beginPath();
      ctx.textAlign = "center";
      ctx.font="32px segoe print";
      ctx.fillStyle = "dodgerblue";
      ctx.fillText(this.text.slice(0, this.len), myGameArea.canvas.width/2, myGameArea.canvas.height/2);
  }

  this.stop = () => {
    clearInterval(this.clock);
  }
}