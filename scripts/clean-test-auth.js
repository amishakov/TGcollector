const fs = require("fs");
const path = require("path");

const authStateFile = path.resolve(process.cwd(), ".auth/auth-state.json");

if (fs.existsSync(authStateFile)) {
  fs.unlinkSync(authStateFile);
  console.log("Successfully cleared .auth/auth-state.json");
} else {
  console.log("No auth state file to clear.");
}
