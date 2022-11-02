const con = {
    init: false,
    type:  null,
    default_constant_type: "local",
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
        Init: function (stack, type = con.default_constant_type) {
            con.SetInit(true);
            con.SetStack(stack);
            con.SetType(type);

            if (con.GetType() === con.default_constant_type) {
                con.component = require('../components/constants/LocalConstants.js');
                con.component.Init(con.GetStack());
            } else {
                if (con.GetStack().err.IsInit()) {
                    con.GetStack().err.ASSERT(false, "Constants type not recognized.", "CC002");
                } else { // this else clause is solving the cycle dependency problem TODO: Find a better solution, remove repeating code.
                    throw Error(msg + "Constants type not recognized. <CC002>.");
                }
            }
        },
        GetConsts: function () {
            // TODO: how to do this without causing recursion and by using the err module.
            //if (con.GetStack().err.IsInit()) {
            //    con.GetStack().err.ASSERT(con.IsInit(), "Constants not initialized.", "CC001");
            //} else { // this else clause is solving the cycle dependency problem
            //    if (!con.IsInit()) {
            //        throw Error(msg + "Constants not initialized. <CC001>.");
            //    }
            //}

            let app_consts;

            if (con.GetType() === con.default_constant_type) {
                app_consts = con.component.GetConsts();
            } else {
                con.GetStack().err.ASSERT(false, "Constants type not recognized.", "CC002");
            }

            return app_consts;
        }
    }
}

module.exports = con.pub;

