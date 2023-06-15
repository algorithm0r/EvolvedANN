class Neuron {
	constructor(other) {
	  // Initialize weights randomly if none exists
	  this.weights = other.weights ? [...other.weights] : [];
	  for (let i = this.weights.length; i < other.numInputs; i++) {
		this.weights.push(Math.random() * 2 - 1);
	  }
  
	  // Initialize bias randomly if none exists
	  this.bias = other.bias + 1 >= 0 ? other.bias : Math.random() * 2 - 1;

	  this.activation = this.bias;
	}
  
	activate(inputs) {
	  // Calculate the weighted sum of inputs
	  let weightedSum = 0;
	  for (let i = 0; i < inputs.length; i++) {
		weightedSum += inputs[i] * this.weights[i];
	  }
  
	  // Apply activation function (e.g., sigmoid)
	  const activation = this.sigmoid(weightedSum + this.bias);
  
	  this.activation = activation;
	  return activation;
	}
  
	sigmoid(x) {
	  return 1 / (1 + Math.exp(-4 * x));
	}

	mutate() {
		for (let i = 0; i < this.weights.length; i++) {
		  if (Math.random() < PARAMETERS.mutationRate) {
			this.weights[i] += (Math.random() * 2 - 1) * PARAMETERS.mutationRange;
		  }
		  if (Math.random() < PARAMETERS.mutationRate) {
			this.weights[i] = -this.weights[i];
		  }
		  if(this.weights[i] > 3) this.weights[i] = 3;
		  if(this.weights[i] < -3) this.weights[i] = -3;
		}
		if (Math.random() < PARAMETERS.mutationRate) {
		  this.bias += (Math.random() * 2 - 1) * PARAMETERS.mutationRange; 
		}
		if (Math.random() < PARAMETERS.mutationRate) {
			this.bias = -this.bias;
		}
		if(this.bias > 3) this.bias = 3;
		if(this.bias < -3) this.bias = -3;
	}

	draw(ctx, x, y) {
		ctx.beginPath();
		ctx.arc(x, y, PARAMETERS.neuronRadius, 0, 2 * Math.PI);
		ctx.fillStyle = this.activation > 0.5 ? 'lightgreen' : 'pink';
		ctx.strokeStyle = this.bias > 0 ? 'darkgreen' : 'darkred';
		ctx.lineWidth = Math.abs(this.bias);
		ctx.fill();
		ctx.stroke();
	}
  }
  