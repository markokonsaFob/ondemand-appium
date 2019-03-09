var shell = require('shelljs');
var devices = [];

module.exports = class DeviceManager {

    constructor(){
        this.initAndroidDevices()
    }

    getDevices(){
        return devices;
    }


    initAndroidDevices(){
        this.getConnectedAndroidDevices().forEach(udid => {
            var androidDevice = 
            {
                name: this.getAndroidName(udid).split(/\r?\n/)[0],
                version: this.getAndroidVersion(udid).split(/\r?\n/)[0],
                platvorm: "Android"
            }
            devices.push(androidDevice)
        });

    }


    getConnectedAndroidDevices(){
        const cmd = 'adb devices';
        var data = shell.exec(cmd).stdout
        return data.split(/\r?\n/)
                    .filter((s, i) => i != 0 && s && !s.startsWith('*'))
                    .map(s => s.split('\t')[0])
    }
    

    getAndroidName(udid){
        const cmd = 'adb -s ' + udid + ' shell getprop ro.product.device';
        return shell.exec(cmd).stdout
    }

    getAndroidVersion(udid){
        const cmd = 'adb -s ' + udid + ' shell getprop ro.build.version.release';
        return shell.exec(cmd).stdout
    }
    
}


    

  