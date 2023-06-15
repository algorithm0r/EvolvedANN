class NeuralNetwork {
	constructor(other) {
		Object.assign(this, other);
		this.inputNeurons = this.inputNeurons.map(neuron => new Neuron(neuron));
		this.hiddenNeurons = this.hiddenNeurons.map(neuron => new Neuron(neuron));
		this.outputNeuron = new Neuron(this.outputNeuron);
	}

	feedForward(inputs) {
		const inputOutputs = this.inputNeurons.map((neuron, index) => neuron.activate([inputs[index]]));
		const hiddenOutputs = this.hiddenNeurons.map(neuron => neuron.activate(inputOutputs));
		const output = this.outputNeuron.activate(hiddenOutputs);
		return output;
	}

	mutate() {
		for (let neuron of this.hiddenNeurons) {
			neuron.mutate();
		}

		this.outputNeuron.mutate();
	}

	update() {

	}

	drawNetwork(ctx, x, y) {
		const networkWidth = this.width;
		const networkHeight = this.height;

		const inputLayerX = networkWidth * 0.15;
		const hiddenLayerX = networkWidth * 0.5;
		const outputLayerX = networkWidth * 0.85;

		const layerY = networkHeight * 0.5;
		const neuronRadius = 10;
		const neuronPadding = 10;

		const borderPadding = 6;

		// Draw dashed outline
		ctx.strokeStyle = "#E0E0E0";
		ctx.setLineDash([5, 5]);
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.rect(x + borderPadding, y + borderPadding, this.width - 2 * borderPadding, this.height - 2 * borderPadding);
		ctx.stroke();
		ctx.setLineDash([1, 0]);

		// Draw connections and neurons for the input layer
		for (let i = 0; i < this.inputNeurons.length; i++) {
			const neuron = this.inputNeurons[i];
			const neuronY = layerY - (this.inputNeurons.length - 1) * (neuronRadius + neuronPadding / 2) + i * (neuronRadius * 2 + neuronPadding);

			neuron.draw(ctx, x + inputLayerX, y + neuronY);

			for (let j = 0; j < this.hiddenNeurons.length; j++) {
				const hiddenNeuron = this.hiddenNeurons[j];
				const weight = hiddenNeuron.weights[i];

				ctx.beginPath();
				ctx.moveTo(x + inputLayerX + neuronRadius, y + neuronY);
				ctx.lineTo(x + hiddenLayerX - neuronRadius, y + layerY - (this.hiddenNeurons.length - 1) * (neuronRadius + neuronPadding / 2) + j * (neuronRadius * 2 + neuronPadding));
				ctx.strokeStyle = weight > 0 ? 'darkgreen' : 'darkred';
				ctx.lineWidth = Math.abs(weight) * 2;
				ctx.stroke();
			}
		}

		// Draw connections and neurons for the hidden layer
		for (let i = 0; i < this.hiddenNeurons.length; i++) {
			const neuron = this.hiddenNeurons[i];
			const neuronY = layerY - (this.hiddenNeurons.length - 1) * (neuronRadius + neuronPadding / 2) + i * (neuronRadius * 2 + neuronPadding);

			neuron.draw(ctx, x + hiddenLayerX, y + neuronY);

			const weight = this.outputNeuron.weights[i];

			ctx.beginPath();
			ctx.moveTo(x + hiddenLayerX + neuronRadius, y + neuronY);
			ctx.lineTo(x + outputLayerX - neuronRadius, y + layerY);
			ctx.strokeStyle = weight > 0 ? 'darkgreen' : 'darkred';
			ctx.lineWidth = Math.abs(weight) * 2;
			ctx.stroke();
		}

		// Draw the output layer
		const outputNeuron = this.outputNeuron;

		outputNeuron.draw(ctx, x + outputLayerX, y + layerY);

		ctx.font = '10px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText(`Output: ${outputNeuron.activation.toFixed(2)}`, x + networkWidth * 0.65, y + networkHeight * 0.8);
	}

	draw(ctx) {
		const padding = 3;

		this.feedForward([0, 0]);
		this.drawNetwork(ctx, this.x, this.y);
		this.feedForward([1, 0]);
		this.drawNetwork(ctx, this.x + this.width, this.y);
		this.feedForward([0, 1]);
		this.drawNetwork(ctx, this.x + 2 * this.width, this.y);
		this.feedForward([1, 1]);
		this.drawNetwork(ctx, this.x + 3 * this.width, this.y);

		ctx.font = '10px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText(`Fitness: ${this.fitness?.toFixed(2)}`, this.x + this.width * 4, this.y + this.height * 0.2);

		ctx.strokeStyle = "#A0A0A0";
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.rect(this.x + padding, this.y + padding, this.width * 4.33 - 2 * padding, this.height - 2 * padding);
		ctx.stroke();
	}
}
