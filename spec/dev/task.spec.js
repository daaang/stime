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
const stime = require("../..");

let task;

describe("Task()", () => {
  beforeEach(() => {
    task = stime.Task();
  });

  it("has an empty string for a description", () => {
    expect(task.description).to.equal("");
  });

  it("has a best-case estimate of 0", () => {
    expect(task.best).to.equal(0);
  });

  it("has a nominal estimate of 0", () => {
    expect(task.nominal).to.equal(0);
  });

  it("has a worst-case estimate of 0", () => {
    expect(task.worst).to.equal(0);
  });

  it("has a mean of 0", () => {
    expect(task.mean).to.equal(0);
  });

  it("has a deviation of 0", () => {
    expect(task.deviation).to.equal(0);
  });

  it("has an empty list of subtasks", () => {
    expect(task.subtasks).to.deep.equal([]);
  });

  it("has an empty list of intervals", () => {
    expect(task.intervals).to.deep.equal([]);
  });

  describe("after setting a best-case estimate of 1", () => {
    beforeEach(() => {
      task.best = 1;
    });

    it("has a best-case estimate of 1", () => {
      expect(task.best).to.equal(1);
    });
  });
});
