const obj = {
    stack: null,
    templates_dir: null,
    pub: {
        Init: function (stack, templates_dir) {
            obj.stack = stack;
            obj.templates_dir = templates_dir;

            const tl = require('express-tl');

            obj.stack.app.engine('tl', tl);
            obj.stack.app.set('views', obj.templates_dir); // specify the views directory
            obj.stack.app.set('view engine', 'tl'); // register the template engine
        },
        RenderPage: function (req, res, page, params) {
            res.render(page, params);
        }
    }
}

module.exports = obj.pub;
