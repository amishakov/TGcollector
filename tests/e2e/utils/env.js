const REQUIRED_SETUP_VARS = ["TG_E2E_API_ID", "TG_E2E_API_HASH"];
const REQUIRED_AUTH_VARS = ["TG_E2E_CHANNELS"];

function getMissingVars(names) {
  return names.filter((name) => !process.env[name]);
}

function loadSetupEnv() {
  const missing = getMissingVars(REQUIRED_SETUP_VARS);

  return {
    ready: missing.length === 0,
    missing,
    apiId: process.env.TG_E2E_API_ID,
    apiHash: process.env.TG_E2E_API_HASH,
  };
}

function loadAuthEnv() {
  const missing = getMissingVars(REQUIRED_AUTH_VARS);
  const channels = (process.env.TG_E2E_CHANNELS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    ready: missing.length === 0,
    missing,
    folderName: process.env.TG_E2E_FOLDER_NAME,
    channels,
    collectionName: process.env.TG_E2E_COLLECTION_NAME || "E2E Collection",
    jobName: process.env.TG_E2E_JOB_NAME || "E2E Job",
  };
}

module.exports = {
  loadSetupEnv,
  loadAuthEnv,
};
