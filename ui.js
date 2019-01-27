const learningRateElement = document.getElementById('learningRate');
export const getLearningRate = () => +learningRateElement.value;

const batchSizeFractionElement = document.getElementById('batchSizeFraction');
export const getBatchSizeFraction = () => +batchSizeFractionElement.value;

const epochsElement = document.getElementById('epochs');
export const getEpochs = () => +epochsElement.value;

const denseUnitsElement = document.getElementById('dense-units');
export const getDenseUnits = () => +denseUnitsElement.value;

const statusElement = document.getElementById('status');
const trainStatusElement = document.getElementById('train-status');

export function predictClass(classId) {
    console.log("classid",classId);
    var itemname = document.getElementById('list');
    document.getElementById('predval').innerHTML=list.options[classId-1].text;
    /*document.getElementById('pls').innerHTML=classId;
    var node = document.createElement("LI");
        var sp= document.createElement("span");
        
        //sp.setAttribute('id',idx);        
        //var text = document.createTextNode(idx);
       /* sp.appendChild(text);
        node.appendChild(sp);               
        var textnode = document.createTextNode(classId);         
        node.appendChild(textnode);
        var ul=document.getElementById('pls');                              
        document.getElementById('pls').appendChild(node);     
        billinp.value="";
        var del = ul.children;
        console.log(del); */
  }

export function donePredicting() {
    statusElement.style.visibility = 'hidden';
  }

export function isPredicting() {
    statusElement.style.visibility = 'visible';
  }
export let addExampleHandler;
export function setExampleHandler(handler) {
    addExampleHandler = handler;
  }
export function trainStatus(status) {
    trainStatusElement.innerText = status;
}




    const thumbDisplayed = {};

    export function drawThumb(img, label) {
        if (thumbDisplayed[label] == null) {
          const thumbCanvas = document.getElementById('myCanvas');
          draw(img, thumbCanvas);
          var dataURL = thumbCanvas.toDataURL();
          console.log(dataURL);
          //document.getElementById('add').href = dataURL;
        }
      }
      
      export function draw(image, canvas) {
        const [width, height] = [224, 224];
        const ctx = canvas.getContext('2d');
        const imageData = new ImageData(width, height);
        const data = image.dataSync();
        for (let i = 0; i < height * width; ++i) {
          const j = i * 4;
          imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
          imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
          imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
          imageData.data[j + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    