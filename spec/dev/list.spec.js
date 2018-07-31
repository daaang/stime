// stime: Estimates and Tomatoes
// Copyright 2018 Matt LaChance
//
// This file is part of stime.
//
// stime is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the
// Free Software Foundation, either version 3 of the License, or (at
// your option) any later version.
//
// stime is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
// for more details.
//
// You should have received a copy of the GNU General Public License
// along with stime. If not, see <http://www.gnu.org/licenses/>.

/* eslint-env mocha */
const expect = require("chai").expect;
const stime = require("../..");

let list;

const itHasJSON = function(json) {
  for (const key in json)
    if (json.hasOwnProperty(key))
      it("has json output including {" + key + ": " + JSON.stringify(json[key]) + "}", function() {
        expect(JSON.parse(JSON.stringify(list))[key]).to.deep.equal(json[key]);
      });
};

const describeList = function(json, tests) {
  describe("List(" + JSON.stringify(json) + ")", function() {
    beforeEach(function() {
      list = stime.List(json);
    });

    tests();
  });
};

describeList({}, () => {
  itHasJSON({tasks: {}, order: []});
});

describeList({tasks: {"1": {}}, order: [1]}, () => {
  itHasJSON({tasks: {"1": {isComplete: false}}, order: [1]});
});

describe("List()", () => {
  let startingUUID;

  beforeEach(() => {
    list = stime.List();
    startingUUID = list.uuid();
  });

  it("has a uuid", () => {
    expect(list.uuid()).to.equal(startingUUID);
  });

  itHasJSON({tasks: {}, order: []});

  describe("after running list.addTask(1, 2, 3, 'first')", () => {
    beforeEach(() => {
      list.addTask(1, 2, 3, "first");
    });

    it("has a new uuid", () => {
      expect(list.uuid()).not.to.equal(startingUUID);
    });

    itHasJSON({order: [0],
               tasks: {"0": {isComplete: false,
                             estimates: [1, 2, 3],
                             description: "first"}}});
  });
});
