var ElasticSearchClient = require('../lib/elasticsearchclient/elasticSearchClient.js')
,   mocha = require("mocha")
,   should = require("chai").should();

var serverOptions = {
    host: 'localhost',
    port: 9200
    //secure: true,
    /*auth: {
     username:'username',
     password:'password'
     }*/
};

var indexName = 'your_index_name';
var objName = 'your_object_name';

var elasticSearchClient = new ElasticSearchClient(serverOptions);

describe("ElasticSearchClient Core api", function(){
    describe("#index", function(){

        it("should index a json object", function(done){
            elasticSearchClient.index(indexName, objName, {'name':'sushi'})
                .on('data', function(data) {
                    data = JSON.parse(data);
                    data.ok.should.be.ok;
                    done();
                })
                .exec();
        })

        it("should index an object with given id under the same id", function(done){
            elasticSearchClient.index(indexName, objName, {'name':'name', id:"1111"})
                .on('data', function(data) {
                    data = JSON.parse(data);
                    data._id.should.equal("1111");
                    done();
                })
                .exec();
        });
    });


    describe("#get", function(){
        it("should fetch the row by id", function(done){
            elasticSearchClient.get(indexName, objName, 1111)
            .on('data', function(data) {
                data = JSON.parse(data);
                data._source.should.be.ok;
                data._id.should.equal("1111");
                done();
            })
            .exec()
        });
    });

    describe("#search", function(){
        it("should search based on given query", function(done){
            var qryObj = {
                "query" : {
                    "term" : { "name" : "sushi" }
                }
            };
            elasticSearchClient.search(indexName, objName, qryObj)
                .on('data', function(data) {
                    data = JSON.parse(data);
                    data.should.not.be.undefined.null.empty;
                    done();
                })
                .exec();
        });
    });

    describe("#percolate", function(){
        it("should percolate", function(done){
            var doc = {
                "doc" : {
                    "field1" : "value1"
                }
            }

            elasticSearchClient.percolate(indexName, objName, doc)
                .on('data',
                function(data) {
                    data = JSON.parse(data);
                    data.ok.should.be.ok;
                    done();
                })
                .exec();
        });
    });

    describe("#percolator", function(){
        it("should be a percolator", function(done){
            var qryObj = {
                query: {
                    bool: {
                        should: [
                            {flt : {
                                fields : ["name"],
                                like_text : 'a name'
                            }
                            }
                        ]
                    }
                }
            };
            elasticSearchClient.percolator(indexName, objName, qryObj)
                .on('data',
                function(data) {
                    data = JSON.parse(data);
                    data.ok.should.be.ok;
                    done();
                })
                .exec();
        });
    });

    describe("#bulk", function(){
        it("should fetch bulk results, not implemented yet");
    });
    
    describe("#count", function(){
        it("should fetch count of given query", function(done){
            var qryStr = 'name:name'
            elasticSearchClient.count(indexName, objName, qryStr)
                .on('data', function(data) {
                    
                    data = JSON.parse(data);
                    data.count.should.exist;
                    data.count.should.not.be.null.undefined;
                    done();
                })
                .exec();
        });
    }); 

    describe('#moreLikeThis', function(){
        it('should show results more like this', function(done){
            elasticSearchClient.moreLikeThis(indexName, objName, '1111',{})
                .on('data', function(data) {
                    data = JSON.parse(data);
                    data.should.not.be.null.undefined.empty;
                    data.should.not.have.error;
                    done();
                })
                .exec();
        });
    });

    describe("#deleteDocument", function(){
        it("should delete the row by id", function(done){
            elasticSearchClient.deleteDocument(indexName, objName, 1111)
            .on('data', function(data) {
                data = JSON.parse(data);
                data.ok.should.be.ok;
                data.found.should.exist;
                data._id.should.equal("1111");
                done();
            })
            .exec()
        });
    }); 

    describe('#deleteByQuery', function(){
        it('should delete objects matching given query', function(done){
            var qryObj = {
                term : {
                    name: 'name'
                }
            }
            elasticSearchClient.deleteByQuery(indexName, objName, qryObj)
                .on('data', function(data) {
                    data = JSON.parse(data);
                    data.ok.should.be.ok;
                    done();
                })
                .exec();
         });
    });
});