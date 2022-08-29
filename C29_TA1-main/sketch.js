const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit_rope;
var fruit_con;
var fruit_rope2;
var fruit_con2;
var fruit_rope3;
var fruit_con3;
var background, backgroundImg;
var bunny, bunnyImg;
var cut;
var cut2;
var cut3;
var fruit, fruitImg;
var blink;
var eat;
var sad;
var eatSound;
var ropeCut;
var music;
var airBlowSound;
var sadSound;
var airBlower, buttonMute;
var canW;
var canH;

function preload(){
  backgroundImg = loadImage("background.png");
  bunnyImg = loadImage("rabbit.png");
  fruitImg = loadImage("melon.png");
  
  music = loadSound("sound1.mp3");
  eatSound = loadSound("eating_sound.mp3");
  ropeCut = loadSound("rope_cut.mp3");
  airBlowSound = loadSound("air.wav");
  sadSound = loadSound("sad.wav");

  buttonMute = createImg('mute.png');
  buttonMute.position(920, 20);
  buttonMute.size(50, 50);
  buttonMute.mouseClicked(mute);


  blink = loadAnimation("blink_1.png","blink_2.png","blink_3.png");
  blink.playing = true;
  eat = loadAnimation("eat_0.png" , "eat_1.png","eat_2.png","eat_3.png","eat_4.png");
  eat.playing = true;
  eat.looping = false;
  sad = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  sad.playing = true;
  sad.looping = false;

}

function setup() 
{
  
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile){
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(displayWidth+80, displayHeight+80)
  } else {
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }
  
  frameRate(80);

  //music.play();
  //music.setVolume(0.5);

  engine = Engine.create();
  world = engine.world;
  ground = new Ground(250, canH, 500, 40);
  World.add(world, ground);

  rope = new Rope(8,{x:540,y:30});
  rope2 = new Rope(7,{x:870,y:40});
  rope3 = new Rope(4,{x:900,y:225});

  fruit = Bodies.circle(800, 300, 20);
  Matter.Composite.add(rope.body, fruit);

  fruit_con = new Link(rope, fruit);
  fruit_con2 = new Link(rope2, fruit);
  fruit_con3 = new Link(rope3, fruit);

  cut = createImg("cut_button.png");
  cut.position(520, 30);
  cut.size(50, 50);
  cut.mouseClicked(drop);

  cut2 = createImg("cut_button.png");
  cut2.position(830,35);
  cut2.size(50, 50);
  cut2.mouseClicked(drop2);

  cut3 = createImg("cut_button.png");
  cut3.position(860, 200);
  cut3.size(50, 50);
  cut3.mouseClicked(drop3);

  blink.frameDelay = 15;
  eat.frameDelay = 20;
  sad.frameDelay = 20;

  bunny = createSprite(windowWidth/2, canH-80, 150, 200);
  bunny.scale = 0.2;
  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("sad", sad);
  
  bunny.changeAnimation("blinking", blink);

 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
}

function draw() 
{

  background(51);
  image(backgroundImg, 0, 0, canW, canH);
  drawSprites();
  
  rope.show();
  rope2.show();
  rope3.show();
  //ellipse(fruit.position.x, fruit.position.y, 30, 30);
  Engine.update(engine);

  push();
  imageMode(CENTER);

  if (fruit!=null){
    image(fruitImg, fruit.position.x, fruit.position.y, 70, 70)
  }

  pop();

  ground.display();

  if (collide(fruit, bunny)===true){
    bunny.changeAnimation('eating', eat);
    eatSound.play();
  }

  if (fruit!=null && fruit.position.y>=650){
    bunny.changeAnimation('sad');
    music.stop();
    sadSound.play();
    fruit = null;
  }

}

function collide(body, sprite){
  if (body!=null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if (d<=80){
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    }
    else {
      return false;
    }
  }
}

function drop(){
  ropeCut.play();
  rope.break();
  fruit_con.detach();
  fruit_con = null;
}

function drop2(){
  ropeCut.play();
  rope2.break();
  fruit_con2.detach();
  fruit_con2 = null;
}

function drop3(){
  ropeCut.play();
  rope3.break();
  fruit_con3.detach();
  fruit_con3 = null;
}

function keyPressed(){
  if (keyCode === 32){

      fruit_con.attach(fruit.body);
      bunny.changeAnimation("blinking", blink);
  }
}

function mute(){

  if (music.isPlaying()){
    music.stop();
  } else{
    music.play();
  }
}