const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	gameEngine.entities = [];
	
	PARAMETERS.initialNetwork = {x: 0, y: 0, width: 200, height: 80,
		inputNeurons: [new Neuron({numInputs: 1, bias: -1, weights: [2]}), new Neuron({numInputs: 1, bias: -1, weights: [2]})], 
		hiddenNeurons: [new Neuron({numInputs: 2, bias: 0}), new Neuron({numInputs: 2, bias: 0})], 
		outputNeuron: new Neuron({numInputs: 2, bias: 0})};
	PARAMETERS.solutionNetwork = {x: 0, y: 0, width: 200, height: 80,
			inputNeurons: [new Neuron({numInputs: 1, bias: -1, weights: [2]}), new Neuron({numInputs: 1, bias: -1, weights: [2]})], 
			hiddenNeurons: [new Neuron({numInputs: 2, bias: -1, weights: [1, -2]}), new Neuron({numInputs: 2, bias: -1, weights: [-2, 1]})], 
			outputNeuron: new Neuron({numInputs: 2, bias: 0, weights: [1, 1]})};
	
	let population = new Population(12);
	gameEngine.addEntity(population);

	gameEngine.init(ctx);

	gameEngine.start();
});
