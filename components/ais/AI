// Neural Network V1
// Custom functionality
// No network memory
// Learning method: Gradient Descent by calculating slope, no Calculus optimization
// Unpolished
// Network layers and sizes based on params
// Has API
const obj = {
    stack: null,
    learn_rate: 5,
    batch_size: 10,
    data: [],
    network: null,
    GetRandomValue: function () {
        return Math.random() * (Math.random() < 0.5 ? 1 : -1);
    },
    GetRandomInt: function (max) {
        return Math.floor(Math.random() * max);
    },
    // num: number, decimal_places: int; Out: number;
    // example: num = 0.34253, decimal_places = 3; Out: 0.343; 
    Round: function (num, decimal_places) {
        let multiplier = 10 ** decimal_places;
        return Math.round(num * multiplier) / multiplier;
    },
    Network: function (layers_sizes_arr) {
        console.log("Generating Network (" + layers_sizes_arr.join(", ") + ")");

        const Node = function (name, real_value, out_layer = null) {
            this.name = name;
            this.real_value = real_value;
            this.value = null;
            this.weighted_input = null;
            this.bias = obj.GetRandomValue();
            this.out_layer = out_layer;
            this.out_nodes = [];

            this.weight_gradient_changes = [];
            this.bias_gradient_change = null;

            if (this.out_layer != null) {
                this.out_nodes = out_layer.nodes.map((x) => { return { "weight": obj.GetRandomValue(), "node": x } });
            }
        };

        const Layer = function (name, size, next_layer = null, layer_index) {
            this.name = name;
            this.size = size;
            this.next_layer = next_layer;
            this.nodes = [];
            this.layer_index = layer_index;

            for (let i = 0; i < this.size; i++) {
                this.nodes.push(new Node(name + ": " + i, i, this.next_layer));
            }
        }

        this.layers = [];

        // Creating Layers
        for (let i = layers_sizes_arr.length - 1; i >= 0; i--) {
            let layer_size = layers_sizes_arr[i];
            let next_layer = this.layers.length > 0 ? this.layers[0] : null;
            let layer_obj = new Layer("Layer " + i, layer_size, next_layer, i);

            this.layers.unshift(layer_obj);
        }

        this.Sigmoid = function (num) {
            // Sigmoid (all values to /0 to 1/)
            return 1 / (1 + Math.exp(-1 * num));
        }

        // Squishes Weighted Input to (0 to 1)
        this.ActivationFunction = function (weighted_input) {
            return this.Sigmoid(weighted_input);
        };

        // Input values to reasonable values
        // TODO: Implement formula
        // Formula: x1 = ((x - x_min) / (x_max - x_min)) * ((u - l) + l)
        // x1 - result;
        // x - normalization value;
        // x_min - minimum expected;
        // x_max - maximum expected;
        // u - upper result value;
        // l - lower result value;
        this.NormalizeInput = function (num) {
            return num / 256;
        }

        this.Calculate = function(input_values_arr, log = false) {
            // Setting input values
            for (let l = 0; l < this.layers[0].size; l++) {
                this.layers[0].nodes[l].value = this.NormalizeInput(input_values_arr[l]);
            }
            //if (log) {
            //    console.log("CALCING: ");
            //    console.log(input_values_arr);
            //    console.log("Layer 0: ")
            //    console.log(this.layers[0])
            //}

            // Calculating all node values according to inputs
            // Starting from second layer (first is Inputs, we dont have to calc for them, they are given)
            for (let l = 1; l < this.layers.length; l++) {
                let layer = this.layers[l];
                let prev_layer = this.layers[l - 1];

                // Iterating current layer to calc value
                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];
                    let weighted_input = 0;

                    // Iterating previous layer to get/use all weights for current layer
                    for (let j = 0; j < prev_layer.size; j++) {
                        let prev_node = prev_layer.nodes[j];

                        // add previous node value multiplied by the weight towards current node
                        weighted_input += (prev_node.value * prev_node.out_nodes[i].weight);
                    }

                    weighted_input += node.bias;
                    let activation = this.ActivationFunction(weighted_input);

                    node.weighted_input = weighted_input;
                    node.value = activation;
                }
            }

            // return out layer
            return this.GetOutputLayer();
        }

        this.Learn = function (data, learn_rate) {
            const h = 0.0001; // Weight change value, step value
            let original_cost = this.TotalAvgCost(data);

            for (let l = 0; l < this.layers.length; l++) {
                let layer = this.layers[l];

                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];

                    // Calculate bias gradient change
                    // delta = f(x + h) - f(x)
                    // slope = delta / h
                    // change = slope * learn_rate
                    node.bias += h; // Change bias
                    let bias_delta_cost = this.TotalAvgCost(data) - original_cost // test new bias
                    node.bias -= h; // Revert bias
                    let bias_slope = (bias_delta_cost  / h);
                    node.bias_gradient_change = bias_slope * learn_rate;

                    // Calculate weight gradient changes
                    // Same formula as bias change
                    for (let j = 0; j < node.out_nodes.length; j++) {
                        node.out_nodes[j].weight += h; // change weight
                        let new_cost = this.TotalAvgCost(data);
                        let weight_delta_cost = new_cost - original_cost; // test new weight
                        node.out_nodes[j].weight -= h; // revert changes

                        // Calculate weight change
                        let slope = (weight_delta_cost / h);
                        node.weight_gradient_changes.push(slope * learn_rate);
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

                    // Setting new biases
                    node.bias -= node.bias_gradient_change;

                    // Setting new weights
                    for (let j = 0; j < node.out_nodes.length; j++) {
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

        // single_data: { expected_output: x, input_values: [ num1, num2, ...numn ]  }
        this.SingleCost = function (single_data) {
            let output_result = this.Calculate(single_data.input_values);
            let cost = 0;

            for (let i = 0; i < output_result.nodes.length; i++) {
                // out_node_activation_value = (0 to 1)
                let out_node_activation_value = output_result.nodes[i].value;

                // Ex: if you're trying to guess the digit from the picture
                // the real output values would be [0, 1, 2, 3, 4, 5, 6, ...etc]
                // while the eactivation of the node is (0 to 1)
                let out_node_real_value = output_result.nodes[i].real_value;

                // expected_node_activation = (0 to 1)
                // Comparing the real value to the output node real value to calculate expected activation
                let expected_node_activation = out_node_real_value === single_data.expected_output ? 1 : 0;

                cost += this.NodeCost(out_node_activation_value, expected_node_activation);
            }

            return cost;
        }

        this.TotalAvgCost = function (data_arr) {
            let total_cost = 0;

            for (let i = 0; i < data_arr.length; i++) {
                total_cost += this.SingleCost(data_arr[i]);
            }

            return total_cost / data_arr.length;
        }

        this.Show = function (decimal_places = 2) {
            console.log();
            for (let l = 0; l < this.layers.length; l++) {
                let layer = this.layers[l];
                console.log("Logging " + layer.name + " nodes: ");

                // Iterating current layer to show nodes
                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];
                    console.log(
                          "Node: "  + node.name + "; "
                        + "Value: " + obj.Round(node.value, decimal_places) + "; "
                        + "Bias: "  + obj.Round(node.bias, decimal_places) + "; "
                        + "Node-Weight: [" + node.out_nodes.map((x) => { return x.node.name + " (" + obj.Round(x.weight, decimal_places) + ")" }).join(", ") + "];"
                    );
                }
            }

            console.log();
        }

        this.GetOutputLayer = function () {
            return this.layers[this.layers.length - 1];
        }

        // batch: [ { expected_output: x, input_values: [ num1, num2, ...numn ]  } ]
        this.TestBatch = function (batch) {
            //this.Show(3);
            let right = 0;

            for (let i = 0; i < batch.length; i++) {
                let single_data = batch[i];
                let answer = obj.pub.Test(single_data);
                let most_confident_answer = answer[0].real_value;

                if (most_confident_answer === single_data.expected_output) {
                    right++;
                }
            }

            console.log("Correct: " + right + "/" + batch.length);
        }

        this.LearnForGenerations = function(data, gen_count, cycles) {
            console.log("Learning...");
            for (let g = 0; g < gen_count; g++) {
                console.log("Generation " + g);
                let gen_total_cost = 0;
                
                let cost = null;
                for (let c = 0; c < cycles; c++) {
                    console.log("Cycle " + c);
                    cost = this.Learn(data, obj.learn_rate);
                    gen_total_cost += cost;
                }

                let gen_avg_cost = gen_total_cost / cycles;
                console.log("Cost: " + obj.Round(gen_avg_cost, 3));
            }

            console.log();
        }

        // Super Optimization Calculus Giga Mind
        this.NodeCostDerivative = function (out, exp) {
            return 2 * (out - exp);
        }

        this.ActivationFunctionDerivative = function (weighted_input) {
            let activation_value = this.ActivationFunction(weighted_input);
            return activation_value * (1 - activation_value);
        };

        // single_data: { expected_output: x, input_values: [ num1, num2, ...numn ]  }
        this.UpdateAllGradients = function(single_data) {
            this.Calculate(single_data.input_values);

            let new_values_arr = this.CalculateOutputNodeValuesWithDerivatives(single_data.expected_output);
            this.UpdateGradients(this.GetOutputLayer(), new_values_arr);

            for (let i = this.layers.length - 2; i > 0; i--) {
                let hidden_layer = this.layers[i];
                new_values_arr = this.CalculateHiddenNodeValuesWithDerivatives(hidden_layer, this.layers[i + 1], new_values_arr);
                this.UpdateGradients(hidden_layer, new_values_arr);
            }
        }

        // #c1/#w2 = a1 x X
        // #c1/#w1 = a0 x X1
        // #c1/#b2 = 1 x X
        // #c1/#b1 = 1 x X1
        this.UpdateGradients = function (layer, new_values_arr) {
            let prev_layer = this.layers[layer.layer_index - 1];

            for (let j = 0; j < new_values_arr.length; j++) {
                let new_node_value = new_values_arr[j];
                let node = layer.nodes[j];

                for (let k = 0; k < prev_layer.size; k++) {
                    let prev_node = prev_layer.nodes[k];

                    // #c1/#w2 = a1 x X
                    // #c1/#w1 = a0 x X1
                    let weight_change = prev_node.value * new_node_value;
                    prev_node.weight_gradient_changes.push(weight_change);
                }

                // #c1/#b2 = 1 x X
                // #c1/#b1 = 1 x X1
                let bias_change = 1 * new_node_value;
                node.bias_gradient_change = bias_change;
            }
        }

        // #c1/#w2 = #z2/#w2 x #a2/#z2 x #c1/#a2
        // #c1/#w2 = a1 x [ AFD(z2) x NCD(a2, y) ]
        // X = AFD(z2) x NCD(a2, y);
        // returns X[];
        this.CalculateOutputNodeValuesWithDerivatives = function (expected_output) {
            let output_layer = this.GetOutputLayer();
            // X[]
            let new_values = [];

            for (let i = 0; i < output_layer.size; i++) {
                let output_node = output_layer.nodes[i];

                // a2
                let out_node_activation_value = output_node.value;

                // y
                let expected_node_activation = output_node.real_value === expected_output ? 1 : 0;

                // AFD(z2)
                let activation_derivative = this.ActivationFunctionDerivative(output_node.weighted_input);

                // NCD(a2, y)
                let cost_derivative = this.NodeCostDerivative(out_node_activation_value, expected_node_activation);
                
                // X = AFD(z2) x NCD(a2, y)
                let node_value = activation_derivative * cost_derivative;
                
                // add X to X[]
                new_values.push(node_value);
            }

            return new_values;
        }

        // #c1/#w1 = #z1/#w1 x #a1/#z1 x #z2/#a1 x [ #a2/#z2 x #c1/#a2 ]
        // #c1/#w1 = a0 x [ AFD(z1) x sum(w2 x [ AFD(z2) x NCD(a2, y) ]) ]
        // X1 = [ AFD(z1) x sum(w2 x X) ];
        // returns X1[];
        this.CalculateHiddenNodeValuesWithDerivatives = function (layer, old_layer, old_layer_new_values_arr) {
            // X1[]
            let new_node_values = [];

            for (let i = 0; i < layer.size; i++) {
                let node = layer.nodes[i];
                // sum(w2 x [ AFD(z2) x NCD(a2, y) ])
                let old_weight_times_old_node_values_sum = 0;

                for (let j = 0; j < old_layer.size; j++) {
                    // w2
                    let old_weight = node.out_nodes[j].weight;

                    // X = [ AFD(z2) x NCD(a2, y) ]
                    let old_node_value = old_layer_new_values_arr[j];

                    // sum(w2 x X)
                    old_weight_times_old_node_values_sum += old_weight * old_node_value;
                }

                // AFD(z1)
                let node_activation_derivative = this.ActivationFunctionDerivative(node.weighted_input);

                // X1 = [ AFD(z1) x sum(w2) x X ];
                let new_node_value = node_activation_derivative * old_weight_times_old_node_values_sum;
                new_node_values.push(new_node_value);
            }

            // return X1[]
            return new_node_values;
        }

        this.LearnFast = function (batch_arr, learn_rate) {
            for (let i = 0; i < batch_arr.length; i++) {
                this.UpdateAllGradients(batch_arr[i]);
            }

            this.ApplyAllGradients(obj.learn_rate / batch_arr.length);

            this.ClearAllGradients();
        }

        this.ApplyAllGradients = function (learn_rate) {
            //console.log("Applying all gradients: ");
            for (let l = 0; l < this.layers.length; l++) {
                //console.log("Applying gradients for layer: " + l)
                let layer = this.layers[l];

                for (let i = 0; i < layer.size; i++) {
                    //console.log("Applying gradients for Node: " + i)
                    let node = layer.nodes[i];

                    //console.log("bias change: " + (node.bias_gradient_change * learn_rate))
                    // Setting new biases
                    // DEBUG CHANGE BIAS
                    //console.log("Changing bias of " + node.name + " from " + node.bias + " to " + (node.bias - (node.bias_gradient_change * learn_rate)) + " (" + obj.Round((node.bias_gradient_change * learn_rate), 2) + ")");
                    node.bias -= (node.bias_gradient_change * learn_rate);

                    // Setting new weights
                    for (let j = 0; j < node.out_nodes.length; j++) {
                        // DEBUG CHANGE WEIGHT
                        //console.log("Changing weight from (" + node.name + ") to (" + node.out_nodes[j].node.name + "): from: " + node.out_nodes[j].weight + " to: " + (node.out_nodes[j].weight - (node.weight_gradient_changes[j] * learn_rate)) + " (" + obj.Round((node.weight_gradient_changes[j] * learn_rate), 2)  + ")");
                        node.out_nodes[j].weight -= (node.weight_gradient_changes[j] * learn_rate);
                    }
                }
            }
        }

        this.ClearAllGradients = function () {
            for (let l = 0; l < this.layers.length; l++) {
                let layer = this.layers[l];

                for (let i = 0; i < layer.size; i++) {
                    let node = layer.nodes[i];

                    // Resetting gradients
                    node.bias_gradient_change = null;
                    node.weight_gradient_changes = [];
                }
            }
        }

        this.LearnFastForGenerations = function(data, gen_count, batch_size) {
            console.log("Learning...");
            for (let g = 0; g < gen_count; g++) {
                console.log("Generation " + g);


                let batch = [];

                for (let i = 0; i < batch_size; i++) {
                    batch.push(data[obj.GetRandomInt(data.length)]);
                }

                this.LearnFast(batch, obj.learn_rate);

                //if (g % 100 === 0) {
                //    this.TestBatch(batch);
                //}

                //this.LearnFast(data, obj.learn_rate);
            }
        },

        this.Debug = function () {
            // Debug Test Cases
            let debug_network = new obj.Network([ 6, 10, 6 ]);

            let debug_inputs = [];
            debug_inputs.push( { "input_values": [256, 0, 0, 0, 0, 0], "expected_output": 0 } );
            debug_inputs.push( { "input_values": [0, 256, 0, 0, 0, 0], "expected_output": 1 } );
            debug_inputs.push( { "input_values": [0, 0, 256, 0, 0, 0], "expected_output": 2 } );
            debug_inputs.push( { "input_values": [0, 0, 0, 256, 0, 0], "expected_output": 3 } );
            debug_inputs.push( { "input_values": [0, 0, 0, 0, 256, 0], "expected_output": 4 } );
            debug_inputs.push( { "input_values": [0, 0, 0, 0, 0, 256], "expected_output": 5 } );

            debug_network.TestBatch(debug_inputs);
            debug_network.LearnFastForGenerations(debug_inputs, 10000, 2);
            debug_network.TestBatch(debug_inputs);
        },

        // Reads numbers from a custom binary format: http://yann.lecun.com/exdb/mnist/ (IDX File format)
        this.ReadNumbers = function(file_path, num_count, image_size_in_bytes) {
            return new Promise((resolve) => {
                const fs = require('fs');

                fs.open(file_path, 'r', function(err, fd) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    // 28 * 28 = 784
                    let read_byte_count = image_size_in_bytes;
                    let starting_image_bytes_offset = 16;

                    let nums_matrix = [];
                    for (let n = 0; n < num_count; n++) {
                        let buffer = Buffer.alloc(read_byte_count);

                        // fs.read(fd, buffer, offset, length, position, callback)
                        fs.read(fd, buffer, 0, read_byte_count, starting_image_bytes_offset + (n * read_byte_count), function(err, num) {
                            nums_matrix.push(Uint8Array.from(buffer));

                            // resolve on final number read
                            if (n == num_count - 1) {
                                resolve(nums_matrix);
                            }
                        });
                    }
                });
            });
        },

        // Reads answers from a custom binary format: http://yann.lecun.com/exdb/mnist/ (IDX File format)
        this.ReadAnswers = function(file_path, num_count) {
            return new Promise((resolve) => {
                const fs = require('fs');

                fs.open(file_path, 'r', function(err, fd) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    // answer is 1 byte (0-9)
                    let read_byte_count = 1;
                    let starting_image_bytes_offset = 8;

                    let answers_arr = [];
                    for (let n = 0; n < num_count; n++) {
                        let buffer = Buffer.alloc(read_byte_count);

                        // fs.read(fd, buffer, offset, length, position, callback)
                        fs.read(fd, buffer, 0, read_byte_count, starting_image_bytes_offset + (n * read_byte_count), function(err, num) {
                            answers_arr.push(buffer[0]);

                            // resolve on final number read
                            if (n == num_count - 1) {
                                resolve(answers_arr);
                            }
                        });
                    }
                });
            });
        }
    },
    pub: {

        // data: [{
        //     "input_values": num[], EX: [ 0,0,0,0,..{784}...0,0,0 ]
        //     "expected_output": num, EX: 5
        // }],
        // options: {
        //     layers_sizes_arr: num[], EX: [ 784, 16, 16, 10 ]
        //     learn_rate: num, EX: 10
        //     generations: num, EX: 1000
        // }
        Init: async function (stack, options) {
            obj.stack = stack;

            // Generating Network
            obj.network = new obj.Network(options["layers_sizes_arr"]);

            if (options.learn_rate) {
                obj.learn_rate = options["learn_rate"];
            }

            // Reading numbers
            let read_number_count = 10000;
            let numbers_matrix = await obj.network.ReadNumbers("/home/rosen/Downloads/number_images/t10k-images-idx3-ubyte", read_number_count, options["layers_sizes_arr"][0]);
            let answers_arr = await obj.network.ReadAnswers("/home/rosen/Downloads/number_images/t10k-labels-idx1-ubyte", read_number_count);

            for (let i = 0; i < numbers_matrix.length; i++) {
                obj.data.push( { "input_values": numbers_matrix[i], "expected_output": answers_arr[i] } );
            }

            obj.network.LearnFastForGenerations(obj.data, options["generations"], obj.batch_size);
        },

        // TODO: Make single_data a class
        // single_data: { expected_output: x, input_values: [ num1, num2, ...numn ]  }
        // returns [ { value: 0.55, percentage: 20 } ]
        Test: function (single_data) {
            let result = obj.network.Calculate(single_data.input_values, true);
            let nodes_arr = result.nodes;

            let result_sum = 0;
            for (let i = 0; i < nodes_arr.length; i++) {
                result_sum += nodes_arr[i].value;
            }

            // Percentage calculation
            answer_arr = nodes_arr.slice().map((x) => {
                return { "real_value": x.real_value, "value": x.value, "percentage": obj.Round((x.value * 100) / result_sum, 2) }
            })

            return answer_arr.sort((a, b) => { return b.value - a.value });
        },

        GetDigit: function () {
            return obj.data[obj.GetRandomInt(obj.data.length)];
        }
    }
}

module.exports = obj.pub;
