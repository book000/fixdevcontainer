const fs = require("node:fs");
const { formatter } = require("./main");

// Test case 1: Valid JSON input
const input1 = {
  name: "My Dev Container",
  image: "my-dev-container",
  workspaceFolder: "/workspace",
  additionalProperties: {
    prop1: "value1",
    prop2: "value2",
  },
};
const expectedOutput1 = {
  $schema: undefined,
  name: "My Dev Container",
  image: "my-dev-container",
  dockerComposeFile: undefined,
  service: undefined,
  runServices: undefined,
  build: undefined,
  shutdownAction: undefined,
  overrideCommand: undefined,
  updateRemoteUserUID: undefined,
  init: undefined,
  privileged: undefined,
  containerUser: undefined,
  containerEnv: undefined,
  remoteUser: undefined,
  remoteEnv: undefined,
  forwardPorts: undefined,
  portsAttributes: undefined,
  otherPortsAttributes: undefined,
  features: undefined,
  overrideFeatureInstallOrder: undefined,
  secrets: undefined,
  initializeCommand: undefined,
  onCreateCommand: undefined,
  updateContentCommand: undefined,
  postCreateCommand: undefined,
  postStartCommand: undefined,
  postAttachCommand: undefined,
  waitFor: undefined,
  workspaceFolder: "/workspace",
  appPort: undefined,
  runArgs: undefined,
  workspaceMount: undefined,
  type: undefined,
  source: undefined,
  target: undefined,
  userEnvProbe: undefined,
  hostRequirements: undefined,
  customizations: undefined,
  additionalProperties: {
    prop1: "value1",
    prop2: "value2",
  },
};

// Test case 2: JSON input with undefined keys
const input2 = {
  name: "My Dev Container",
  image: "my-dev-container",
  undefinedKey1: "value1",
  undefinedKey2: "value2",
};
const expectedOutput2 = {
  $schema: undefined,
  name: "My Dev Container",
  image: "my-dev-container",
  dockerComposeFile: undefined,
  service: undefined,
  runServices: undefined,
  build: undefined,
  shutdownAction: undefined,
  overrideCommand: undefined,
  updateRemoteUserUID: undefined,
  init: undefined,
  privileged: undefined,
  containerUser: undefined,
  containerEnv: undefined,
  remoteUser: undefined,
  remoteEnv: undefined,
  forwardPorts: undefined,
  portsAttributes: undefined,
  otherPortsAttributes: undefined,
  features: undefined,
  overrideFeatureInstallOrder: undefined,
  secrets: undefined,
  initializeCommand: undefined,
  onCreateCommand: undefined,
  updateContentCommand: undefined,
  postCreateCommand: undefined,
  postStartCommand: undefined,
  postAttachCommand: undefined,
  waitFor: undefined,
  workspaceFolder: undefined,
  appPort: undefined,
  runArgs: undefined,
  workspaceMount: undefined,
  type: undefined,
  source: undefined,
  target: undefined,
  userEnvProbe: undefined,
  hostRequirements: undefined,
  customizations: undefined,
  additionalProperties: undefined,
  undefinedKey1: "value1",
  undefinedKey2: "value2",
};

// Test case 3: Empty JSON input
const input3 = {};
const expectedOutput3 = {
  $schema: undefined,
  name: undefined,
  image: undefined,
  dockerComposeFile: undefined,
  service: undefined,
  runServices: undefined,
  build: undefined,
  shutdownAction: undefined,
  overrideCommand: undefined,
  updateRemoteUserUID: undefined,
  init: undefined,
  privileged: undefined,
  containerUser: undefined,
  containerEnv: undefined,
  remoteUser: undefined,
  remoteEnv: undefined,
  forwardPorts: undefined,
  portsAttributes: undefined,
  otherPortsAttributes: undefined,
  features: undefined,
  overrideFeatureInstallOrder: undefined,
  secrets: undefined,
  initializeCommand: undefined,
  onCreateCommand: undefined,
  updateContentCommand: undefined,
  postCreateCommand: undefined,
  postStartCommand: undefined,
  postAttachCommand: undefined,
  waitFor: undefined,
  workspaceFolder: undefined,
  appPort: undefined,
  runArgs: undefined,
  workspaceMount: undefined,
  type: undefined,
  source: undefined,
  target: undefined,
  userEnvProbe: undefined,
  hostRequirements: undefined,
  customizations: undefined,
  additionalProperties: undefined,
};

// Test case 4: Invalid JSON input
const input4 = "invalid json";
const expectedOutput4 = undefined;

// Mock the fs.readFileSync and fs.writeFileSync functions
jest.mock("node:fs", () => ({
  existsSync: jest.fn((filename) => {
    return (
      filename === "valid.json" ||
      filename === "undefined_keys.json" ||
      filename === "empty.json" ||
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
    } else if (filename === "invalid.json") {
      return input4;
    }
  }),
  writeFileSync: jest.fn((filename, data, encoding) => {}),
}));

// Mock the console.log function
console.log = jest.fn();

// Mock the console.warn function
console.warn = jest.fn();

// Mock the console.error function
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
