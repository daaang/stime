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

describeList({uuid: "fake uuid"}, () => {
  itHasJSON({uuid: "fake uuid"});
});

describe("List()", () => {
  let startingUUID;

  beforeEach(() => {
    list = stime.List();
    startingUUID = list.uuid();
  });

  itHasJSON({tasks: {}, order: []});

  it("has a uuid", () => {
    expect(list.uuid()).to.equal(startingUUID);
  });

  it("sends an empty report to its server", () => {
    expect(list.syncWithServer()).to.deep.equal(
      [startingUUID, startingUUID, []]);
  });

  describe("after running list.addTask(1, 2, 3, 'first')", () => {
    let secondUUID;

    beforeEach(() => {
      list.addTask(1, 2, 3, "first");
      secondUUID = list.uuid();
    });

    it("has a new uuid", () => {
      expect(list.uuid()).not.to.equal(startingUUID);
    });

    itHasJSON({order: [0],
               tasks: {"0": {isComplete: false,
                             estimates: [1, 2, 3],
                             description: "first"}}});

    it("reports the new task to the server", () => {
      expect(list.syncWithServer()).to.deep.equal(
        [startingUUID, secondUUID, [
          ["addTask", 0, {isComplete: false,
                          estimates: [1, 2, 3],
                          description: "first"}]
        ]]);
    });

    describe("after running list.undo()", () => {
      beforeEach(() => {
        list.undo();
      });

      itHasJSON({order: [], tasks: {}});

      it("has a reverted uuid", () => {
        expect(list.uuid()).to.equal(startingUUID);
      });

      it("sends an empty report to its server", () => {
        expect(list.syncWithServer()).to.deep.equal(
          [startingUUID, startingUUID, []]);
      });
    });

    describe("after a successful sync with the server", () => {
      beforeEach(() => {
        list.applyServerResponse([secondUUID, secondUUID, []]);
      });

      it("empties its list of changes", () => {
        expect(list.syncWithServer()).to.deep.equal(
          [secondUUID, secondUUID, []]);
      });
    });

    describe("after running list.addTask('second')", () => {
      let thirdUUID;

      beforeEach(() => {
        list.addTask("second");
        thirdUUID = list.uuid();
      });

      itHasJSON({order: [0, 1],
                 tasks: {"0": {isComplete: false,
                               estimates: [1, 2, 3],
                               description: "first"},
                         "1": {isComplete: false,
                               description: "second"}}});

      it("has a new uuid", () => {
        expect(list.uuid()).not.to.equal(startingUUID);
        expect(list.uuid()).not.to.equal(secondUUID);
      });

      it("reports both new tasks to the server", () => {
        expect(list.syncWithServer()).to.deep.equal(
          [startingUUID, thirdUUID, [
            ["addTask", 0, {isComplete: false,
                            estimates: [1, 2, 3],
                            description: "first"}],
            ["addTask", 1, {isComplete: false,
                            description: "second"}]
          ]]);
      });
    });
  });
});
