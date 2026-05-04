const fs = require('fs');
const path = require('path');

const packageJson = require('./package.json');
//const publicMetaJson = require('./public/meta.json');
//const envFilePath = path.resolve(__dirname, '.env');
const envFilePaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '.env.demo'),
  path.resolve(__dirname, '.env.dev'),
  path.resolve(__dirname, '.env.qa'),
  path.resolve(__dirname, '.env.production'),
  path.resolve(__dirname, '.env.development')
 
];

const currentVersion = packageJson.version;
let [major, minor, patch] = currentVersion.split('.');
major = parseInt(major);
minor = parseInt(minor);
patch = parseInt(patch);

let newVersion = '';

if (patch === 9) {
  let newPatch = 0;
  let newMinor = minor + 1;
  let newMajor = major;

  if (newMinor > 9) {
    newMinor = 0;
    newMajor = major + 1;
  }

  newVersion = `${newMajor}.${newMinor}.${newPatch}`;
} else {
  let newPatch = patch + 1;
  let newMinor = minor;
  let newMajor = major;

  newVersion = `${newMajor}.${newMinor}.${newPatch}`;
}

if (newVersion !== currentVersion) {
  packageJson.version = newVersion;
  //publicMetaJson.version = `V ${newVersion}`;
  fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
  // fs.writeFileSync('./public/meta.json', JSON.stringify(publicMetaJson, null, 2));
  console.log(`Version updated to ${newVersion}`);
} else {
  console.log('No version update required');
}

for (envFilePath of envFilePaths) {
  // Update the version in .env
  const envFileContent = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, 'utf8') : '';
  const envLines = envFileContent.split('\n');
  let versionUpdated = false;
  const updatedEnvLines = envLines.map((line) => {
    if (line.startsWith('VITE_APP_VERSION=')) {
      versionUpdated = true;
      return `VITE_APP_VERSION=V ${newVersion}`;
    }
    return line;
  });

  if (!versionUpdated) {
    updatedEnvLines.push(`VITE_APP_VERSION=V ${newVersion}`);
  }

  fs.writeFileSync(envFilePath, updatedEnvLines.join('\n') + '\n', 'utf8');
}
