"use strict";
var parser = require("../lib/index");
require("./mocha.conf.js");

describe("parseOdataUri", function () {
    it("should parse simple eq expression", function () {
        var ast = parser.parse("$filter=Name eq Marci");
        ast.$filter.should.deep.equal({ Name: { $eq: "Marci" } });
    });
    it("should parse a conjuction of two expressions", function () {
        var ast = parser.parse("$filter=Name eq Marci and Age eq 20");
        ast.$filter.$and.should.deep.equal([{ Name: { $eq: "Marci" } }, { Age: { $eq: 20 } }]);
    });
    it("should parse a disjunction of two expressions", function () {
        var ast = parser.parse("$filter=Name eq Marci or Age eq 20");
        ast.$filter.$or.should.deep.equal([{ Name: { $eq: "Marci" } }, { Age: { $eq: 20 } }]);
    });
    it("should parse a nested logical expressions", function () {
        var ast = parser.parse("$filter=Name eq Marci or Age eq 20 and Location eq Budapest");
        ast.$filter.$or.should.deep.equal([{ Name: { $eq: "Marci" } }, { $and: [{ Age: { $eq: 20 } }, { Location: { $eq: "Budapest" } }] }]);
    });
    it("should parse a nested logical child expressions", function () {
        var ast = parser.parse("$filter=Person/Name eq Marci");
        ast.$filter.should.deep.equal({ "Person.Name": { $eq: "Marci" } });
    });
    it("should parse ascending orderby expressions", function () {
        var ast = parser.parse("$orderby=Name,Age");
        ast.should.deep.equal({ $orderby: { Age: 1, Name: 1 } });
    });
    it("should parse descending orderby expressions", function () {
        var ast = parser.parse("$orderby=Name desc");
        ast.should.deep.equal({ $orderby: { Name: -1 } });
    });
    it("should parse mixed orderby expressions", function () {
        var ast = parser.parse("$orderby=Name desc, Age asc");
        ast.should.deep.equal({ $orderby: { Age: 1, Name: -1 } });
    });
    it("should parse select expressions", function () {
        var ast = parser.parse("$select=name,age");
        ast.should.deep.equal({ $select: { age: 1, name: 1 } });
    });
    it("should parse select exclusive expressions", function () {
        var ast = parser.parse("$select=!name,age");
        ast.should.deep.equal({ $select: { age: 1, name: 0 } });
    });
    it("should raise error for select=* expression", function () {
        var ast = parser.parse("$select=*");
        ast.should.deep.equal({ error: "invalid $select parameter" });
    });
    it("should parse expand expression", function () {
        var ast = parser.parse("$expand=a,b,c,d");
        ast.should.deep.equal({ "$expand": ["a", "b", "c", "d"] });
    });
    it("should parse expand expression even if it is a parent.child expression", function () {
        var ast = parser.parse("$expand=a/b,b/c,c/d");
        ast.should.deep.equal({ $expand: ["a.b", "b.c", "c.d"] });
    });
    it("should filter in strings based on startswith relation", function () {
        var ast = parser.parse("$filter=startswith(CompanyName, 'Alfr')");
        ast.should.deep.equal({ $filter: { CompanyName: /Alfr.*/ } });
    });
    it("should filter in strings based on endswith relation", function () {
        var ast = parser.parse("$filter=endswith(CompanyName, 'Alfr')");
        ast.should.deep.equal({ $filter: { CompanyName: /.*Alfr/ } });
    });
    it("should be able to mix startswith with basic operators", function () {
        var ast = parser.parse("$filter=endswith(CompanyName, 'Alfr') or startswith(Name,'Marci')");
        ast.should.deep.equal({ $filter: { $or: [{ CompanyName: /.*Alfr/ }, { Name: /Marci.*/ }] } });
    });
    it("should filter in strings based on substringof relation", function () {
        var ast = parser.parse("$filter=substringof('Alfr',CompanyName)");
        ast.should.deep.equal({ $filter: { CompanyName: /.*Alfr.*/ } });
    });
});
//# sourceMappingURL=parseOdataUri.spec.js.map