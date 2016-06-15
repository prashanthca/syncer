var Account = function(){
    this.exec = require('child_process').execSync;
    this.crypto = require('crypto');
}

Account.prototype.add = function(name){
    var emailPart = this.crypto.createHash('md5').update(name).digest('hex').substr(0,6),
        register,
        emailLink;
    register = this.exec('megareg --register --email megaupmind+'+emailPart+'@gmail.com --name '+name+' --password bmsce123').toString();
    emailLink = this.exec('python mail.py');
    return this.exec("megareg "+register.match(/megareg(.*?)\@LINK\@/)[1].trim()+" "+emailLink).toString();
};

module.exports = Account;