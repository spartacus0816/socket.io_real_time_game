const bullet = require('./bullet');

function shooter(x, y, color, name, ip, angle, group, emoticon) {
  this.width = 37;
  this.name = name;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.color = color;
  this.ip = ip;
  this.heart = 100;
  this.level = 1;
  this.moveSpeed = 2;
  this.exp = 0;
  this.damage = 5;
  this.shootBranch = 1;
  this.bulletSpeed = 7;
  this.shootSpeed = 20;
  this.bulletTime = 100;
  this.bullets = [];
  this.counter = 0;
  this.frame = 0;
  this.maxHeart = 100;
  this.group = group;
  this.emoticon = emoticon;

  this.genBullet = () => {
    this.frame ++;
    const colors = [ "doderblue", "tomato", "mediumseagreen", "grey", "brown", "black", "violet", "slateblue", "mediumseagreen", "red", "pink" ,"orange", "gold"];
    if(this.frame == 1 || this.everyInterval(this.shootSpeed)){
      let x = 0, y = 0;
      x = this.x + (Math.cos(this.angle) * 40);
      y = this.y + (Math.sin(this.angle) * 40);
      switch(this.shootBranch){
        case 1:
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.05, this.bulletSpeed));
          break;
        case 3:    
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.05, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle + 0.05, this.bulletSpeed));
          break;
        case 5:    
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.1, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle + 0.1, this.bulletSpeed));
          break;
        case 7:
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.15, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.075, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle + 0.075, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle + 0.15, this.bulletSpeed));
          break;
        default:
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.15, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle - 0.075, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle + 0.075, this.bulletSpeed));
          this.bullets.push(new bullet(5, 5, colors[this.group], x, y, this.damage, this.angle + 0.15, this.bulletSpeed));
        break;
      }
    }
    for(let i = 0; i < this.bullets.length; i++){
      if(this.bullets[i].time > this.bulletTime) this.bullets.splice(i, 1);
      else{
        this.bullets[i].newPos();
      }
    }
  }

  this.getDamage = (damage) => {
    this.heart -= damage;
  }
    
  this.getItem = (otherItem) => {

  }

  this.levelUp = () =>{
    this.maxHeart += 100;
    this.damage += 3;
    this.heart += 100;
    if(this.level % 2 == 0){
      this.moveSpeed += 1;
      this.bulletSpeed += 1;
    }else{
      this.shootBranch += 1;
      this.shootSpeed -= 1;
      this.shootBranch += 1;
    }
    this.level ++;
  }
  this.update = (data) => {
    this.x = data.x;
    this.y = data.y;
    this.angle = data.angle;
    this.ip = data.ip;
    this.emoticon = data.emoticon;
  }

  this.everyInterval = (n) => {
    if((this.frame / n) % 1 == 0){return true;}
    return false;
  }
  
  this.catchItem = (item) => {
    switch (item.type) {
      case 0:
        this.heart += 100;
        break;
      case 1:
        if(this.damage >= 100) this.heart += 100;
        else this.damage += 4;
        break;
      case 2:
        if(this.shootSpeed <= 10 ) this.heart += 100; 
        else this.shootSpeed -= 1;
        break;
      case 3:
        if(this.shootBranch >= 8) this.heart += 100;
        else this.shootBranch += 1;
        break;
      case 4:
        this.exp += 30;
        if(this.exp >= (Math.pow( 2 , this.level) * 10)) this.levelUp();
        break;
      case 5:
        if(this.bulletSpeed >= 15) this.heart += 100;
        else this.bulletSpeed += 1;
        break;      
      case 6:
        this.heart += 100;
        break;
      case 7:
        this.heart += 100;
        break;
      case 8:
        this.heart += 100;
        break;      
      case 9:
        this.heart += 100;
        break;
      case 10:
        this.heart += 100;
        break;
    }
  }
}


module.exports = shooter;

