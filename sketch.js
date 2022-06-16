//partner for this core lab was Sherif (ssall001)

var samplePlayer = new maximJs.maxiSample();
var squareDim = 0;

var gridDegrees = 0
var particles = []


//the rgb variables are going to be used for the colourfor each visual, this is so when visual 4 changes colour the others will change to its colour
var r = 255
var g = 0
var b = 0

var isVisual1 = false;
var isVisual2 = false;
var isVisual3 = false;
var isVisual4 = false;

var startSecs = 90;
var endSecs = 342; // 5mins 44 ... the length of the track
var dur = 342;

var audioContext;
var audioInit;

var envFollower = new maximEx.envFollower(); //this is the global variable used to create the envelope follower
var particle_follower = new maximEx.envFollower();

var amp = 0;
var amp2;

var upperThresh = 0.4;
var lowerThresh = 0.2;

var isFired = false;


function setup()
{
  createCanvas(windowWidth,windowHeight);

  squareDim = width * 0.1;
  noiseDim = min(width, height);

  //creating the MaximJs audio context
  audioContext = new maximJs.maxiAudio(); //We're using maximJs without an audio loop
  audioContext.play = playLoop;


}

function playLoop()
{
  if(samplePlayer.isReady())
  {
    //this use of play is pretty weird
    //I wouldn't worry about it now
      
    this.output = samplePlayer.play(1/dur, 44100 * startSecs, 44100 * endSecs);
      
     amp = envFollower.analyse(this.output,0.01,0.1)
      amp2 = particle_follower.analyse(this.output,0.01,1.0)
  }
  else
  {
    this.output = 0;
  }
}

function draw()
{

    background(0);
    
    if(!audioInit)
    {
        push();
        fill(255);
        textSize(32);
        textAlign(CENTER);
        text("Press any key to start ...", width/2, height/2);
        pop();
        
        return;
        
    }
    
    
    fill(255);
    noStroke();

    text("visual1: " + isVisual1, 20,20);
    text("visual2: " + isVisual2, 20,40);
    text("visual3: " + isVisual3, 20,60);
    text("visual4: " + isVisual4, 20,80);

    text("startSecs: " + startSecs, 20, 100);
    
    text("amp " + amp, 20,120)

    translate(width/2, height/2);
    rectMode(CENTER);

    if(isVisual1)
    {
      visual1();
    }

    if(isVisual2)
    {
      visual2();
    }

    if(isVisual3)
    {
      visual3();
    }

    if(isVisual4)
    {
      visual4();
    }

}


function visual1()
{

  ////////////////////TEST GRAPHIC///////////////////////
push()
    
    fill(r,g,b);
    if(amp<0.2){gridDegrees+=1}
    rotate(gridDegrees)

    for(var i=0;i<7;i++)
    {
        rect(-squareDim/2 + i * squareDim/2,-squareDim/2,
             -squareDim/2 *amp,squareDim/2*amp); 
    }
    noFill()
pop()
}

function visual2()
{

  ////////////////////TEST GRAPHIC///////////////////////
     //rect(squareDim, squareDim, squareDim , squareDim );
push()
    fill(r,g,b,125);
    var noiseStep = 0.1;
    var noiseDim = 600;
    
    
    
    
    beginShape()
    for(var i=0;i<25;i++)
    {
             
        vertex(noise(i*noiseStep*amp) * noiseDim - noiseDim/2 , 
        noise(i-500*noiseStep*amp) * noiseDim - noiseDim/2)*amp;
        
    }
    endShape()
    if(amp >0.1){noiseSeed(frameCount)}
    
pop()
}

function visual3()
{

  ////////////////////TEST GRAPHIC///////////////////////

  fill(r,g,b);
  //rect(squareDim, squareDim, squareDim , squareDim );
    
     for (var i = 0; i < particles.length; i++) 
     {
        particles[i].run(); 
     }
    
    if (amp2 > upperThresh && isFired == false)
    {
        
        for (var i = 0; i < 100; i++)
        {    
            particles.push(new Particle()) * i;   
            isFired = true;
        }
        
    }
    
    if (amp2 < lowerThresh)
    {
        isFired = false;
    }

    


}

function visual4()
{
  ////////////////////TEST GRAPHIC///////////////////////

  fill(255,255,0);
  //rect(-squareDim, squareDim, squareDim , squareDim );
     var db = maximEx.amptodb(db)
    push()
    strokeWeight(amp*0.475)
    
    if(amp<0.1)
    {
         r = 255;
        g = 255;
        b = 255;
         for(var i =0;i<100;i++)
         {  
             stroke(r,g,b,175)
            noFill()
            line(-width/2 + i * width/100,-height/2
            ,-width/2+ i * width/100,height/2)
         }
    }
    
       if(amp>0.1 && amp < 0.2)
    {
        r = 0;
        g = 0;
        b = 255;
         for(var i =0;i<100;i++)
         {  
             stroke(r,g,b,175)
            noFill()
            line(-width/2 + i * width/100,-height/2
            ,-width/2+ i * width/100,height/2)
         }
    }
    
     if(amp>0.2 && amp < 0.4)
    {
        r = 255;
        g = 0;
        b = 0;
         for(var i =0;i<100;i++)
         {  
             stroke(r,g,b,175)
            noFill()
            line(-width/2 + i * width/100,-height/2
            ,-width/2+ i * width/100,height/2)
         }
    }
    
    
       if(amp>0.4)
    {
        r = 0;
        g = 255;
        b = 0;
         for(var i =0;i<100;i++)
         {  
             stroke(0,255,0,175)
            fill(r,g,b,175)
            line(-width/2 + i * width/100,-height/2
            ,-width/2+ i * width/100,height/2)
         }
    }
    
    //ellipse(0,0,200*amp,200*amp)
    pop()
    
}


function keyPressed()
{
  if(!audioInit)
  {
    audioInit = true;  
    audioContext.init();
    audioContext.loadSample("assets/aphex.mp3", samplePlayer);
    return;
  }
    
  if(key  == '1')
  {
    isVisual1 = !isVisual1; 
  }
  else if(key  == '2')
  {
    isVisual2 = !isVisual2; 
  }
  else if(key  == '3')
  {
    isVisual3 = !isVisual3; 
  }
  else if(key  == '4')
  {
    isVisual4 = !isVisual4; 
  }
    
    if(key == ' ')
  {
      for (var i = 0; i < 1000; i++)
      {    
         particles.push(new Particle()) * i;          
      }
      
  }


  
}

function mouseDragged(){

  //this allows you to scrub through the track
  startSecs = map(mouseX, 0 ,width, 0 , endSecs - 10);
  dur = endSecs - startSecs;
  samplePlayer.trigger();
}

//////////////////////////////////PARTICLE CONSTRUCTOR////////////////////////////////

function Particle() 
{
  this.velocity = createVector(random(-3.0,3.0), random(-3.0,3.0));
  this.loc = createVector(0,0);
  this.acceleration = createVector(0,0);
  this.diam = 2;
  this.age = 1.0;

  this.run = function() {
    this.display();
    this.move();
    this.aging();
  }

  this.display = function() {
    noStroke();
    fill(r * this.age,g * this.age,b * this.age);
    ellipse(this.loc.x, this.loc.y, this.diam, this.diam);
  }

  this.move = function() {
    this.loc.add(this.velocity);
  }

  this.aging = function(){
    this.age -= 0.003;
  }

}
