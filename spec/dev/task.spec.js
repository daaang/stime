// stime: Estimates and Tomatoes
// Copyright 2017-2019 Matt LaChance
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

const itHasEstimates = function(best, nominal, worst) {
  it("has a best-case estimate of " + best, function() {
    expect(task.best).to.equal(best);
  });

  it("has a nominal estimate of " + nominal, function() {
    expect(task.nominal).to.equal(nominal);
  });

  it("has a worst-case estimate of " + worst, function() {
    expect(task.worst).to.equal(worst);
  });

  const mean = (best + 4 * nominal + worst) / 6;
  it("has a mean of " + mean, function() {
    expect(task.mean).to.be.closeTo(mean, 0.01);
  });

  const deviation = (worst - best) / 6;
  it("has a deviation of " + deviation, function() {
    expect(task.deviation).to.be.closeTo(deviation, 0.01);
  });
};

const itHasJSON = function(json) {
  it("has a json representation of " + JSON.stringify(json), function() {
    expect(JSON.parse(JSON.stringify(task))).to.deep.equal(json);
  });
};

const testJSON = function(json) {
  describe("Task(" + JSON.stringify(json) + ")", function() {
    beforeEach(function() {
      task = stime.Task(json);
    });

    itHasJSON(json);
  });
};

describe("Task", () => {
  it("errors when given two arguments", () => {
    expect(() => { stime.Task(1, 2); }).to.throw();
  });

  it("errors when given out-of-order estimates", () => {
    expect(() => { stime.Task(1, 3, 2); }).to.throw();
    expect(() => { stime.Task(2, 1, 3); }).to.throw();
    expect(() => { stime.Task(3, 2, 1); }).to.throw();
  });

  it("errors when given a description as an estimate", () => {
    expect(() => { stime.Task("hey", 2, 3); }).to.throw();
  });
});

describe("Task('holler dollar')", () => {
  beforeEach(() => {
    task = stime.Task("holler dollar");
  });

  it("has a description of 'holler dollar'", () => {
    expect(task.description).to.equal("holler dollar");
  });

  it("is its own firstSubtask", () => {
    expect(task.firstSubtask()).to.equal("holler dollar");
  });

  itHasEstimates(0, 0, 0);
  itHasJSON({ isComplete: false, description: "holler dollar" });

  describe("when given a subtask named 'a'", () => {
    beforeEach(() => {
      task.subtasks.push(stime.Task("a"));
    });

    it("has a firstSubtask of 'a'", () => {
      expect(task.firstSubtask()).to.equal("a");
    });

    describe("when given a subsubtask of 'b' under 'a'", () => {
      beforeEach(() => {
        task.subtasks[0].subtasks.push(stime.Task("b"));
      });

      it("has a firstSubtask of 'b'", () => {
        expect(task.firstSubtask()).to.equal("b");
      });
    });
  });
});

describe("Task(2, 4, 8)", () => {
  beforeEach(() => {
    task = stime.Task(2, 4, 8);
  });

  it("has an empty string for a description", () => {
    expect(task.description).to.equal("");
  });

  itHasEstimates(2, 4, 8);
  itHasJSON({ isComplete: false, estimates: [2, 4, 8] });
});

describe("Task(5, 8, 13, 'fibonacci')", () => {
  beforeEach(() => {
    task = stime.Task(5, 8, 13, "fibonacci");
  });

  it("has a description of 'fibonacci'", () => {
    expect(task.description).to.equal("fibonacci");
  });

  itHasEstimates(5, 8, 13);
  itHasJSON({ isComplete: false,
              description: "fibonacci",
              estimates: [5, 8, 13] });
});

