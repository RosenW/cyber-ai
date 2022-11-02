const con = {
    init: false,
    type:  null,
    stack: null,
    component: null,
    SetInit: function(init) {
        con.init = init;
    },
    SetType: function(type) {
        con.type = type;
    },
    SetStack: function(stack) {
        con.stack = stack;
    },
    IsInit: function() {
        return con.init;
    },
    GetType: function() {
        return con.type;
    },
    GetStack: function() {
        return con.stack;
    },
    pub: {
        Init: function (stack, templates_dir, type) {
            con.SetInit(true);
            con.SetStack(stack);
            con.SetType(type);

            if (con.GetType() == con.GetStack().constants.GetConsts()["EXPRESS_TL"]) {
                con.component = require('../components/renderers/ExpressTLRenderer.js');
                con.component.Init(con.GetStack(), templates_dir);
            } else {
                con.GetStack().err.ASSERT(false, "Renderer not recognized.", "CR001");
            }
        },
        RenderPage: function (req, res, page, params) {
            con.GetStack().err.ASSERT(con.IsInit(), "Renderer not initialized.", "CR002");

            if (con.GetType() == con.GetStack().constants.GetConsts()["EXPRESS_TL"]) {
                con.component.RenderPage(req, res, page, params);
            }
        }
    }
}

module.exports = con.pub;
