const express = require('express');
const app = express();

const CErrors = require('./connectors/CErrors.js'); 
const CConstants = require('./connectors/CConstants.js'); 
const CRenderer = require('./connectors/CRenderer.js'); 
const CAI = require('./connectors/CAI.js'); 


// TODO: seperate different implementations
// TODO: app should be a module with a connector
const stack = {
    "app": app,
    "constants": CConstants,
    "err": CErrors,
    "renderer": CRenderer,
    "log": null,
    "controller": null,
    "db": null,
    "ai": CAI
}

CConstants.Init(stack);
CErrors.Init(stack, CConstants.GetConsts()["CONSOLE_ERRORS"]);
CRenderer.Init(stack, CConstants.GetConsts()["TEMPLATES_DIR"], CConstants.GetConsts()["EXPRESS_TL"]);

let ai_opts = {
    "layers_sizes_arr": [ 784, 16, 16, 10 ],
    "learn_rate": 10,
    "generations": 20000
}

CAI.Init(stack, CConstants.GetConsts()["BRAIN_V2"], ai_opts);


// TODO: Add/Use Controller.
// TODO: Don't show err to client.
app.get('/', (req, res) => {
    stack.renderer.RenderPage(req, res, 'main-page', {});
})

app.post('/get_number', (req, res) => {
    let digit_data = stack.ai.GetDigit();
    let answers = stack.ai.Test(digit_data);

    res.json({ "digit_data": digit_data, "answers": answers })
})

const port = CConstants.GetConsts()["PORT"];
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


// TODO: Figure this out
//try {
//} catch (e) {
//    console.log(e.message);
//    console.log(e.fileName);
//    console.log(e.lineNumber);
//    console.log(e.stack);
//};
