
const express = require('express');
const path = require('path');

const Shooter = require('./shooter');
const ShooterManager = new Shooter();


const app = express();
const server = require('http').createServer(app);

var io = require('socket.io')(server);
io.on('connection', function(client){
    console.log("connected!");
    let redTeam = 0, blueTeam = 0;
    for(shooter of ShooterManager.shooters){
        if(shooter.group == 1) redTeam++;
        else blueTeam ++;
    }
    io.emit('teamState', {redTeam : redTeam, blueTeam : blueTeam});
    client.on('sendName', function(data){
        if(data.group == 0){
            if(redTeam >= blueTeam) data.group = 2;
            else data.group = 1;
        }
        const userip = client.conn.remoteAddress;
        const addRes = ShooterManager.addUser({...data, userip : userip, socket:client});
        if(addRes == 1){
            redTeam = 0;
            blueTeam = 0;
            for(shooter of ShooterManager.shooters){
                if(shooter.group == 1) redTeam++;
                else blueTeam ++;
            }
            io.emit('teamState', {redTeam : redTeam, blueTeam : blueTeam});
        }
        if(data.name.trim().length == 0){
            data.name = "Mad Guy!~";
        }
        if(data.name.trim().length > 10){
            data.name = data.name.trim().substr(0, 10);
        }
        let colCheck = false;
        const colors = ["dodgerblue", "violet", "mediumseagreen", "slateblue", "tomato"];
        for(let curColor of colors){
            if(data.color == curColor){
                colCheck = true;
                break;
            }
        }
        if(colCheck != true) data.color = "black";
        console.log(data.group);
        for(let shooter of ShooterManager.shooters){
            if(shooter.ip == userip){
                client.emit('initial', {shooter : shooter, myip:userip});
                break;
            }
        }
    });
    console.log(client.conn.remoteAddress);

    client.on('client_status', function(data){
        ShooterManager.updateShooter(data.shooter);
        const bullets = [];
        const shooterLists = [];
        for(let shooter of ShooterManager.shooters){
            for(let bullet of shooter.bullets){    
                const bulletinfo = {};
                bulletinfo.width = bullet.width;
                bulletinfo.height = bullet.height;
                bulletinfo.color = bullet.color;
                bulletinfo.angle = bullet.angle;
                bulletinfo.x = bullet.x;
                bulletinfo.y = bullet.y;
                bullets.push(bulletinfo);
            }
            const shooterInfo = {
                width: shooter.width,
                name: shooter.name,
                x: shooter.x,
                y: shooter.y,
                angle: shooter.angle,
                color: shooter.color,
                ip: shooter.ip,
                heart: shooter.heart,
                level: shooter.level,
                moveSpeed: shooter.moveSpeed,
                exp: shooter.exp,
                damage: shooter.damage,
                group: shooter.group,
                emoticon: shooter.emoticon,
                shootSpeed: shooter.shootSpeed,
                bulletSpeed: shooter.bulletSpeed,
                
            }
            shooterLists.push(shooterInfo);
        }
        // if(ShooterManager.checkDied()){
        //     if(data.shooter.ip == ShooterManager.checkDied())
        //         client.emit('died');
        // }
        client.emit('server_status', {shooters : shooterLists, bullets:bullets,  items:ShooterManager.items});
    });

    client.on('disconnect', function(){
        //ShooterManager.deleteUser(client.conn.remoteAddress);
        console.log('.....disconnect');
    });

});



const port = 9090;
app.use(express.static('public'));

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});