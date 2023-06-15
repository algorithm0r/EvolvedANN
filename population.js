class Population {
	constructor(populationSize) {
		this.populationSize = populationSize;
		this.networks = [];

		for (let i = 0; i < populationSize; i++) {
			const network = new NeuralNetwork(PARAMETERS.initialNetwork);
			// const network = new NeuralNetwork(PARAMETERS.solutionNetwork);
			network.mutate();
			network.y = i * network.height;
			this.networks.push(network);
		}

		this.evolutionTickCounter = 0;
		this.generation = 0;
	}

	evolve() {
		this.generation++;
		this.calculateFitness();
		this.selection();
		this.reproduction();
	}

	calculateFitness() {
		for (let network of this.networks) {
			let fitness = 0;

			// Evaluate the fitness by testing the network's performance on XOR problem
			const inputs = PARAMETERS.inputs;

			const expectedOutputs = PARAMETERS.expectedOutputs;

			for (let j = 0; j < inputs.length; j++) {
				const output = network.feedForward(inputs[j]);
				const expectedOutput = expectedOutputs[j];

				fitness += 1 - Math.abs(output - expectedOutput);
			}

			network.fitness = fitness;
		}
	}

	selection() {
		this.networks.sort((a, b) => b.fitness - a.fitness); // Sort networks by fitness (descending order)

		// Keep the top half of the networks as parents for reproduction
		const numParents = Math.floor(this.populationSize / 2);
		this.networks = this.networks.slice(0, numParents);
	}

	reproduction() {
		const numOffspring = this.populationSize - this.networks.length;

		for (let i = 0; i < numOffspring; i++) {
			const parentA = this.getRandomParent();
			const parentB = this.getRandomParent();

			const offspring = this.crossover(parentA, parentB);
			offspring.mutate(0.1); // Mutation rate of 0.1 (10%)

			this.networks.push(offspring);
		}
		this.networks.sort((a, b) => b.fitness - a.fitness);
	}

	getRandomParent() {
		const randomIndex = randomInt(this.networks.length);
		return this.networks[randomIndex];
	}

	crossover(parentA, parentB) {
		const offspring = new NeuralNetwork(parentA);

		// Perform crossover by randomly selecting weights from parentA and parentB
		for (let i = 0; i < offspring.hiddenNeurons.length; i++) {
			for (let j = 0; j < offspring.hiddenNeurons[i].weights.length; j++) {
				offspring.hiddenNeurons[i].weights[j] = Math.random() < 0.5 ? parentA.hiddenNeurons[i].weights[j] : parentB.hiddenNeurons[i].weights[j];
			}
		}

		for (let j = 0; j < offspring.outputNeuron.weights.length; j++) {
			offspring.outputNeuron.weights[j] = Math.random() < 0.5 ? parentA.outputNeuron.weights[j] : parentB.outputNeuron.weights[j];
		}

		return offspring;
	}

	update() {
		this.evolutionTickCounter++;

		if (this.evolutionTickCounter >= 1) {
			this.evolve();

			// arrange networks for display
			for (let i = 0; i < this.networks.length; i++) {
				this.networks[i].y = i * this.networks[i].height;
			}

			this.evolutionTickCounter = 0;
		}
	}

	draw(ctx) {
		this.networks.forEach(network => network.draw(ctx));

		ctx.font = '16px Arial';
		ctx.fillStyle = 'black';
		ctx.fillText(`Generation: ${this.generation}`, 870, 20);
	}
}
