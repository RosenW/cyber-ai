// Neural Network V1
// Hardcoded functionality (input, output, cost conditions)
// No network memory
// Learning method: Gradient Descent by calculating slope, no Calculus optimization
// Unpolished
// Network has 2 input nodes, n hidden layers with size k, 2 output nodes (fruit.is_poisonous)
// No API
const obj = {
    stack: null,
    fruits: [],
    fruit_count: 9,
    fruit_props_max: 50,
    poison_threshold: 60,
    learn_rate: 0.4,
    GetRandomValue: function () {
        return Math.random() * (Math.random() < 0.5 ? 1 : -1);
    },
    GetRandomInt: function (max) {
        return Math.floor(Math.random() * max);
    },
    ShowFruits: function () {
        // TODO: Add batch size param
        for (let i = 0; i < obj.fruit_count; i += 3) {
            let batch = obj.fruits.slice(i, i + 3).map((x) => {
                let total = x.spikes + x.spots;
                let total_str = total.toString();
                if (total_str.length === 1) {
                    total_str = "0" + total_str;
                } 

                return total_str;
            });

            console.log(JSON.stringify(batch));
        }

        console.log();
    },
    Round2: function (num) {
        return Math.round(num * 100) / 100;
    },
    Round3: function (num) {
        return Math.round(num * 1000) / 1000;
    },
    Round4: function (num) {
        return Math.round(num * 10000) / 10000;
    },
    GenerateFruits: function (count = obj.fruit_count) {
        obj.fruits = [];

        // Generating Fruits
        for (let i = 0; i < count; i++) {
            const new_fruit = {
                "spikes": obj.GetRandomInt(obj.fruit_props_max),
                "spots" : obj.GetRandomInt(obj.fruit_props_max)
            };

            // poisonous cond: if sum of values is more than threshold
            new_fruit["is_poisonous"] = (new_fruit["spikes"] + new_fruit["spots"]) > obj.poison_threshold;
            
            // poisonous cond: if any value is more than threshold
            //new_fruit["is_poisonous"] = new_fruit["spikes"] > obj.poison_threshold || new_fruit["spots"] > obj.poison_threshold;
            obj.fruits.push(new_fruit);
        }
    },
    Network: function (input_size, hidden_layers_sizes, output_size) {
        console.log("Generating Network (" + input_size + ", [" + hidden_layers_sizes.join(", ") + "], " + output_size + ")");

        const Node = function (name, out_layer = null) {
            this.name = name;
            this.value = null;
            this.bias = obj.GetRandomValue();
            this.out_layer = out_layer;
            this.out_nodes = [];

            this.weight_gradient_changes = [];
            this.bias_gradient_change = null;

            if (this.out_layer != null) {
                this.out_nodes = out_layer.nodes.map((x) => { return { "weight": obj.GetRandomValue(), "node": x } });
            }
        };

        const Layer = function (name, size, next_layer = null) {
            this.name = name;
            this.size = size;
            this.next_layer = next_layer;
            this.nodes = [];

            for (let i = 0; i < this.size; i++) {
                this.nodes.push(new Node(name + ": " + i, this.next_layer));
            }
        }

        this.input_size = input_size;
        this.output_size = output_size;

        this.layers = [];

        // Creating Output Layer
        this.outputs = new Layer("Outputs", this.output_size);
        this.layers.unshift(this.outputs);

        // Creating Hidden Layers
        this.hidden_layers = [];
        for (let i = 0; i < hidden_layers_sizes.length; i++) {
            let hidden_layer_size = hidden_layers_sizes[i];
            let hidden_layer_obj = new Layer("Hiddens " + (hidden_layers_sizes.length - i), hidden_layer_size, this.layers[0]);

            this.layers.unshift(hidden_layer_obj);
            this.hidden_layers.unshift(hidden_layer_obj);
        }

        // Creating Input layer
        this.inputs = new Layer("Inputs", this.input_size, this.layers[0]);
        this.layers.unshift(this.inputs);

        this.ActivationFunction = function (weighted_input) {
            return 1 / (1 + (weighted_input * weighted_input)); // Sigmoid (all values to /-1 to 1/)
        };

        this.NormalizeInput = function (num) {
            return (num * 2) / 100;
        }

        this.Calculate = function(input_values_arr) {
            // Setting input values
            for (let l = 0; l < this.layers[0].size; l++) {
                this.layers[0].nodes[l].value = this.NormalizeInput(input_values_arr[l]);
            }

            // Calculating all node values according to inputs
            // Starting from second layer (first is Inputs, we dont have to calc for them, they are given)
            for (let l = 1; l < this.layers.length; l++) {
                let layer = this.layers[l];
                let prev_layer = this.layers[l - 1];

                // Iterating current layer to calc value
                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];
                    let weighted_input = node.bias;

                    // Iterating previous layer to get/use all weights for current layer
                    for (let j = 0; j < prev_layer.size; j++) {
                        let prev_node = prev_layer.nodes[j];

                        // add previous node value multiplied by the weight towards current node
                        weighted_input += (prev_node.value * prev_node.out_nodes[i].weight);

                        // ROS DEBUG CALCULATING WEIGHTED INPUT
                        //console.log("I: " + i);
                        //console.log("J: " + j);
                        //console.log("Prev Node: " + prev_node.name);
                        //console.log("Prev Node OUT NODE: " + JSON.stringify(prev_node.out_nodes[i].node.name));
                        //console.log("New Weight: " + (prev_node.value * prev_node.out_nodes[i].weight));
                        //console.log("Total Weighted Input: " + weighted_input);
                    }

                    let activation = this.ActivationFunction(weighted_input);

                    //console.log("Activation: " + activation);
                    node.value = activation;
                }
            }

            // return out layer
            return this.GetOutputLayer();
        }

        this.Learn = function (fruits, learn_rate) {
            // TODO: show actual learnign fruits
            const h = 0.0001; // Weight change value, step value
            let original_cost = this.TotalAvgCost(fruits);

            for (let l = 0; l < this.layers.length; l++) {
                let layer = this.layers[l];

                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];

                    // Calculate bias gradient change
                    // delta = f(x + h) - f(x)
                    // slope = delta / h
                    // change = slope * learn_rate
                    node.bias += h; // Change bias
                    let bias_delta_cost = this.TotalAvgCost(fruits) - original_cost // test new bias
                    node.bias -= h; // Revert bias
                    let bias_slope = (bias_delta_cost  / h);
                    node.bias_gradient_change = bias_slope * learn_rate;

                    // Calculate weight gradient changes
                    // Same formula as bias change
                    for (let j = 0; j < node.out_nodes.length; j++) {
                        node.out_nodes[j].weight += h; // change weight
                        let new_cost = this.TotalAvgCost(fruits);
                        let weight_delta_cost = new_cost - original_cost; // test new weight
                        node.out_nodes[j].weight -= h; // revert changes

                        // Calculate weight change
                        let slope = (weight_delta_cost / h);
                        node.weight_gradient_changes.push(slope * learn_rate);
                        
                        // ROS DEBUG 
                        //console.log();
                        //console.log("Changing Weight: (" + node.name + ") to (" + node.out_nodes[j].node.name + ")");
                        //console.log("old_weight: " + node.out_nodes[j].weight);
                        //console.log("new_weight: " + (node.out_nodes[j].weight + h));

                        //console.log("old_cost: " + original_cost);
                        //console.log("new_cost: " + new_cost);

                        //console.log("delta: " + weight_delta_cost);

                        //console.log("slope: " + slope);
                        //console.log("gradient change: " + (slope * learn_rate));
                    }
                }
            }

            // Gradients are set, now apply all changes at once
            // This end the current learning cycle
            this.ApplyGradients();

            // Returning current training cost for convenience
            return original_cost;
        }

        this.ApplyGradients = function () {
            for (let l = 0; l < this.layers.length; l++) {
                let layer = this.layers[l];

                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];
                    // ROS DEBUG BIAS APPLY
                    //console.log(node.name + ": bias_change - " + node.bias_gradient_change);

                    // Setting new biases
                    node.bias -= node.bias_gradient_change;

                    // Setting new weights
                    for (let j = 0; j < node.out_nodes.length; j++) {
                        // ROS DEBUG WEIGHT APPLY
                        // console.log(node.name + " - " + node.out_nodes[j].node.name + ": weight_change - " + node.weight_gradient_changes[j]);
                        node.out_nodes[j].weight -= node.weight_gradient_changes[j];
                    }
                }
            }
        }

        this.NodeCost = function (out, exp) {
            let err = out - exp;
            err = err * err;

            return err;
        }

        // fruit = { spikes: num, spots: num, is_poisonous: bool}
        this.SingleCost = function (fruit) {
            let output_result = this.Calculate([fruit.spikes, fruit.spots]);
            let cost = 0;

            let true_cost = this.NodeCost(output_result.nodes[0].value, (fruit.is_poisonous ? 1 : 0));
            let false_cost = this.NodeCost(output_result.nodes[1].value, (fruit.is_poisonous ? 0 : 1));

            cost += true_cost;
            cost += false_cost;

            // ROS DEBUG COST
            //console.log("Fruit: " + JSON.stringify(fruit));
            //console.log("Is Poisonous: " + fruit.is_poisonous);
            //console.log("True  out: " + output_result.nodes[0].value);
            //console.log("True  cost: " + true_cost);
            //console.log("False out: " + output_result.nodes[1].value);
            //console.log("False cost: " + false_cost);

            return cost;
        }

        this.TotalAvgCost = function (fruits) {
            let total_cost = 0;

            for (let i = 0; i < fruits.length; i++) {
                total_cost += this.SingleCost(fruits[i]);
            }

            return total_cost / fruits.length;
        }

        this.Show = function () {
            console.log();
            for (let l = 0; l < this.layers.length; l++) {
                let layer = this.layers[l];
                console.log("Logging " + layer.name + " nodes: ");

                // Iterating current layer to show nodes
                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];
                    console.log(
                          "Node: "  + node.name + "; "
                        + "Value: " + obj.Round2(node.value) + "; "
                        + "Bias: "  + obj.Round2(node.bias) + "; "
                        + "Node-Weight: [" + node.out_nodes.map((x) => { return x.node.name + " - " + obj.Round2(x.weight) }).join(", ") + "];"
                    );
                }
            }

            console.log();
        }

        this.GetOutputLayer = function () {
            return this.layers[this.layers.length - 1];
        }

        this.Test = function (fruit) {
            //console.log("Testing fruit: " + fruit.spikes + ", " + fruit.spots + ", " + fruit.is_poisonous);
            let result = this.Calculate( [fruit.spikes, fruit.spots] );

            // TODO: Iterate result values
            //let out_sum = result.nodes[0].value + result.nodes[1].value;

            // Calculate out percentage
            //console.log("Is  Poisonous: " + ((result.nodes[0].value * 100) / out_sum));
            //console.log("Not Poisonous: " + ((result.nodes[1].value * 100) / out_sum));
            
            return result.nodes[0].value > result.nodes[1].value;
        }

        this.TestBatch = function (batch = obj.fruits) {
            let right = 0;

            for (let i = 0; i < batch.length; i++) {
                let fruit = batch[i];
                let is_poisonous = this.Test(fruit);

                if (is_poisonous == fruit.is_poisonous) {
                    right++;
                }
            }

            console.log("Correct: " + right + "/" + batch.length);
        }

        this.LearnForGenerations = function(gen_count, cycles, batch_size) {
            for (let g = 0; g < gen_count; g++) {
                let gen_total_cost = 0;
                obj.GenerateFruits(batch_size);
                
                let cost = null;
                for (let c = 0; c < cycles; c++) {
                    cost = this.Learn(obj.fruits, obj.learn_rate);
                    gen_total_cost += cost;
                }

                let gen_avg_cost = gen_total_cost / cycles;
                console.log("Generation " + g + " Cost: " + obj.Round3(gen_avg_cost));
            }

            console.log();
        }
    },
    pub: {
        Init: function (stack) {
            obj.stack = stack;

            // Generating Network
            let network = new obj.Network(2, [ 10 ], 2);
            network.Show();

            // Testing Network
            console.log("Testing Network with 1000 fruits.");
            obj.GenerateFruits(1000);
            network.TestBatch();

            // Learning Procedure
            console.log();
            console.log("Learning for 1 generations, 3 cycles per generation, with 100 random fruits.");
            network.LearnForGenerations(500, 3, 10);

            // Testing Network
            console.log("Testing Network with 1000 fruits.");
            obj.GenerateFruits(1000);
            network.TestBatch();
        }
    }
}

module.exports = obj.pub;
