#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const predefinedOrder = [
  // 基本情報
  "$schema",
  "name",
  // コンテナイメージ・構成
  "image",
  "dockerComposeFile",
  "service",
  "runServices",
  "build",
  // 動作設定
  "shutdownAction",
  "overrideCommand",
  "updateRemoteUserUID",
  "init",
  "privileged",
  // ユーザーと環境設定
  "containerUser",
  "containerEnv",
  "remoteUser",
  "remoteEnv",
  // ポートとネットワーク設定
  "forwardPorts",
  "portsAttributes",
  "otherPortsAttributes",
  // 機能とシークレット
  "features",
  "overrideFeatureInstallOrder",
  "secrets",
  // コマンド実行と待機設定
  "initializeCommand",
  "onCreateCommand",
  "updateContentCommand",
  "postCreateCommand",
  "postStartCommand",
  "postAttachCommand",
  "waitFor",
  // ワークスペースとマウント設定
  "workspaceFolder",
  "appPort",
  "runArgs",
  "workspaceMount",
  // マウント詳細設定
  "type",
  "source",
  "target",
  // ユーザー環境プローブ
  "userEnvProbe",
  // ホスト要件とカスタマイズ
  "hostRequirements",
  "customizations",
  // その他のプロパティ
  "additionalProperties",
];

function loadJson(filename) {
  if (!fs.existsSync(filename)) {
    console.error(`\u001B[31mError: File not found: ${filename}\u001B[0m`);
    return null;
  }

  let inputData;
  try {
    inputData = fs.readFileSync(filename, "utf8");
  } catch (error) {
    console.error(`\u001B[31mError reading file: ${error}\u001B[0m`);
    return null;
  }

  let jsonData;
  try {
    jsonData = JSON.parse(inputData);
  } catch (error) {
    console.error(`\u001B[31mError parsing JSON: ${error}\u001B[0m`);
    return null;
  }

  return jsonData;
}

function formatter(filename) {
  const jsonData = loadJson(filename);
  if (!jsonData) {
    return;
  }

  const sortedJson = {};
  for (const key of predefinedOrder) {
    if (key in jsonData) {
      sortedJson[key] = jsonData[key];
      delete jsonData[key];
    }
  }

  // Handle undefined keys by appending them at the end in alphabetical order
  for (const key of Object.keys(jsonData).sort()) {
    console.warn(
      `\u001B[33mWarning: Undefined key '${key}' found in JSON\u001B[0m`
    ); // Yellow text for warnings
    sortedJson[key] = jsonData[key];
  }

  const outputData = JSON.stringify(sortedJson, null, 2);
  try {
    fs.writeFileSync(filename, outputData, "utf8");
  } catch (error) {
    console.error(`\u001B[31mError writing file: ${error}\u001B[0m`);
    return;
  }

  console.log(
    `\u001B[32mSuccessfully sorted and written back to ${filename}\u001B[0m`
  );
}

exports.formatter = formatter;

const filename =
  process.argv[2] || path.join(".devcontainer", "devcontainer.json");
formatter(filename);
