function item(type, r, x, y){
  this.type = type;
  this.r = r;
  this.x = x;
  this.y = y;

  this.getDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2);
  }

  this.getItem = (otherobj) => {
    if (this.getDistance(this.x, this.y, otherobj.x, otherobj.y) < this.r + otherobj.width / 2) {
      return true;
    }
    return false;
  }
}

module.exports = item;