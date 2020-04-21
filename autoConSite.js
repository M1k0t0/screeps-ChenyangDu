module.exports = {
    run:function(roomName){
        var flag = Game.flags["Main_" + roomName]
        if(flag && Game.time % 100 == 0){
            runFlag(flag)
        }
    },
    test:function(){
        var flag = Game.flags.test;
        if(flag){
            let positions = structureLayout[3].buildings[STRUCTURE_ROAD]
            if(positions.length){
                for(var position of positions){
                    let pos = new RoomPosition(position.x + flag.pos.x,position.y + flag.pos.y,flag.pos.roomName)
                    
                    new RoomVisual(pos.roomName).circle(pos.x,pos.y,{radius:0.5,fill:'#00FF00'})
                }
            }
            
        }
    },
    roadBuild :function(flag,position){
        roadBuild(flag,position);
    }
}

var room;
var exits = [
    {"x":1,"y":8},{"x":8,"y":1},{"x":5,"y":12},{"x":12,"y":5},
]

function runFlag(flag){
    room = Game.rooms[flag.pos.roomName]
    if(!room){
        console.log('没得视野')
    }
    let level = room.controller.level;
    for(var type in structureLayout[level].buildings){
        let positions = structureLayout[level].buildings[type]
        if(positions.length){
            for(var position of positions){
                if(type == STRUCTURE_STORAGE){
                    if(room.energyCapacityAvailable < 1300){
                        break;
                    }
                }
                //console.log(position.x,position.y)
                
                let pos = new RoomPosition(position.x + flag.pos.x,position.y + flag.pos.y,flag.pos.roomName)
                let structures = flag.pos.lookFor(LOOK_STRUCTURES).filter((o)=>(o.structureType == type))
                if(!structures.length){
                    pos.createConstructionSite(type)
                }
            
            }
        }
    }
    if(level >= 2){
        sourceKeep(flag)
    }
    if(level >= 2 && level < 8){
        controlKeep(flag)
    }
    if(level >= 6){
        let miner = room.find(FIND_MINERALS)[0]
        miner.pos.createConstructionSite(STRUCTURE_EXTRACTOR)
    }
    /*
    var roads = Game.rooms.sim.find(FIND_STRUCTURES,{filter:(o)=>(o.structureType == STRUCTURE_ROAD)})
    var string = ""
    if(roads.length){
        for(var road of roads){
            string += "{\"x\":" + (road.pos.x-1)+"\"y\":" + (road.pos.y-1) + "},"
        }
    }
    console.log(string)*/
}
function sourceKeep(flag){
    var sources = room.find(FIND_SOURCES)
    for(var source of sources){
        exits.forEach(exit => {
            exit.pos = new RoomPosition(exit.x + flag.pos.x,exit.y + flag.pos.y,flag.pos.roomName)
            exit.PathFinder = PathFinder.search(source.pos,exit)
        });
        exits.sort((a,b)=>(a.PathFinder.cost - b.PathFinder.cost))
        let path = exits[0].PathFinder.path
        
        for(var i=1;i<path.length;i++){
            path[i].createConstructionSite(STRUCTURE_ROAD)
        }
        
        path[0].createFlag(flag.pos.roomName + '_' + source.id[source.id.length-1],COLOR_YELLOW,COLOR_YELLOW)
    }
}

function controlKeep(flag){
    let controller = room.controller;
    controller.range = 3;
     exits.forEach(exit => {
        exit.pos = new RoomPosition(exit.x + flag.pos.x,exit.y + flag.pos.y,flag.pos.roomName)
        
        exit.PathFinder = PathFinder.search(exit.pos,controller)
    });
    exits.sort((a,b)=>(a.PathFinder.cost - b.PathFinder.cost))
    let path = exits[0].PathFinder.path
    
    for(var i=0;i<path.length-1;i++){
        path[i].createConstructionSite(STRUCTURE_ROAD)
    }
    if(path.length)
        path[path.length-1].createConstructionSite(STRUCTURE_CONTAINER)
}

