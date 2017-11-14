// stime: Estimates and Tomatoes
// Copyright 2017 Matt LaChance
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
const Interval = require("../..").Interval;

let interval, json;

const describeItsJSON = function(callback) {
  describe("its JSON representation", () => {
    beforeEach(() => {
      json = JSON.parse(JSON.stringify(interval));
    });

    callback();
  });
};

describe("a default Interval() instance", () => {
  beforeEach(() => {
    interval = Interval();
  });

  it("stores an empty description", () => {
    expect(interval.description).to.equal("");
  });

  it("assumes 25 minutes of working time", () => {
    expect(interval.workTimeLength).to.equal(25 * 60 * 1000);
  });

  it("assumes 5 minutes of resting time", () => {
    expect(interval.restTimeLength).to.equal(5 * 60 * 1000);
  });

  it("stores a current timestamp", () => {
    expect(interval.startTime).to.be.closeTo(Date.now(), 50);
  });

  describeItsJSON(() => {
    it("has an empty string description", () => {
      expect(json.description).to.equal("");
    });
  });
});

describe("Interval('reticulating splines')", () => {
  beforeEach(() => {
    interval = Interval("reticulating splines");
  });

  it("stores a description of 'reticulating splines'", () => {
    expect(interval.description).to.equal("reticulating splines");
  });

  it("stores a current timestamp", () => {
    expect(interval.startTime).to.be.closeTo(Date.now(), 50);
  });
});

describe("Interval({description: 'hello'})", () => {
  beforeEach(() => {
    interval = Interval({description: "hello"});
  });

  it("stores a description of 'hello'", () => {
    expect(interval.description).to.equal("hello");
  });
});

describe("Interval(...) with all four named args", () => {
  beforeEach(() => {
    interval = Interval({
      description: "frogblasting vent-core",
      workTimeLength: 1000,
      restTimeLength: 500,
      startTime: 12345
    });
  });

  it("remembers the description", () => {
    expect(interval.description).to.equal("frogblasting vent-core");
  });

  it("remembers the work time length", () => {
    expect(interval.workTimeLength).to.equal(1000);
  });

  it("remembers the rest time length", () => {
    expect(interval.restTimeLength).to.equal(500);
  });

  it("remembers the start time", () => {
    expect(interval.startTime).to.equal(12345);
  });
});

describe("Interval({extraRest: 10*60*1000})", () => {
  beforeEach(() => {
    interval = Interval({extraRest: 10 * 60 * 1000});
  });

  it("adds extraRest to the total rest time", () => {
    expect(interval.restTimeLength).to.equal(15 * 60 * 1000);
  });
});
