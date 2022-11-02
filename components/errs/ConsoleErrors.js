const obj = {
    stack: null,
    pub: {
        Init: function (stack) {
            obj.stack = stack;
        },
        ASSERT: function (check, msg, code) {
            if (!check) {
                throw Error(msg + " <" + code + ">.");
            }
        }
    }
}

module.exports = obj.pub;
