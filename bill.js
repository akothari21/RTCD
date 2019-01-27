
import * as ui from './ui.js';
import {Webcam} from './webcam.js';
const webcam = new Webcam(document.getElementById('webcam'));
var billinp = document.getElementById('billinput');
var idx=1;
billinp.addEventListener('keypress', function(event){
    
    if(event.which==13){
        console.log(billinp.value);
        var node = document.createElement("LI");
        var sp= document.createElement("span");
        
        sp.setAttribute('id',idx);        
        //var text = document.createTextNode(idx);
        //sp.appendChild(text);
        //node.appendChild(sp);               
        var textnode = document.createTextNode(billinp.value);         
        node.appendChild(textnode);
        var ul=document.getElementById('pls');                              
        document.getElementById('pls').appendChild(node);     
        billinp.value="";
        var del = ul.children;
        console.log(del);
        idx++;
    }
    
})
var list = document.getElementById("pls");
var clear=document.getElementById('clear');
clear.addEventListener('click',function(){
    while (list.hasChildNodes()) {   
        list.removeChild(list.firstChild);
    }
})
// 
//var del = list.children;
//var abc= del.children;

//abc.addEventListener('click', function(event){

//console.log(del.id);
//list.removeChild(list.parentNodes[del.id]);  
//})
var home = document.getElementById('home');
var x = document.getElementById('billlist');
var y=document.getElementById('trainer')
var genbill= document.getElementById('customer');
genbill.addEventListener('click', function(){
    
   
        x.style.display = "block";
       // y.style.display = "none";
    
    
})
home.addEventListener('click', function(){
    
   
    x.style.display = "none";
    //y.style.display = "block";

})









async function init() {
    try {
      await webcam.setup();
    } catch (e) {
      document.getElementById('no-webcam').style.display = 'block';
    }
    
  }
  
  // Initialize the application.
  init();