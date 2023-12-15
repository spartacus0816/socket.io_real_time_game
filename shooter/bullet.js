function bullet(width, height, color, x, y, damage, angle, speed, time){
  this.x = x;
  this.y = y;
  this.damage = damage;
  this.width = width;
  this.height = height;
  this.color = color;
  this.angle = angle;
  this.speed = speed;
  this.time = 0;

  this.newPos = function() {
    this.time ++;
    this.y += Math.sin(angle) * this.speed;
    this.x += Math.cos(angle) * this.speed;        
  }

  this.shoot = function(otherobj){
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x - (otherobj.width / 2);
    var otherright = otherobj.x + (otherobj.width /2);
    var othertop = otherobj.y - (otherobj.width / 2);
    var otherbottom = otherobj.y + (otherobj.width / 2);
    var crash = false;
    if ((mybottom < otherbottom) &&
    (mytop > othertop) &&
    (myright < otherright) &&
    (myleft > otherleft)) {
      console.log("yes!:", otherleft, myright, otherright, myleft, othertop, mybottom, otherbottom, mytop);
      crash = true;
    }
    return crash;
  }

}

module.exports = bullet;