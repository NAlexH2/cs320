import "jest-extended";

import {
  AST, PlusNode, NegateNode, NumLeaf, NameLeaf, Scope,
  countNameOccurrences, substituteAllNames, removeDoubleNegations
} from "./Main";

test("countNameOccurrences test", () => {
  expect(
    countNameOccurrences("x", { tag: "num", value: 0 }),
  ).toEqual(0)

  expect(
    countNameOccurrences("x", { tag: "num", value: 1 }),
  ).toEqual(0)

  expect(
    countNameOccurrences("x", { tag: "name", name: "x" }),
  ).toEqual(1)

  expect(
    countNameOccurrences("x", { tag: "name", name: "y" }),
  ).toEqual(0)

  expect(
    countNameOccurrences("xyz", { tag: "name", name: "xyz" }),
  ).toEqual(1)

  expect(
    countNameOccurrences("xyz", { tag: "name", name: "x" }),
  ).toEqual(0)

  expect(
    countNameOccurrences("x", {
      tag: "negate",
      subtree: { tag: "num", value: 1 }
    })
  ).toEqual(0);

  expect(
    countNameOccurrences("x", {
      tag: "negate",
      subtree: { tag: "name", name: "x" }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("y", {
      tag: "negate",
      subtree: { tag: "name", name: "x" }
    })
  ).toEqual(0);

  expect(
    countNameOccurrences("x", {
      tag: "plus",
      leftSubtree: { tag: "name", name: "x" },
      rightSubtree: { tag: "num", value: 10 }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("x", {
      tag: "plus",
      leftSubtree: { tag: "name", name: "x" },
      rightSubtree: { tag: "name", name: "x" }
    })
  ).toEqual(2);

  expect(
    countNameOccurrences("x", {
      tag: "negate",
      subtree: {
        tag: "plus",
        leftSubtree: { tag: "name", name: "x" },
        rightSubtree: { tag: "name", name: "x" }
      }
    })
  ).toEqual(2);

  expect(
    countNameOccurrences("x", {
      tag: "negate",
      subtree: {
        tag: "plus",
        leftSubtree: {
          tag: "negate",
          subtree: { tag: "name", name: "x" }
        },
        rightSubtree: { tag: "name", name: "x" }
      }
    })
  ).toEqual(2);

  expect(
    countNameOccurrences("y", {
      tag: "negate",
      subtree: {
        tag: "plus",
        leftSubtree: {
          tag: "negate",
          subtree: { tag: "name", name: "x" }
        },
        rightSubtree: { tag: "name", name: "y" }
      }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("y", {
      tag: "plus",
      leftSubtree: {
        tag: "negate",
        subtree: {
          tag: "plus",
          leftSubtree: {
            tag: "negate",
            subtree: { tag: "name", name: "x" }
          },
          rightSubtree: { tag: "name", name: "y" }
        }
      },
      rightSubtree: {
        tag: "plus",
        leftSubtree: { tag: "name", name: "x" },
        rightSubtree: {
          tag: "negate",
          subtree: { tag: "num", value: 10 }
        }
      }
    })
  ).toEqual(1);

  expect(
    countNameOccurrences("x", {
      tag: "plus",
      leftSubtree: {
        tag: "negate",
        subtree: {
          tag: "plus",
          leftSubtree: {
            tag: "negate",
            subtree: { tag: "name", name: "x" }
          },
          rightSubtree: { tag: "name", name: "y" }
        }
      },
      rightSubtree: {
        tag: "plus",
        leftSubtree: { tag: "name", name: "x" },
        rightSubtree: {
          tag: "negate",
          subtree: { tag: "num", value: 10 }
        }
      }
    })
  ).toEqual(2);
});

test("substituteAllNames test", () => {
  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      { tag: "num", value: 1 }
    )
  ).toEqual({ tag: "num", value: 1 });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      { tag: "num", value: 0 }
    )
  ).toEqual({ tag: "num", value: 0 });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      { tag: "name", name: "x" }
    )
  ).toEqual({ tag: "num", value: 1 });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      { tag: "name", name: "y" }
    )
  ).toEqual({ tag: "num", value: 2 });

  expect(
    substituteAllNames(
      new Map([["x", 3], ["y", 2]]),
      { tag: "name", name: "x" }
    )
  ).toEqual({ tag: "num", value: 3 });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      {
        tag: "negate",
        subtree: { tag: "name", name: "y" }
      }
    )
  ).toEqual({
    tag: "negate",
    subtree: { tag: "num", value: 2 }
  });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "name", name: "y" }
        }
      }
    )
  ).toEqual({
    tag: "negate",
    subtree: {
      tag: "negate",
      subtree: { tag: "num", value: 2 }
    }
  });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "name", name: "y" }
        }
      }
    )
  ).toEqual({
    tag: "negate",
    subtree: {
      tag: "negate",
      subtree: { tag: "num", value: 2 }
    }
  });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      {
        tag: "plus",
        leftSubtree: {
          tag: "negate",
          subtree: {
            tag: "negate",
            subtree: { tag: "name", name: "x" }
          }
        },
        rightSubtree: { tag: "name", name: "y" }
      }
    )
  ).toEqual({
    tag: "plus",
    leftSubtree: {
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: { tag: "num", value: 1 }
      }
    },
    rightSubtree: { tag: "num", value: 2 }
  });

  expect(
    substituteAllNames(
      new Map([["x", 1], ["y", 2]]),
      {
        tag: "negate",
        subtree: {
          tag: "plus",
          leftSubtree: {
            tag: "negate",
            subtree: {
              tag: "negate",
              subtree: { tag: "name", name: "x" }
            }
          },
          rightSubtree: { tag: "name", name: "y" }
        }
      }
    )
  ).toEqual({
    tag: "negate",
    subtree: {
      tag: "plus",
      leftSubtree: {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "num", value: 1 }
        }
      },
      rightSubtree: { tag: "num", value: 2 }
    }
  });
});

