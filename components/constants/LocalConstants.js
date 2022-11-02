const obj = {
    stack: null,
    local_constants: {},
    pub: {
        Init: function (stack) {
            obj.stack = stack;
            obj.local_constants = {
                // APP Constants
                "PORT": 3001,
                "TEMPLATES_DIR": "./templates",
                // Renderer Types
                "EXPRESS_TL": "Express TL Renderer",
                // Error Types
                "CONSOLE_ERRORS": "CONSOLE",
                // AI Types
                "BRAIN_V1": "BRAINV1",
                "BRAIN_V2": "BRAINV2"
            }
        },
        GetConsts: function () {
            return obj.local_constants;
        }
    }
}

module.exports = obj.pub;
