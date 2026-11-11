# fixdevcontainer

Humanely sort top-level keys in `devcontainer.json`

Inspired by [fixpack](https://www.npmjs.com/package/fixpack)!

## ✨ Features

For `devcontainer.json`, sort the top-level keys by category for easier reading.
The specific order is defined by the `predefinedOrder` variable in [fixdevcontainer.js](fixdevcontainer.js).
Keys that are not in that list are kept, reported with a warning, and appended at the end in alphabetical order.

## 🚀 Usage

```shell
# Sorts .devcontainer/devcontainer.json in the current directory
npx fixdevcontainer

# Sorts the given file
npx fixdevcontainer path/to/devcontainer.json
```

The file is rewritten in place (2-space indentation).

## 📑 License

This project is licensed under the [MIT License](LICENSE).
