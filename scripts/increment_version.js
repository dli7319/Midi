const fs = require('fs')
const semver = require('semver')
const { resolve } = require('path')
const child_process = require('child_process')

const masterVersion = child_process.execSync('npm show @tonejs/midi version').toString()

let version = masterVersion.split('.')
//increment the patch
version[2] = parseInt(version[2]) + 1
//put it back in semver
version = version.join('.')

//write it to the package.json
const packageFile = resolve(__dirname, '../package.json')
const packageObj = JSON.parse(fs.readFileSync(packageFile, 'utf-8'))

//if the package version if the latest, go with that one
if (semver.gt(packageObj.version, version)){
	version = packageObj.version
}

console.log(`incrementing to version ${version}`)
packageObj.version = version
//only if it's travis, update the package.json
if (process.env.TRAVIS){
	fs.writeFileSync(packageFile, JSON.stringify(packageObj, undefined, '  '))
}
