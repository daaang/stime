stime
=====

[![Travis CI Status][ci-state]][travis]
[![Test Coverage][cover-image]][coverage]

Based on a quick google translate, "stime" appears to be Italian for
"estimates." It's named as a nod to the [pomodoro technique][1].

**It's still in early development.** It doesn't do much.

The Original Goal
=================

Eventually, I'd like this to be able to do four things:

1.  [x] Store three-number task estimates in terms of tomatoes.
2.  [x] Store tomatoes, knowing which tasks they were for.
3.  [ ] Report stats on recent estimate accuracy.
4.  [ ] Translate tomato estimates into realtime estimates based on
    recent frequency and on how much of my dev time I'm willing to spend
    on this particular task.

The fourth one is particularly important so that I can make my estimates
without needing to think about how much of my time I actually spend in
development but also so that I can *give* my estimates in units a
manager will understand (i.e. hours/days/weeks).

Yak Shaving
===========

CRDTs
-----

Naturally, plans change, and now I'm building a conflict-free replicated
data type representing the full to-do list while allowing for an undo
button in each client app. I don't think this will actually be a real
CRDT, in the true collaborative sense, but it still needs to be able to
handle concurrent changes as seamlessly as possible.

When race conditions are set, its behavior doesn't need to be sensible,
but it does need to be defined.

-   [ ] Each local model can generate a list of changes given a previous
    point and its current point.
-   [ ] Each local model has its own undo/redo stack.
-   [ ] Each local model can accept or reject a list of changes.
-   [ ] Each local model can merge a list of conflicting changes into
    itself.
-   [ ] They should be able to clean up after themselves without
    deleting anything they'll need for future syncing.
-   [ ] They should be able to merge deeply when the list of changes has
    been deleted already.

[1]: https://en.wikipedia.org/wiki/Pomodoro_Technique

[ci-state]:     https://travis-ci.org/daaang/stime.svg?branch=master
[travis]:       https://travis-ci.org/daaang/stime
[coverage]:     https://coveralls.io/github/daaang/stime
[cover-image]:  https://coveralls.io/repos/github/daaang/stime/badge.svg?branch=master
