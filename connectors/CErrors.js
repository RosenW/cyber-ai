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
    GetType: function() {
        return con.type;
    },
    GetStack: function() {
        return con.stack;
    },
    pub: {
        IsInit: function() {
            return con.init;
        },
        Init: function (stack, type) {
            // TODO: Add Type check: Console Errors
            con.SetStack(stack);
            con.SetType(type);
            con.SetInit(true);

            if (con.GetType() == con.GetStack().constants.GetConsts()["CONSOLE_ERRORS"]) {
                con.component = require('../components/errs/ConsoleErrors.js');
                con.component.Init(con.GetStack());
            } else {
                con.GetStack().err.ASSERT(false, "Errors type not recognized.", "CE001");
            }
        },
        ASSERT: function (check, msg, code) {
            if (!con.pub.IsInit()) { // Solving Recursion problem, can't call ASSERT
                throw Error(msg + "Errors not initialized. <CE002>");
            }

            if (con.GetType() == con.GetStack().constants.GetConsts()["EXPRESS_TL"]) {
                con.component.ASSERT(check, msg, code);
            }
        }
    }
}

module.exports = con.pub;

