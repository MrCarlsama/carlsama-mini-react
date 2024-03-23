import { it, describe, expect } from "vitest";
import { React } from "../core/React";

describe("createElement", () => {
  it("should return vdom for element", () => {
    const el = React.createElement("div", null, "hi");

    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hi",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `);

    // expect(el).toEqual({
    //   type: "div",
    //   props: {
    //     children: [
    //       {
    //         type: "TEXT_ELEMENT",
    //         props: {
    //           nodeValue: "hi",
    //           children: [],
    //         },
    //       },
    //     ],
    //   },
    // });
  });

  it("should return element vom", () => {
    const el = React.createElement("div", { id: "app" }, "carl");
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "carl",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `);
  });
});
