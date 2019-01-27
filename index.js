 import {Dataset} from './dataset.js';
import * as ui from './ui.js';
import {Webcam} from './webcam.js';



//No. of classes for classification
const NUM_CLASSES = 20;
const data = new Dataset(NUM_CLASSES);
let mobilenet;
let model;
const webcam = new Webcam(document.getElementById('webcam'));
let stmodels;

async function loadMobilenet() {
    console.log("check");
    const mobilenet = await tf.loadModel(
        'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
  
    // Return a model that outputs an internal activation.
    const layer = mobilenet.getLayer('conv_pw_13_relu');
    return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

ui.setExampleHandler(label => {
    tf.tidy(() => {
      const img = webcam.capture();
      data.addExample(mobilenet.predict(img), label);
  
      // Draw the preview thumbnail.
     
        ui.drawThumb(img, label);   
      
      
        //console.log(data.data.xs);

     
      console.log("label selected",label)
    });
});



 //Label as selected by user
var sel = document.getElementById('list');
var btn = document.getElementById('add');

btn.addEventListener("click", function(){  
  console.log(sel.value, predval.innerHTML);
  ui.addExampleHandler(sel.value);
})



  async function train() {
    
    console.log("index",data.xs);
    if (data.xs == null) {
      throw new Error('Add some examples before training!');
      
    }
    else{
        //console.log(data.data.xs)
        //var abc=  localStorage.setItem('x',data.data.xs);
        //localStorage.setItem('y',data.data.ys);
        //console.log("abc", abc);
    }
  
    // Creates a 2-layer fully connected model. 
    if(stmodels==null){
    model = tf.sequential({
      layers: [
         
        tf.layers.flatten({inputShape: [7, 7, 256]}),
        // Layer 1
        tf.layers.dense({
          units: ui.getDenseUnits(),
          activation: 'relu',
          kernelInitializer: 'varianceScaling',
          useBias: true
        }),
        // Layer 2. The number of units of the last layer should correspond
        // to the number of classes we want to predict.
        tf.layers.dense({
          units: NUM_CLASSES,
          kernelInitializer: 'varianceScaling',
          useBias: false,
          activation: 'softmax'
        })
      ]
    });

  }

  else{
    model=stmodels;
  }
    

    
  
    // Creates the optimizers which drives training of the model.
    const optimizer = tf.train.adam(ui.getLearningRate());
    
    model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});
    
    
    const batchSize = 5;
        //Math.floor(data.xs.shape[0] * ui.getBatchSizeFraction());
    if (!(batchSize > 0)) {
      throw new Error(
          `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
    }
    //save the model to loaclstorage
    
    
    

  
    // Train and shuffle the model
    await model.fit(data.xs, data.ys, {
      batchSize,
      epochs: ui.getEpochs(),
      callbacks: {
        onBatchEnd: async (batch, logs) => {
          ui.trainStatus('Loss: ' + logs.loss.toFixed(5));
          await tf.nextFrame();
        }
      }

    });

    await model.save('indexeddb://my-model-1');
    
  }

  if(stmodels!=null){
    model=stmodels;
  }




let isPredicting = false;

async function predict() {
  ui.isPredicting();
  stmodels = await tf.loadModel('indexeddb://my-model-1');
  if(stmodels!=null){
    model=stmodels;
  }
  
  while (isPredicting) {
    const predictedClass = tf.tidy(() => {
      // Capture the frame from the webcam.
      const img = webcam.capture();

      // Make a prediction through mobilenet, getting the internal activation of
      // the mobilenet model.
      const activation = mobilenet.predict(img);

      // Make a prediction through our newly-trained model using the activation
      // from mobilenet as input.
      const predictions = model.predict(activation);
      //const predictionss = model.predict(activation);
    

      // Returns the index with the maximum probability. This number corresponds
      // to the class the model thinks is the most probable given the input.
      return predictions.as1D().argMax();
    });

    const classId = (await predictedClass.data())[0];
    predictedClass.dispose();
    //To send predicted label to the UI
    ui.predictClass(classId);
    await tf.nextFrame();
  }
  ui.donePredicting();
}

document.getElementById('train').addEventListener('click', async () => {
    ui.trainStatus('Training...');
    await tf.nextFrame();
    await tf.nextFrame();
    isPredicting = false;
    train();
});

document.getElementById('predict').addEventListener('click', () => {
    isPredicting = true;
    predict();
});

async function init() {
    try {
      await webcam.setup();
    } catch (e) {
      document.getElementById('no-webcam').style.display = 'block';
    }
    mobilenet = await loadMobilenet();

  
    // Warm up the model. This uploads weights to the GPU and compiles the WebGL
    // programs so the first time we collect data from the webcam it will be
    // quick.
    tf.tidy(() => mobilenet.predict(webcam.capture()));
     
  }
  
  // Initialize the application.
  init();
