var register = function(Handlebars) {

    var helpers = {
        // put all of your helpers inside this object
        static: function(name) {
          return require('./static.js').map(name);
        },
        debug: function(optionalValue) {
          console.log("Current Context");
          console.log("====================");
          console.log(this);
         
          if (optionalValue) {
            console.log("Value");
            console.log("====================");
            console.log(optionalValue);
          }
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

// client
if (typeof window !== "undefined") {
    register(Handlebars);
}
// server
else {
    module.exports.register = register;
    module.exports.helpers = register(null);
}
