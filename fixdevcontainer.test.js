const fs = require("node:fs");
const { formatter } = require("./fixdevcontainer");

// Inputs list keys out of order; expected outputs list them in the order the
// formatter must produce.

// Valid input: known keys are reordered, including a nested object value.
const input1 = {
  additionalProperties: {
    prop1: "value1",
    prop2: "value2",
  },
  workspaceFolder: "/workspace",
  image: "my-dev-container",
  name: "My Dev Container",
};
const expectedOutput1 = {
  name: "My Dev Container",
  image: "my-dev-container",
  workspaceFolder: "/workspace",
  additionalProperties: {
    prop1: "value1",
    prop2: "value2",
  },
};

// Unknown keys are appended after the known keys in alphabetical order.
const input2 = {
  undefinedKey2: "value2",
  undefinedKey1: "value1",
  image: "my-dev-container",
  name: "My Dev Container",
};
const expectedOutput2 = {
  name: "My Dev Container",
  image: "my-dev-container",
  undefinedKey1: "value1",
  undefinedKey2: "value2",
};

const input5 = {
  runArgs: ["--cap-add=SYS_PTRACE"],
  overrideCommand: false,
  runServices: ["app", "db"],
  service: "app",
  dockerComposeFile: "docker-compose.yml",
  name: "My Dev Container",
};
const expectedOutput5 = {
  name: "My Dev Container",
  dockerComposeFile: "docker-compose.yml",
  service: "app",
  runServices: ["app", "db"],
  overrideCommand: false,
  runArgs: ["--cap-add=SYS_PTRACE"],
};

const input3 = {};
const expectedOutput3 = {};

const input4 = "invalid json";
const expectedOutput4 = undefined;

// Mock node:fs so no real file I/O happens
jest.mock("node:fs", () => ({
  existsSync: jest.fn((filename) => {
    return (
      filename === "valid.json" ||
      filename === "undefined_keys.json" ||
      filename === "empty.json" ||
      filename === "compose.json" ||
      filename === "invalid.json"
    );
  }),
  readFileSync: jest.fn((filename, encoding) => {
    if (filename === "valid.json") {
      return JSON.stringify(input1);
    } else if (filename === "undefined_keys.json") {
      return JSON.stringify(input2);
    } else if (filename === "empty.json") {
      return JSON.stringify(input3);
    } else if (filename === "compose.json") {
      return JSON.stringify(input5);
    } else if (filename === "invalid.json") {
      return input4;
    }
  }),
  writeFileSync: jest.fn((filename, data, encoding) => {}),
}));

console.log = jest.fn();

console.warn = jest.fn();

console.error = jest.fn();

describe("formatter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should sort the JSON properties according to the predefined order", () => {
    const filename = "valid.json";
    formatter(filename);
    expect(console.log).toHaveBeenCalledWith(
      `\u001B[32mSuccessfully sorted and written back to ${filename}\u001B[0m`
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "valid.json",
      JSON.stringify(expectedOutput1, null, 2),
      "utf8"
    );
  });

  it("should handle undefined keys by appending them at the end in alphabetical order", () => {
    formatter("undefined_keys.json");
    expect(console.warn).toHaveBeenCalledWith(
      "\u001B[33mWarning: Undefined key 'undefinedKey1' found in JSON\u001B[0m"
    );
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[32mSuccessfully sorted and written back to undefined_keys.json\u001B[0m"
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "undefined_keys.json",
      JSON.stringify(expectedOutput2, null, 2),
      "utf8"
    );
  });

  it("should treat Docker Compose and run-related keys as known keys", () => {
    formatter("compose.json");
    expect(console.warn).not.toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "compose.json",
      JSON.stringify(expectedOutput5, null, 2),
      "utf8"
    );
  });

  it("should handle empty JSON input", () => {
    formatter("empty.json");
    expect(console.log).toHaveBeenCalledWith(
      "\u001B[32mSuccessfully sorted and written back to empty.json\u001B[0m"
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "empty.json",
      JSON.stringify(expectedOutput3, null, 2),
      "utf8"
    );
  });

  it("should handle invalid JSON input", () => {
    formatter("invalid.json");
    expect(console.error).toHaveBeenCalledWith(
      "\u001B[31mError parsing JSON: SyntaxError: Unexpected token 'i', \"invalid json\" is not valid JSON\u001B[0m"
    );
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should handle file read error", () => {
    formatter("nonexistent.json");
    expect(console.error).toHaveBeenCalledWith(
      "\u001B[31mError: File not found: nonexistent.json\u001B[0m"
    );
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  it("should handle file write error", () => {
    fs.writeFileSync.mockImplementationOnce((filename, data, encoding) => {
      throw new Error("Write error");
    });
    formatter("valid.json");
    expect(console.error).toHaveBeenCalledWith(
      "\u001B[31mError writing file: Error: Write error\u001B[0m"
    );
  });
});
