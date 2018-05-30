routes.welcome = require('../routes/welcome');
http_mocks = require('node-mocks-http');
should = require('should');

// function buildResponse() {
//   return http_mocks.createResponse({eventEmitter: require('events').EventEmitter})
// }
//
// describe('Route Tests for Welcome', function () {
//   it('root', function (done) {
//     var res = buildResponse()
//     var req = http_mocks.createRequest({
//       method: 'GET',
//       url: '/'
//     })
//
//     res.on('end', function () {
//       res.
//     })
//   })
// })

var request = {};
var response = {
    viewName: ""
    , data : {}
    , render: function(view, viewData) {
        this.viewName = view;
        this.data = viewData;
    }
};

describe("Routing", function(){
    describe("Default Route", function(){
        it("should provide the a title and the index view name", function(){
        (request, response);
        response.viewName.should.equal("welcome");
        });

    });
});