test("removeDoubleNegations test", () => {
  expect(
    removeDoubleNegations({ tag: "num", value: 1 })
  ).toEqual(
    { tag: "num", value: 1 }
  );

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: { tag: "num", value: 1 }
    })
  ).toEqual({
    tag: "negate",
    subtree: { tag: "num", value: 1 }
  });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: { tag: "num", value: 1 }
      }
    })
  ).toEqual({ tag: "num", value: 1 });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: { tag: "num", value: 1 }
      }
    })
  ).toEqual({ tag: "num", value: 1 });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: { tag: "num", value: 2 }
      }
    })
  ).toEqual({ tag: "num", value: 2 });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "num", value: 1 }
        }
      }
    })
  ).toEqual({
    tag: "negate",
    subtree: { tag: "num", value: 1 }
  });

  expect(
    removeDoubleNegations({
      tag: "plus",
      leftSubtree: {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "num", value: 1 }
        }
      },
      rightSubtree: {
        tag: "negate",
        subtree: { tag: "num", value: 1 }
      }
    })
  ).toEqual({
    tag: "plus",
    leftSubtree: { tag: "num", value: 1 },
    rightSubtree: {
      tag: "negate",
      subtree: { tag: "num", value: 1 }
    }
  });

  expect(
    removeDoubleNegations({
      tag: "plus",
      leftSubtree: {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "num", value: 1 }
        }
      },
      rightSubtree: {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: { tag: "num", value: 1 }
        }
      }
    })
  ).toEqual({
    tag: "plus",
    leftSubtree: { tag: "num", value: 1 },
    rightSubtree: { tag: "num", value: 1 }
  });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "plus",
        leftSubtree: {
          tag: "negate",
          subtree: {
            tag: "negate",
            subtree: { tag: "num", value: 1 }
          }
        },
        rightSubtree: {
          tag: "negate",
          subtree: {
            tag: "negate",
            subtree: { tag: "num", value: 1 }
          }
        }
      }
    })
  ).toEqual({
    tag: "negate",
    subtree: {
      tag: "plus",
      leftSubtree: { tag: "num", value: 1 },
      rightSubtree: { tag: "num", value: 1 }
    }
  });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: {
          tag: "plus",
          leftSubtree: {
            tag: "negate",
            subtree: {
              tag: "negate",
              subtree: { tag: "num", value: 1 }
            }
          },
          rightSubtree: {
            tag: "negate",
            subtree: {
              tag: "negate",
              subtree: { tag: "num", value: 1 }
            }
          }
        }
      }
    })
  ).toEqual({
    tag: "plus",
    leftSubtree: { tag: "num", value: 1 },
    rightSubtree: { tag: "num", value: 1 }
  });

  expect(
    removeDoubleNegations({
      tag: "negate",
      subtree: {
        tag: "negate",
        subtree: {
          tag: "negate",
          subtree: {
            tag: "plus",
            leftSubtree: {
              tag: "negate",
              subtree: {
                tag: "negate",
                subtree: { tag: "num", value: 1 }
              }
            },
            rightSubtree: {
              tag: "negate",
              subtree: {
                tag: "negate",
                subtree: {
                  tag: "negate",
                  subtree: { tag: "num", value: 1 }
                }
              }
            }
          }
        }
      }
    })
  ).toEqual({
    tag: "negate",
    subtree: {
      tag: "plus",
      leftSubtree: { tag: "num", value: 1 },
      rightSubtree: {
        tag: "negate",
        subtree: { tag: "num", value: 1 }
      }
    }
  });
});