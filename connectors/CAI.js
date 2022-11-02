const con = {
    init: false,
    type:  null,
    stack: null,
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
        Init: function (stack, type, opts) {
            con.SetInit(true);
            con.SetStack(stack);
            con.SetType(type);

            if (con.GetType() === con.GetStack().constants.GetConsts()["BRAIN_V1"]) {
                con.component = require('../components/ais/Brain_v1.js');
                con.component.Init(con.GetStack());
            } else if (con.GetType() === con.GetStack().constants.GetConsts()["BRAIN_V2"]) {
                con.component = require('../components/ais/Brain_v2.js');
                con.component.Init(con.GetStack(), opts).catch((e) => { console.log(e) });
            } else {
                con.GetStack().err.ASSERT(false, "AI type not recognized.", "CAI001");
            }
        },
        Test: function (single_data) {
            return con.component.Test(single_data);
        },
        GetDigit: function() {
            return con.component.GetDigit();
        }
    }
}

module.exports = con.pub;

