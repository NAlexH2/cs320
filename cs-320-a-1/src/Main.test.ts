import "jest-extended";

import {
  List, ConsCell,
  cons, snoc, doubleEachIterative, doubleEachRecursive, reverse, removeZeroes,
  countLeaves, removeNots
} from "./Main";

const testList1: List = null;
const testList2: List = { first: 0, rest: testList1 };
const testList3: List = { first: -1, rest: { first: 1, rest: testList2 } };
const testList4: List = { first: 1000, rest: { first: -1000, rest: testList2 } };

const testLists: List[] = [testList1, testList2, testList3, testList4];

function doubledListCheck(original: List, doubled: List): void {
  while (original != null && doubled != null) {
    expect(doubled.first).toEqual(original.first * 2);
    original = original.rest;
    doubled = doubled.rest;
  }

  if (original != null)
    fail("doubled list is too short");

  if (doubled != null)
    fail("doubled list is too long");
}

test("doubleEachIterative test", () => {
  for (const list of testLists)
    doubledListCheck(list, doubleEachIterative(list));
});

test("doubleEachRecursive test", () => {
  for (const list of testLists)
    doubledListCheck(list, doubleEachRecursive(list));
});


function listToArray(list: List): number[] {
  const array: number[] = [];
  while (list != null) {
    array.push(list.first)
    list = list.rest;
  }
  return array;
}

function reversedListCheck(original: List, reversed: List): void {
  const originalArray = listToArray(original);
  const reversedArray = listToArray(reversed);
  expect(reversedArray.reverse()).toEqual(originalArray);
}

test("reverse test", () => {
  for (const list of testLists)
    reversedListCheck(list, reverse(list));
});


function removedZeroesCheck(original: List, removedZeroes: List): void {
  while (original != null && removedZeroes != null) {
    if (original.first != 0) {
      expect(removedZeroes.first).toEqual(original.first);
      removedZeroes = removedZeroes.rest;
    }
    original = original.rest;
  }

  while (original != null && original.first == 0)
    original = original.rest;

  if (original != null)
    fail("list with removed zeroes is too short");

  if (removedZeroes != null)
    fail("list with removed zeroes is too long");
}


test("removeZeroes test", () => {
  for (const list of testLists)
    removedZeroesCheck(list, removeZeroes(list));
});

test("countLeaves test", () => {
  expect(countLeaves({ tag: "bool", value: true })).toEqual(1);

  expect(countLeaves({ tag: "bool", value: false })).toEqual(1);

  expect(countLeaves({
    tag: "not",
    subtree: { tag: "bool", value: true }
  })).toEqual(1);

  expect(countLeaves({
    tag: "not",
    subtree: { tag: "bool", value: false }
  })).toEqual(1);

  expect(countLeaves({
    tag: "not",
    subtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    }
  })).toEqual(1);

  expect(countLeaves({
    tag: "and",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: { tag: "bool", value: false }
  })).toEqual(2);

  expect(countLeaves({
    tag: "and",
    leftSubtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    },
    rightSubtree: { tag: "bool", value: false }
  })).toEqual(2);

  expect(countLeaves({
    tag: "and",
    leftSubtree: {
      tag: "and",
      leftSubtree: { tag: "bool", value: true },
      rightSubtree: { tag: "bool", value: true }
    },
    rightSubtree: {
      tag: "not",
      subtree: { tag: "bool", value: false }
    }
  })).toEqual(3);
});

test("removeNots test", () => {
  expect(removeNots({ tag: "bool", value: true })).toEqual({ tag: "bool", value: true});

  expect(removeNots({ tag: "bool", value: false })).toEqual({ tag: "bool", value: false});

  expect(removeNots({
    tag: "not",
    subtree: { tag: "bool", value: true }
  })).toEqual({
    tag: "bool", value: true
  });

  expect(removeNots({
    tag: "not",
    subtree: { tag: "bool", value: false }
  })).toEqual({
    tag: "bool", value: false
  });

  expect(removeNots({
    tag: "not",
    subtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    }
  })).toEqual({
    tag: "bool", value: true
  });

  expect(removeNots({
    tag: "and",
    leftSubtree: {
      tag: "not",
      subtree: { tag: "bool", value: true }
    },
    rightSubtree: {
      tag: "not",
      subtree: { tag: "bool", value: false }
    }
  })).toEqual({
    tag: "and",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: { tag: "bool", value: false }
  });

  expect(removeNots({
    tag: "not",
    subtree: {
      tag: "and",
      leftSubtree: { tag: "bool", value: true },
      rightSubtree: { tag: "bool", value: false },
    }
  })).toEqual({
    tag: "and",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: { tag: "bool", value: false }
  });

  expect(removeNots({
    tag: "not",
    subtree: {
      tag: "and",
      leftSubtree: {
        tag: "not",
        subtree: {
          tag: "not",
          subtree: {
            tag: "not",
            subtree: { tag: "bool", value: true}
          }
        }
      },
      rightSubtree: {
        tag: "not",
        subtree: {
          tag: "and",
          leftSubtree: { tag: "bool", value: false },
          rightSubtree: { tag: "bool", value: true }
        }
      },
    }
  })).toEqual({
    tag: "and",
    leftSubtree: { tag: "bool", value: true },
    rightSubtree: {
      tag: "and",
      leftSubtree: { tag: "bool", value: false },
      rightSubtree: { tag: "bool", value: true }
    }
  });
});