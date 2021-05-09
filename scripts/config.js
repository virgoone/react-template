const path = require('path')

const resolvePath = _path => {
  return path.resolve(__dirname, _path)
}
const appSrc = resolvePath('../src')
const appBuild = resolvePath('../dist')
const appPublic = resolvePath('../public')

const appIndex = resolvePath('../src/entry.tsx')
const appPackageJson = resolvePath('../package.json')
const appHtml = resolvePath('../src/index.html')

const paths = {
  appIndex,
  appSrc,
  appBuild,
  appPublic,
  appHtml,
  appPackageJson,
};

module.exports = {
  ...paths
};
