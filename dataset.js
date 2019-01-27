export class Dataset {
    constructor(numClasses) {
      this.numClasses = numClasses;
    }
  
    
    addExample(example, label) {
      // One-hot encode the label.
      const y = tf.tidy(
          () => tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses)
      );
  
      if (this.xs == null && localStorage.getItem('xs')==null) {
        // For the first example that gets added, keep example and y so that the
        // Dataset owns the memory of the inputs.
        this.xs = tf.keep(example);
        localStorage.setItem('xs', this.xs.dataSync());
        localStorage.setItem('xshape', this.xs.shape);
        this.ys = tf.keep(y);
        localStorage.setItem('ys', this.ys.dataSync());
        localStorage.setItem('yshape', this.ys.shape);
      } else {
        //JSONstring concat save
        const oldX = tf.tensor(JSON.parse('[' +localStorage.getItem('xs') + ']') , JSON.parse('[' +localStorage.getItem('xshape') + ']'));
        this.xs = tf.keep(oldX.concat(example, 0));
        
        localStorage.setItem('xs', this.xs.dataSync());
        localStorage.setItem('xshape', this.xs.shape);
  
        const oldY = tf.tensor(JSON.parse('[' +localStorage.getItem('ys') + ']') , JSON.parse('[' +localStorage.getItem('yshape') + ']'));
        this.ys = tf.keep(oldY.concat(y, 0));
        localStorage.setItem('ys', this.ys.dataSync());
        localStorage.setItem('yshape', this.ys.shape);
        
  
        oldX.dispose();
        oldY.dispose();
        y.dispose();
        
      }
    
    }
  }