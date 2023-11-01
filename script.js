/*******************
        ET-109
        
In this game/simulation There are multiple elements along with an erase element to play around with. To place an element simply tap the screen where you want to place it, keep in mind that you must tap and if you dont release your touch quickly it won't register as a tap.



The concept for this game is not fully original, as a game called "Powder" by Dan-Ball (if I remember correctly) has the same concept, however I did not view the code behind their game and all my code is original from scratch.

    Have fun!
        -Preston Brubaker
        
*******************/
var c=document.getElementById("canvas1");
var ctx=c.getContext("2d");

//display
var minW=0;
var minH=0;
var maxW=canvas1.width;
var maxH=canvas1.height;
var bgHue="#777777";

var pixS=2.5;
var pCX=(maxW/pixS);
var pCY=(maxH/pixS);
var pC=pCX*pCY;
var pA=new Array();
var pA_=new Array();

var el1Hue=0;
var el1HueP=.5;
var el2Hue="#000000";
var el3Hue="#0000FF";

var el4Hue="#DDDDDD";
var el5Hue="#8B4513";
var el6Hue="#FFFF00";
var el7Hue="#FF0000";
var el69Hue="#4F4444";
var gasMC=.4;

var el1C=0;

var penS=3;
var penE=1;

var tickS=10;

/*******************************
End of var Set
*******************************/

for(var n=0;n<pC;n++){
    pA[n]=0;
    pA_[n]=0
}


for(var n=0;n<pCX;n++){
    pA[pCY*n+pCY-1]=2;
    pA_[pCY*n+pCY-1]=2;
    
    
    pA[pCY*n]=2;
    pA_[pCY*n]=2
    
}
for(n=0;n<pCY;n++){
    pA[n]=2;
    pA_[n]=2;
    
    pA[pC-n]=2;
    pA_[pC-n]=2;
}



function fun(){ var num=
document.getElementById("in").value;
penS=num;


if(num=="Large"){
    penS=20;
}
else if(num=="Small"){
    penS=4;
}
else if(num=="Tiny"){
    penS=2;
}
else if(num=="Single"){
    penS=1;
}
else if(num=="Big"){
    penS=15;
}
else if(num=="Normal"){
    penS=7;
}
else if(num=="Huge"){
    penS=30;
}



}
function fun2(){ var num=
document.getElementById("in2").value;

for(var n=0;n<=69;n++){
    if(num==n){
        penE=num;
    }
    if(num=="Powder"){
        penE=1;
    }
    else if(num=="Block"){
        penE=2;
    }
    else if(num=="Water"){
        penE=3;
    }
    else if(num=="Gas"){
        penE=4;
    }
    else if(num=="Wood"){
        penE=5;
    }
    else if(num=="Lightning"||num=="Spark"||num=="Zap"){
        penE=6;
    }
    else if(num=="Fire"){
        penE=7;
    }
    else if(num=="Ash"){
        penE=69;
    }
    
    
}






}



function ce(){
    penE++
    if(penE>7){
        penE=0;
    }
    dx=undefined;
    dy=null;
}

function psm(){
    penS--;
}
function psp(){
    penS++;
}