describe("Task()", () => {
  beforeEach(() => {
    task = stime.Task();
  });

  it("is incomplete", () => {
    expect(task.isComplete()).to.equal(false);
  });

  it("has an empty string for a description", () => {
    expect(task.description).to.equal("");
  });

  itHasEstimates(0, 0, 0);
  itHasJSON({ isComplete: false });

  it("has an empty list of subtasks", () => {
    expect(task.subtasks).to.deep.equal([]);
  });

  it("has an empty list of intervals", () => {
    expect(task.intervals).to.deep.equal([]);
  });

  it("has an empty list of tags", () => {
    expect(task.tags).to.deep.equal([]);
  });

  it("has an empty mapping of categories", () => {
    expect(task.categories).to.deep.equal(new Map());
  });

  describe("after marking as complete", () => {
    beforeEach(() => {
      task.complete();
    });

    it("is complete", () => {
      expect(task.isComplete()).to.equal(true);
    });

    it("can be marked incomplete", () => {
      task.incomplete();
      expect(task.isComplete()).to.equal(false);
    });

    itHasJSON({ isComplete: true });
  });

  describe("after adding a 3,5,8 child", () => {
    beforeEach(() => {
      task.subtasks.push(stime.Task(3, 5, 8));
    });

    itHasEstimates(3, 5, 8);
    itHasJSON({
      isComplete: false,
      subtasks: [{ isComplete: false, estimates: [3, 5, 8] }]
    });

    describe("and then setting the best-case to 2", () => {
      beforeEach(() => {
        task.best = 2;
      });

      itHasEstimates(2, 5, 8);

      itHasJSON({
        isComplete: false,
        estimates: [2, null, null],
        subtasks: [{ isComplete: false, estimates: [3, 5, 8] }]
      });
    });

    describe("and then setting the nominal to 4", () => {
      beforeEach(() => {
        task.nominal = 4;
      });

      itHasEstimates(3, 4, 8);

      itHasJSON({
        isComplete: false,
        estimates: [null, 4, null],
        subtasks: [{ isComplete: false, estimates: [3, 5, 8] }]
      });
    });

    describe("and then setting the worst-case to 7", () => {
      beforeEach(() => {
        task.worst = 7;
      });

      itHasEstimates(3, 5, 7);

      itHasJSON({
        isComplete: false,
        estimates: [null, null, 7],
        subtasks: [{ isComplete: false, estimates: [3, 5, 8] }]
      });
    });

    describe("and then setting the best-case to 10", () => {
      beforeEach(() => {
        task.best = 10;
      });

      itHasEstimates(10, 10, 10);
    });

    describe("and then setting the nominal-case to 10", () => {
      beforeEach(() => {
        task.nominal = 10;
      });

      itHasEstimates(3, 10, 10);
    });

    describe("and then setting the nominal-case to 1", () => {
      beforeEach(() => {
        task.nominal = 1;
      });

      itHasEstimates(1, 1, 8);
    });

    describe("and then setting the worst-case to 1", () => {
      beforeEach(() => {
        task.worst = 1;
      });

      itHasEstimates(1, 1, 1);
    });

    describe("and then adding a 1,2,3 child", () => {
      beforeEach(() => {
        task.subtasks.push(stime.Task(1, 2, 3));
      });

      it("has a nominal estimate of 7", () => {
        expect(task.nominal).to.equal(7);
      });
    });
  });

  describe("after setting a best-case estimate of 1", () => {
    beforeEach(() => {
      task.best = 1;
    });

    itHasEstimates(1, 1, 1);

    describe("and setting a nominal estimate of 2", () => {
      beforeEach(() => {
        task.nominal = 2;
      });

      itHasEstimates(1, 2, 2);

      describe("and setting a worst-case estimate of 3", () => {
        beforeEach(() => {
          task.worst = 3;
        });

        itHasEstimates(1, 2, 3);

        describe("then setting a new best-case of 5", () => {
          beforeEach(() => {
            task.best = 5;
          });

          itHasEstimates(5, 5, 5);
        });

        describe("then setting a new worst-case of 0", () => {
          beforeEach(() => {
            task.worst = 0;
          });

          itHasEstimates(0, 0, 0);
        });
      });
    });
  });

  describe("after setting a best-case estimate of 5", () => {
    beforeEach(() => {
      task.best = 5;
    });

    itHasEstimates(5, 5, 5);

    describe("and then setting a nominal estimate of 3", () => {
      beforeEach(() => {
        task.nominal = 3;
      });

      itHasEstimates(3, 3, 3);
    });
  });

  describe("after setting a worst-case estimate of 1", () => {
    beforeEach(() => {
      task.worst = 1;
    });

    itHasEstimates(1, 1, 1);

    describe("and then setting a nominal estimate of 2", () => {
      beforeEach(() => {
        task.nominal = 2;
      });

      itHasEstimates(2, 2, 2);
    });
  });

  describe("after setting a worst-case estimate of 10", () => {
    beforeEach(() => {
      task.worst = 10;
    });

    itHasEstimates(10, 10, 10);

    describe("and then setting a nominal estimate of 5", () => {
      beforeEach(() => {
        task.nominal = 5;
      });

      itHasEstimates(5, 5, 10);

      describe("and then setting a best-case estimate of 3", () => {
        beforeEach(() => {
          task.best = 3;
        });

        itHasEstimates(3, 5, 10);
      });
    });
  });

  describe("after setting a best-case estimate of 5", () => {
    beforeEach(() => {
      task.best = 5;
    });

    itHasEstimates(5, 5, 5);

    describe("and then setting a worst-case estimate of 15", () => {
      beforeEach(() => {
        task.worst = 15;
      });

      itHasEstimates(5, 10, 15);
    });

    describe("and then setting a worst-case estimate of 16", () => {
      beforeEach(() => {
        task.worst = 16;
      });

      itHasEstimates(5, 11, 16);
    });
  });

  describe("after adding six [1, 2, 10] children", () => {
    beforeEach(() => {
      task.subtasks.push(stime.Task(1, 2, 10));
      task.subtasks.push(stime.Task(1, 2, 10));
      task.subtasks.push(stime.Task(1, 2, 10));
      task.subtasks.push(stime.Task(1, 2, 10));
      task.subtasks.push(stime.Task(1, 2, 10));
      task.subtasks.push(stime.Task(1, 2, 10));
    });

    it("has a best-case estimate of 8", () => {
      expect(task.best).to.equal(8);
    });

    it("has a nominal estimate of 12", () => {
      expect(task.nominal).to.equal(12);
    });

    it("has a worst-case estimate of 30", () => {
      expect(task.worst).to.equal(30);
    });
  });

  describe("after adding six nested [1, 2, 10] children", () => {
    beforeEach(() => {
      // root task
      // |-- child1
      // |   |-- child3
      // |   |   |-- [1, 2, 10]
      // |   |   `-- [1, 2, 10]
      // |   |-- [1, 2, 10]
      // |   `-- [1, 2, 10]
      // `-- child2
      //     |-- [1, 2, 10]
      //     `-- [1, 2, 10]
      const child1 = stime.Task();
      const child2 = stime.Task();
      const child3 = stime.Task();

      task.subtasks.push(child1);
      task.subtasks.push(child2);

      child1.subtasks.push(child3);

      child1.subtasks.push(stime.Task(1, 2, 10));
      child1.subtasks.push(stime.Task(1, 2, 10));
      child2.subtasks.push(stime.Task(1, 2, 10));
      child2.subtasks.push(stime.Task(1, 2, 10));
      child3.subtasks.push(stime.Task(1, 2, 10));
      child3.subtasks.push(stime.Task(1, 2, 10));
    });

    it("has a best-case estimate of 8", () => {
      expect(task.best).to.equal(8);
    });

    it("has a nominal estimate of 12", () => {
      expect(task.nominal).to.equal(12);
    });

    it("has a worst-case estimate of 30", () => {
      expect(task.worst).to.equal(30);
    });
  });

  describe("when given Interval('hey')", () => {
    beforeEach(() => {
      task.intervals.push(stime.Interval("hey"));
    });

    it("has a json representation with an interval json object", () => {
      const interval = JSON.parse(JSON.stringify(task)).intervals[0];

      expect(interval.description).to.equal("hey");
      expect(interval.restTimeLength).to.be.above(0);
      expect(interval.workTimeLength).to.be.above(0);
      expect(interval.startTime).to.be.above(0);
    });
  });
});

describe("Task({})", () => {
  beforeEach(() => {
    task = stime.Task({});
  });

  itHasJSON({ isComplete: false });
});

describe("Task(Task({}))", () => {
  beforeEach(() => {
    task = stime.Task(stime.Task({}));
  });

  itHasJSON({ isComplete: false });
});

testJSON({ isComplete: true });
testJSON({ isComplete: false, description: "hello" });
testJSON({ isComplete: false, estimates: [3, 9, 27] });
testJSON({ isComplete: false, tags: ["a", "b"] });
testJSON({ isComplete: false, categories: { a: "one", b: "two" } });

testJSON({
  isComplete: false,
  description: "root task",
  subtasks: [
    { isComplete: false, description: "first subtask" },
    { isComplete: false, description: "second subtask" }
  ]
});

describe("Task({intervals: [{description: 'matt'}]})", () => {
  beforeEach(() => {
    task = stime.Task({ intervals: [{ description: "matt" }] });
  });

  it("stores a full interval object", () => {
    const interval = task.intervals[0];

    expect(interval.description).to.equal("matt");
    expect(interval.restTimeLength).to.be.above(0);
    expect(interval.workTimeLength).to.be.above(0);
    expect(interval.startTime).to.be.above(0);
  });
});
