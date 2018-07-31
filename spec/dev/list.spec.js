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

describe("List()", () => {
  beforeEach(() => {
    list = stime.List();
  });

  it("has json output of {tasks: {}, order: []}", () => {
    expect(JSON.parse(JSON.stringify(list))).to.deep.equal(
      {tasks: {}, order: []});
  });
});

describe("List({})", () => {
  beforeEach(() => {
    list = stime.List({});
  });

  it("has json output of {tasks: {}, order: []}", () => {
    expect(JSON.parse(JSON.stringify(list))).to.deep.equal(
      {tasks: {}, order: []});
  });
});

describe("List({tasks: {'1': {}}, order: [1]})", () => {
  beforeEach(() => {
    list = stime.List({tasks: {"1": {}}, order: [1]});
  });

  it("has json output of {tasks: {'1': {}}, order: [1]}", () => {
    expect(JSON.parse(JSON.stringify(list))).to.deep.equal(
      {tasks: {"1": {}}, order: [1]});
  });
});