function tick(){
    //clear and fill bg
    ctx.clearRect(minW,minH,maxW,maxH);
    ctx.fillStyle=bgHue;
    ctx.fillRect(minW,minH,maxW,maxH);
    
    for(var n=0;n<pC;n++){
        var x=n/pCX*pixS-n%pCX*pixS/pCX;
        var y=n%pCY*pixS;
        
        
        if(pA[n]==1){
            ctx.fillStyle=ctx.fillStyle='hsl(' + el1Hue + ', 100%, 70%)';
            ctx.fillRect(x,y,pixS,pixS);
            el1Hue+=el1HueP/el1C;
        }
        if(pA[n]==2){
            ctx.fillStyle=el2Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        if(pA[n]==3){
            ctx.fillStyle=el3Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        if(pA[n]==4){
            ctx.fillStyle=el4Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        if(pA[n]==5){
            ctx.fillStyle=el5Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        if(pA[n]==6){
            ctx.fillStyle=el6Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        if(pA[n]==7){
            ctx.fillStyle=el7Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        if(pA[n]==69){
            ctx.fillStyle=el69Hue;
            ctx.fillRect(x,y,pixS,pixS);
        }
        
        
        
    }
    
    
    
    
    document.body.addEventListener("mousemove", function (event) {
        dx = event.clientX;
        dy = event.clientY;
        if(dy>maxH||dx>maxW){
            dy=null;
            dx=null;
        }
        
        if(dx!=null&&dy!=null){
            for(var kx=0;kx<penS;kx++){
            for(var ky=0;ky<penS;ky++){
                pA_[Math.floor((Math.floor(dx/pixS)*pixS)/maxW*pC+dy/maxW*pCY)+kx-Math.floor(.5*penS)+pCY*(ky-Math.floor(.5*penS))]=penE;
                
            }
            }
        }
        
        
    })
    
    //physics
        //gravity
    for(n=0;n<pC;n++){
    
        if(pA[n+1]==0&&pA[n]==1||pA[n]==3&&pA[n+1]==0||pA[n+1]==0&&pA[n]==69){
            if((n)%(pCX)==0){
                
            }
            
            pA_[n+1]=pA_[n];
            
            pA_[n]=0;
        }
               
        //bouancy
        if(pA[n]==1&&pA[n+1]==3&&pA_[n]==1&&pA_[n+1]==3||pA[n]==1&&pA[n+1]==4&&pA_[n]==1&&pA_[n+1]==4){
            pA_[n]=3;
            pA_[n+1]=1;
            
        }
if(pA[n]==69&&pA[n+1]==3&&pA_[n]==69&&pA_[n+1]==3||pA[n]==69&&pA[n+1]==4&&pA_[n]==69&&pA_[n+1]==4){
            pA_[n]=3;
            pA_[n+1]=69;
            
        }
if(pA[n]==3&&pA[n+1]==4&&pA_[n]==3&&pA_[n+1]==4){
            pA_[n]=4;
            pA_[n+1]=3;
            
        }
        

            //flow
        if(pA[n-1]>=1&&pA[n]==1&&pA[n+1]>=1){
            var r=Math.random()
            
            if(r<.5&&pA[n+pCY]==0&&pA_[n+pCY]==0){
                pA_[n+pCY]=1;
                pA_[n]=0;
                pA[n+pCY]=1;
                pA[n]=0;
            }
            else if(r<=.5&&pA[n-pCY]==0&&pA_[n-pCY]==0){
                pA_[n-pCY]=1;
                pA_[n]=0;
                pA[n-pCY]=1;
                pA[n]=0;
            }
            
            
        }
            //water flow
            if(pA[n]==3&&pA[n+1]>1){
                var r=Math.random();
                if(r>.5&&pA[n+pCY]==0&&pA_[n+pCY]==0){
                    pA_[n+pCY]=3;
                    pA_[n]=0;
                    pA[n+pCY]=3;
                    pA[n]=0
                }
                else if(r<.5&&pA[n-pCY]==0&&pA_[n-pCY]==0){
                    pA_[n-pCY]=3;
                    pA_[n]=0;
                    pA[n-pCY]=3;
                    pA[n]=0;
                }
                var r=Math.random();
                if(r<.001&&pA[n-1]==0&&pA_[n-1]==0){
                pA_[n-1]=4;
                pA_[n]=0
                }
                
            }
            //gas move
            if(pA[n]==4&&Math.random()<gasMC){
                var r=Math.random();
                if(r<.25&&pA[n+1]==0&&pA_[n+1]==0){
                    pA_[n+1]=4;
                    pA_[n]=0;
                    pA[n+1]=4;
                    pA[n]=0;
                }
                if(r<.5&&r>.25&&pA[n-1]==0&&pA_[n-1]==0){
                    pA_[n-1]=4;
                    pA_[n]=0;
                    pA[n-1]=4;
                    pA[n]=0;
                }
                if(r<.75&&r>.5&&pA[n+pCY]==0&&pA_[n+pCY]==0){
                    pA_[n+pCY]=4;
                    pA_[n]=0;
                    pA[n+pCY]=4;
                    pA[n]=0;
                }
                if(r<1&&r>.75&&pA[n-pCY]==0&&pA_[n-pCY]==0){
                    pA_[n-pCY]=4;
                    pA_[n]=0;
                    pA[n-pCY]=4;
                    pA[n]=0;
                }
                
            }
        //lightning
        
        //concept of movement by PJ Newhart
        
        
        if(pA[n]==6){
            
            if(pA[n+1]!=0||pA_[n+1]==0){
                
                pA_[n]=0;
                pA[n]=0;
                if(pA[n+1]==5||pA_[n+1]==5){
                    pA[n]=7;
                }
            }
            var r=Math.random();
            if(r<.33&&pA[n+pCY]==0&&pA_[n+pCY]==0){
                pA[n]=0;
                pA[n+pCY]=6;
                pA_[n]=0;
                pA_[n+pCY]=6;
            }
            if(r>.33&&r<.66&&pA[n-pCY]==0&&pA_[n-pCY]==0){
                pA[n]=0;
                pA[n-pCY]=6;
                pA_[n]=0;
                pA_[n-pCY]=6;
            }
            r=Math.random();
            if(r>.5&&pA[n+1]==0&&pA_[n+1]==0){
                pA[n]=0;
                pA[n+1]=6;
                pA_[n]=0;
                pA_[n+1]=6;
            }
        }
        
        //fire
        if(pA[n]==7){
            var r=Math.random();
            if(r<.01){
                pA[n]=0;
                pA_[n]=0;
            }
            var r=Math.random();
            if(r<.1&&pA[n-1]==0&&pA_[n-1]==0){
                pA[n]=0;
                pA[n-1]=7;
                pA_[n]=0;
                pA_[n-1]=7;
            }
            var r=Math.random();
            var r1=Math.random();
            if(r>.5&&r1<.05&&pA[n+pCY]==0&&pA_[n+pCY]==0){
                pA[n]=0;
                pA[n+pCY]=7;
                pA_[n]=0;
                pA_[n+pCY]=7;
            }
            if(r<.5&&r1<.05&&pA[n-pCY]==0&&pA_[n-pCY]==0){
                pA[n]=0;
                pA[n-pCY]=7;
                pA_[n]=0;
                pA_[n-pCY]=7;
            }
            
            
            for(x=-2;x<=2;x++){
                for(y=-2;y<=2;y++){
                var gasA=false;
                for(var x1=-7;x1<=7;x1++){
                    for(var y1=-7;y1<=7;y1++){
                         if(pA[n+y1+pCY*x1]==4&&pA_[n+y1+pCY*x1]==4){
                         var r=Math.random();
                            if(r<.000029){
                            pA_[n+y1+pCY*x1]=0;
                            }
                            
                            gasA=true;
                         }
          
          
                    }
                }
                if(pA[n+y+pCY*x]==3&&pA_[n+y+pCY*x]==3){
                    pA_[n]=4;
                }
                
                
                   var r=Math.random();
                   var r1=Math.random();
                    if(gasA==true&&r1<.05&&r<.1&&pA[n+y+pCY*x]==5&&pA_[n+y+pCY*x]==5){
                        
                        var r=Math.random();
                        
                        if(r<.75){
                            pA[n+y+pCY*x]=7;
                            pA_[n+y+pCY*x]=7;
                        }
                        else{
                            pA[n+y+pCY*x]=69;
                            pA_[n+y+pCY*x]=69;
                        }
                    }
                }
            }
        }
        

        
        
        
        
        
        
        
    }
    
    
    
    el1C=0;
    for(n=0;n<pC;n++){
        pA[n]=pA_[n];
        if(pA[n]==1){
        el1C++;
        }
        
        
    }
    
    
    
    
    
    ctx.fillStyle="#00FF00";
    if(penE==0){
        ctx.fillText("Erase", 10,15);
    }
    if(penE==1){
        ctx.fillText("Powder",10,15);
    }
    if(penE==2){
        ctx.fillText("Block",10,15);
    }
    if(penE==3){
        ctx.fillText("Water",10,15);
    }
    if(penE==4){
        ctx.fillText("Gas",10,15);
    }
    if(penE==5){
        ctx.fillText("Wood",10,15);
    }
    if(penE==6){
        ctx.fillText("Lightning",10,15);
    }
    if(penE==7){
        ctx.fillText("Fire",10,15);
    }
    
    
    
    if(penE==69){
        ctx.fillText("Ash",10,15);
    }
    
    ctx.fillText("Pen Size: " + penS,10,25);
    ctx.fillText("Amount of Powder: " + el1C,10,35)
    
    ctx.fillStyle="#FFFF00";
    ctx.fillText("ET-109",(maxW+minW)/2-20,20)
    
}


setInterval(tick,tickS)