function roadBuild(flag,position){
    var exits = [
        {"x":1,"y":8},{"x":8,"y":1},{"x":5,"y":12},{"x":12,"y":5},
    ]
    exits.forEach(exit => {
        exit.pos = new RoomPosition(exit.x + flag.pos.x,exit.y + flag.pos.y,flag.pos.roomName)
        exit.PathFinder = PathFinder.search(position,exit)
    });
    exits.sort((a,b)=>(a.PathFinder.cost - b.PathFinder.cost))
    let path = exits[0].PathFinder.path
    for(var pos of path){
        new RoomVisual(pos.roomName).circle(pos.x,pos.y);
    }
}

const structureLayout = {
    1: {
        "rcl":1,
        "buildings":{
            "extension":[],
            "spawn":[
                {"x":7,"y":8}
            ],
            "road":[],
            "tower":[],
            "storage":[],
            "terminal":[],
            "powerSpawn":[],
            "link":[],
            "container":[],
            "lab":[],
            "nuker":[],
            "observer":[],
            "factory":[]
        }
    },
    2: {
        "rcl":2,
        "buildings":{
            "extension":[
                {"x":5,"y":5},{"x":6,"y":5},
                {"x":6,"y":6},{"x":7,"y":6},
                {"x":7,"y":7},
            ],
            "spawn":[
                {"x":7,"y":8}
            ],
            "road":[
                {"x":1,"y":8},{"x":2,"y":7},{"x":3,"y":6},{"x":4,"y":7},
                {"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},{"x":5,"y":4},
                {"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},
                {"x":8,"y":9},{"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},
                {"x":6,"y":11},{"x":5,"y":12},{"x":12,"y":5},
            ],
            "tower":[],
            "storage":[],
            "terminal":[],
            "powerSpawn":[],
            "link":[],
            "container":[],
            "lab":[],
            "nuker":[],
            "observer":[],
            "factory":[],
            "rampart":[
            ]
        }
    },
    3: {
        "rcl":3,
        "buildings":{
            "extension":[
                {"x":5,"y":5},{"x":6,"y":5},
                {"x":6,"y":6},{"x":7,"y":6},
                {"x":7,"y":7},
                {"x":8,"y":7},{"x":8,"y":8},
                {"x":9,"y":6},{"x":9,"y":5},
                {"x":8,"y":5},
            ],
            "spawn":[
                {"x":7,"y":8}
            ],
            "road":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},
                {"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":0,"y":5},{"x":0,"y":6},
                {"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":2,"y":7},
                {"x":3,"y":6},{"x":4,"y":7},{"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},
                {"x":5,"y":4},{"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":8,"y":9},
                {"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},{"x":3,"y":11},{"x":4,"y":12},
                {"x":6,"y":11},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},
                {"x":9,"y":13},{"x":10,"y":12},{"x":9,"y":2},{"x":10,"y":3},{"x":11,"y":4},
                {"x":12,"y":5},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},
                {"x":12,"y":10},{"x":11,"y":11},
            ],
            "tower":[
                {"x":5,"y":7}
            ],
            "storage":[],
            "terminal":[],
            "powerSpawn":[],
            "link":[],
            "container":[],
            "lab":[],
            "nuker":[],
            "observer":[],
            "factory":[],
            "rampart":[
            ]
        }
    },
    4: {
        "rcl":4,
        "buildings":{
            "extension":[
                {"x":8,"y":8},{"x":8,"y":7},{"x":7,"y":7},{"x":7,"y":6},{"x":6,"y":6},
                {"x":6,"y":5},{"x":5,"y":5},{"x":9,"y":6},{"x":9,"y":5},{"x":8,"y":5},
                {"x":8,"y":4},{"x":7,"y":4},{"x":10,"y":8},{"x":10,"y":9},{"x":5,"y":3},
                {"x":4,"y":3},{"x":4,"y":4},{"x":3,"y":4},{"x":3,"y":5},{"x":2,"y":6},
            ],
            "spawn":[
                {"x":7,"y":8}
            ],
            "road":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},
                {"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":0,"y":5},{"x":0,"y":6},
                {"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":2,"y":7},
                {"x":3,"y":6},{"x":4,"y":7},{"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},
                {"x":5,"y":4},{"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":8,"y":9},
                {"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},{"x":3,"y":11},{"x":4,"y":12},
                {"x":6,"y":11},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},
                {"x":9,"y":13},{"x":10,"y":12},{"x":9,"y":2},{"x":10,"y":3},{"x":11,"y":4},
                {"x":12,"y":5},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},
                {"x":12,"y":10},{"x":11,"y":11},
            ],
            "tower":[
                {"x":5,"y":7}
            ],
            "storage":[
                {"x":5,"y":9}
            ],
            "terminal":[],
            "powerSpawn":[],
            "link":[],
            "container":[],
            "lab":[],
            "nuker":[],
            "observer":[],
            "factory":[],
            "rampart":[
                {"x":7,"y":8},{"x":5,"y":7},{"x":5,"y":9}
            ]
        }
    },
    5: {
        "rcl":5,
        "buildings":{
            "extension":[
                {"x":5,"y":5},{"x":6,"y":5},{"x":6,"y":6},{"x":7,"y":6},{"x":7,"y":7},
                {"x":8,"y":7},{"x":8,"y":8},{"x":7,"y":4},{"x":8,"y":5},{"x":9,"y":6},
                {"x":8,"y":4},{"x":9,"y":5},{"x":10,"y":8},{"x":10,"y":9},{"x":5,"y":3},
                {"x":4,"y":3},{"x":4,"y":4},{"x":3,"y":4},{"x":3,"y":5},{"x":2,"y":6},
                {"x":10,"y":6},{"x":7,"y":3},{"x":2,"y":8},{"x":2,"y":9},{"x":3,"y":9},
                {"x":3,"y":10},{"x":4,"y":10},{"x":1,"y":7},{"x":1,"y":6},{"x":2,"y":5},
            ],
            "spawn":[
                {"x":7,"y":8}
            ],
            "road":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},
                {"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":0,"y":5},{"x":0,"y":6},
                {"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":2,"y":7},
                {"x":3,"y":6},{"x":4,"y":7},{"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},
                {"x":5,"y":4},{"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":8,"y":9},
                {"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},{"x":3,"y":11},{"x":4,"y":12},
                {"x":6,"y":11},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},
                {"x":9,"y":13},{"x":10,"y":12},{"x":9,"y":2},{"x":10,"y":3},{"x":11,"y":4},
                {"x":12,"y":5},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},
                {"x":12,"y":10},{"x":11,"y":11},
            ],
            "tower":[
                {"x":5,"y":7},{"x":4,"y":8}
            ],
            "storage":[
                {"x":5,"y":9}
            ],
            "terminal":[],
            "powerSpawn":[],
            "link":[
                {"x":6,"y":8}
            ],
            "container":[],
            "lab":[],
            "nuker":[],
            "observer":[],
            "factory":[],
            "rampart":[
                {"x":7,"y":8},{"x":5,"y":7},{"x":5,"y":9},{"x":4,"y":8}
            ]
            
        }
    },
    6: {
        "rcl":6,
        "buildings":{
            "extension":[
                {"x":4,"y":3},{"x":4,"y":4},{"x":3,"y":4},{"x":2,"y":5},{"x":2,"y":6},
                {"x":3,"y":5},{"x":5,"y":3},{"x":5,"y":2},{"x":6,"y":1},{"x":7,"y":1},
                {"x":6,"y":2},{"x":1,"y":7},{"x":5,"y":5},{"x":6,"y":5},{"x":6,"y":6},
                {"x":7,"y":6},{"x":7,"y":7},{"x":8,"y":7},{"x":8,"y":8},{"x":7,"y":3},
                {"x":7,"y":4},{"x":8,"y":4},{"x":8,"y":5},{"x":9,"y":5},{"x":9,"y":6},
                {"x":10,"y":6},{"x":10,"y":5},{"x":10,"y":4},{"x":9,"y":3},{"x":8,"y":3},
                {"x":8,"y":2},{"x":9,"y":4},{"x":1,"y":6},{"x":10,"y":8},{"x":10,"y":9},
                {"x":2,"y":8},{"x":2,"y":9},{"x":3,"y":9},{"x":3,"y":10},{"x":4,"y":10},
            ],
            "spawn":[
                {"x":7,"y":8}
            ],
            "road":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},
                {"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":0,"y":5},{"x":0,"y":6},
                {"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":2,"y":7},
                {"x":3,"y":6},{"x":4,"y":7},{"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},
                {"x":5,"y":4},{"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":8,"y":9},
                {"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},{"x":3,"y":11},{"x":4,"y":12},
                {"x":6,"y":11},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},
                {"x":9,"y":13},{"x":10,"y":12},{"x":9,"y":2},{"x":10,"y":3},{"x":11,"y":4},
                {"x":12,"y":5},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},
                {"x":12,"y":10},{"x":11,"y":11},
            ],
            "tower":[
                {"x":5,"y":7},{"x":4,"y":8}
            ],
            "storage":[
                {"x":5,"y":9}
            ],
            "terminal":[
                {"x":4,"y":9}
            ],
            "powerSpawn":[],
            "link":[
                {"x":6,"y":8}
            ],
            "container":[],
            "lab":[
                {"x":8,"y":10},{"x":8,"y":11},{"x":7,"y":11},
            ],
            "nuker":[],
            "observer":[],
            "factory":[],
            "rampart":[
                {"x":7,"y":8},{"x":5,"y":7},{"x":5,"y":9},{"x":4,"y":8},
                {"x":4,"y":9},{"x":6,"y":8},{"x":8,"y":10},{"x":8,"y":11},{"x":7,"y":11},
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},{"x":0,"y":5},
                {"x":0,"y":6},{"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":3,"y":11},
                {"x":4,"y":12},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},{"x":9,"y":13},
                {"x":10,"y":12},{"x":11,"y":11},{"x":12,"y":10},{"x":13,"y":9},{"x":13,"y":8},{"x":13,"y":7},
                {"x":13,"y":6},{"x":12,"y":5},{"x":11,"y":4},{"x":10,"y":3},{"x":9,"y":2},{"x":8,"y":1},
                {"x":7,"y":0},{"x":6,"y":0},{"x":5,"y":0},{"x":1,"y":4},{"x":2,"y":3},{"x":3,"y":2},
                {"x":4,"y":1},{"x":7,"y":1},{"x":8,"y":2},{"x":9,"y":3},{"x":10,"y":4},{"x":11,"y":5},
                {"x":12,"y":6},{"x":12,"y":9},{"x":11,"y":10},{"x":10,"y":11},{"x":9,"y":12},{"x":6,"y":12},
                {"x":4,"y":11},{"x":3,"y":10},{"x":2,"y":9},{"x":1,"y":7},

            ]
        }
    },
    7: {
        "rcl":7,
        "buildings":{
            "extension":[
                {"x":4,"y":3},{"x":4,"y":4},{"x":3,"y":4},{"x":2,"y":5},{"x":2,"y":6},
                {"x":3,"y":5},{"x":5,"y":3},{"x":5,"y":2},{"x":6,"y":1},{"x":7,"y":1},
                {"x":6,"y":2},{"x":1,"y":7},{"x":5,"y":5},{"x":6,"y":5},{"x":6,"y":6},
                {"x":7,"y":6},{"x":7,"y":7},{"x":8,"y":7},{"x":8,"y":8},{"x":7,"y":3},
                {"x":7,"y":4},{"x":8,"y":4},{"x":8,"y":5},{"x":9,"y":5},{"x":9,"y":6},
                {"x":10,"y":6},{"x":10,"y":5},{"x":10,"y":4},{"x":9,"y":3},{"x":8,"y":3},
                {"x":8,"y":2},{"x":9,"y":4},{"x":1,"y":6},{"x":10,"y":8},{"x":10,"y":9},
                {"x":2,"y":8},{"x":2,"y":9},{"x":3,"y":9},{"x":3,"y":10},{"x":4,"y":10},
                {"x":4,"y":11},{"x":5,"y":11},{"x":11,"y":7},{"x":11,"y":8},{"x":11,"y":9},
                {"x":11,"y":10},{"x":12,"y":6},{"x":12,"y":7},{"x":12,"y":8},{"x":12,"y":9},
            ],
            "spawn":[
                {"x":7,"y":8},
                {"x":7,"y":9}
            ],
            "road":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},
                {"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":0,"y":5},{"x":0,"y":6},
                {"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":2,"y":7},
                {"x":3,"y":6},{"x":4,"y":7},{"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},
                {"x":5,"y":4},{"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":8,"y":9},
                {"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},{"x":3,"y":11},{"x":4,"y":12},
                {"x":6,"y":11},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},
                {"x":9,"y":13},{"x":10,"y":12},{"x":9,"y":2},{"x":10,"y":3},{"x":11,"y":4},
                {"x":12,"y":5},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},
                {"x":12,"y":10},{"x":11,"y":11},
            ],
            "tower":[
                {"x":5,"y":7},{"x":4,"y":8},{"x":5,"y":6},
            ],
            "storage":[
                {"x":5,"y":9}
            ],
            "terminal":[
                {"x":4,"y":9}
            ],
            "powerSpawn":[],
            "link":[
                {"x":6,"y":8}
            ],
            "container":[],
            "lab":[
                {"x":8,"y":10},{"x":8,"y":11},{"x":7,"y":11},
                {"x":8,"y":12},{"x":7,"y":12},{"x":6,"y":12},
            ],
            "nuker":[],
            "observer":[],
            "factory":[],
            "rampart":[
                {"x":7,"y":8},{"x":5,"y":7},{"x":5,"y":9},{"x":4,"y":8},
                {"x":4,"y":9},{"x":6,"y":8},{"x":8,"y":10},{"x":8,"y":11},{"x":7,"y":11},
                {"x":8,"y":12},{"x":7,"y":12},{"x":6,"y":12},{"x":5,"y":6},{"x":7,"y":9},
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},{"x":0,"y":5},
                {"x":0,"y":6},{"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":3,"y":11},
                {"x":4,"y":12},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},{"x":9,"y":13},
                {"x":10,"y":12},{"x":11,"y":11},{"x":12,"y":10},{"x":13,"y":9},{"x":13,"y":8},{"x":13,"y":7},
                {"x":13,"y":6},{"x":12,"y":5},{"x":11,"y":4},{"x":10,"y":3},{"x":9,"y":2},{"x":8,"y":1},
                {"x":7,"y":0},{"x":6,"y":0},{"x":5,"y":0},{"x":1,"y":4},{"x":2,"y":3},{"x":3,"y":2},
                {"x":4,"y":1},{"x":7,"y":1},{"x":8,"y":2},{"x":9,"y":3},{"x":10,"y":4},{"x":11,"y":5},
                {"x":12,"y":6},{"x":12,"y":9},{"x":11,"y":10},{"x":10,"y":11},{"x":9,"y":12},{"x":6,"y":12},
                {"x":4,"y":11},{"x":3,"y":10},{"x":2,"y":9},{"x":1,"y":7},

            ]
        }
    },
    8: {
        "rcl":8,
        "buildings":{
            "extension":[
                {"x":4,"y":3},{"x":4,"y":4},{"x":3,"y":4},{"x":2,"y":5},{"x":2,"y":6},
                {"x":3,"y":5},{"x":5,"y":3},{"x":5,"y":2},{"x":6,"y":1},{"x":7,"y":1},
                {"x":6,"y":2},{"x":1,"y":7},{"x":5,"y":5},{"x":6,"y":5},{"x":6,"y":6},
                {"x":7,"y":6},{"x":7,"y":7},{"x":8,"y":7},{"x":8,"y":8},{"x":7,"y":3},
                {"x":7,"y":4},{"x":8,"y":4},{"x":8,"y":5},{"x":9,"y":5},{"x":9,"y":6},
                {"x":10,"y":6},{"x":10,"y":5},{"x":10,"y":4},{"x":9,"y":3},{"x":8,"y":3},
                {"x":8,"y":2},{"x":9,"y":4},{"x":11,"y":5},{"x":10,"y":8},{"x":10,"y":9},
                {"x":2,"y":8},{"x":2,"y":9},{"x":3,"y":9},{"x":3,"y":10},{"x":4,"y":10},
                {"x":4,"y":11},{"x":5,"y":11},{"x":11,"y":7},{"x":11,"y":8},{"x":11,"y":9},
                {"x":11,"y":10},{"x":12,"y":6},{"x":12,"y":7},{"x":12,"y":8},{"x":12,"y":9},
                {"x":5,"y":1},{"x":4,"y":1},{"x":4,"y":2},{"x":3,"y":2},{"x":3,"y":3},
                {"x":2,"y":3},{"x":2,"y":4},{"x":1,"y":4},{"x":1,"y":5},{"x":1,"y":6},
            ],
            "spawn":[
                {"x":7,"y":8},
                {"x":7,"y":9},
                {"x":6,"y":10},
            ],
            "road":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},
                {"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":0,"y":5},{"x":0,"y":6},
                {"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":2,"y":7},
                {"x":3,"y":6},{"x":4,"y":7},{"x":8,"y":1},{"x":7,"y":2},{"x":6,"y":3},
                {"x":5,"y":4},{"x":4,"y":5},{"x":6,"y":4},{"x":7,"y":5},{"x":8,"y":6},
                {"x":9,"y":7},{"x":5,"y":8},{"x":6,"y":9},{"x":7,"y":10},{"x":8,"y":9},
                {"x":9,"y":8},{"x":10,"y":7},{"x":11,"y":6},{"x":3,"y":11},{"x":4,"y":12},
                {"x":6,"y":11},{"x":5,"y":12},{"x":6,"y":13},{"x":7,"y":13},{"x":8,"y":13},
                {"x":9,"y":13},{"x":10,"y":12},{"x":9,"y":2},{"x":10,"y":3},{"x":11,"y":4},
                {"x":12,"y":5},{"x":13,"y":6},{"x":13,"y":7},{"x":13,"y":8},{"x":13,"y":9},
                {"x":12,"y":10},{"x":11,"y":11},
            ],
            "tower":[
                {"x":5,"y":7},{"x":4,"y":8},{"x":5,"y":6},
                {"x":4,"y":6},{"x":3,"y":7},{"x":3,"y":8},
            ],
            "storage":[
                {"x":5,"y":9}
            ],
            "terminal":[
                {"x":4,"y":9}
            ],
            "powerSpawn":[
                {"x":6,"y":7}
            ],
            "link":[
                {"x":6,"y":8}
            ],
            "container":[],
            "lab":[
                {"x":8,"y":10},{"x":8,"y":11},{"x":7,"y":11},
                {"x":8,"y":12},{"x":7,"y":12},{"x":6,"y":12},
                {"x":9,"y":9},{"x":9,"y":10},{"x":9,"y":11},{"x":9,"y":12},
            ],
            "nuker":[
                {"x":10,"y":10}
            ],
            "observer":[
                {"x":10,"y":11}
            ],
            "factory":[
                {"x":5,"y":10}
            ],
            "rampart":[
                {"x":4,"y":0},{"x":3,"y":1},{"x":2,"y":2},{"x":1,"y":3},{"x":0,"y":4},{"x":0,"y":5},
                {"x":0,"y":6},{"x":0,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":2,"y":10},{"x":3,"y":11},
                {"x":4,"y":12},{"x":3,"y":4},{"x":3,"y":3},{"x":5,"y":2},{"x":6,"y":2},{"x":6,"y":3},
                {"x":5,"y":5},{"x":5,"y":6},{"x":4,"y":6},{"x":3,"y":5},{"x":4,"y":4},{"x":6,"y":4},
                {"x":7,"y":5},{"x":6,"y":6},{"x":4,"y":7},{"x":2,"y":6},{"x":2,"y":5},{"x":2,"y":4},
                {"x":5,"y":4},{"x":6,"y":7},{"x":5,"y":8},{"x":3,"y":7},{"x":3,"y":6},{"x":7,"y":8},
                {"x":6,"y":9},{"x":5,"y":9},{"x":7,"y":7},{"x":9,"y":8},{"x":8,"y":9},{"x":7,"y":9},
                {"x":8,"y":7},{"x":11,"y":8},{"x":11,"y":10},{"x":8,"y":10},{"x":8,"y":8},{"x":12,"y":8},
                {"x":11,"y":9},{"x":10,"y":7},{"x":10,"y":6},{"x":11,"y":6},{"x":9,"y":5},{"x":9,"y":4},
                {"x":8,"y":4},{"x":4,"y":2},{"x":5,"y":1},{"x":6,"y":1},{"x":7,"y":3},{"x":7,"y":4},
                {"x":1,"y":4},{"x":1,"y":5},{"x":1,"y":6},{"x":1,"y":7},{"x":2,"y":8},{"x":3,"y":9},
                {"x":4,"y":10},{"x":5,"y":10},{"x":6,"y":10},{"x":6,"y":11},{"x":7,"y":11},{"x":8,"y":11},
                {"x":9,"y":11},{"x":10,"y":11},{"x":10,"y":10},{"x":6,"y":12},{"x":6,"y":13},{"x":7,"y":12},
                {"x":8,"y":12},{"x":9,"y":12},{"x":7,"y":13},{"x":8,"y":13},{"x":9,"y":13},{"x":10,"y":12},
                {"x":12,"y":10},{"x":12,"y":9},{"x":6,"y":0},{"x":7,"y":0},{"x":7,"y":1},{"x":8,"y":1},
                {"x":8,"y":2},{"x":9,"y":2},{"x":9,"y":3},{"x":10,"y":4},{"x":10,"y":5},{"x":11,"y":5},
                {"x":12,"y":5},{"x":12,"y":6},{"x":13,"y":7},{"x":12,"y":7},{"x":11,"y":7},{"x":8,"y":5},
                {"x":7,"y":6},{"x":8,"y":6},{"x":9,"y":7},{"x":9,"y":9},{"x":9,"y":10},{"x":10,"y":9},
                {"x":10,"y":8},{"x":6,"y":8},{"x":7,"y":10},{"x":9,"y":6},{"x":2,"y":3},{"x":3,"y":2},
                {"x":4,"y":1},{"x":5,"y":0},{"x":4,"y":3},{"x":5,"y":3},{"x":7,"y":2},{"x":8,"y":3},
                {"x":6,"y":5},{"x":5,"y":7},{"x":4,"y":8},{"x":3,"y":8},{"x":3,"y":10},{"x":4,"y":11},
                {"x":5,"y":12},{"x":5,"y":11},{"x":2,"y":9},{"x":4,"y":9},{"x":2,"y":7},{"x":4,"y":5},
                {"x":10,"y":3},{"x":11,"y":4},{"x":13,"y":6},{"x":13,"y":8},{"x":13,"y":9},{"x":11,"y":11},
            ]
        }
    },
}