require('./utilities');

function Task() {
    this.do = function (name, task) {
        var async = task && task.length;
        var startdate = new Date();
        console.log('Task ' + name.title + ' starts...');
        if (async) {
            task(function () {
                completion(name, startdate);
            });
        }
        else {
            task();
            completion(name, startdate);
        }
    }

    function completion(name, startdate) {
        var finishedDate = new Date();
        var mstaken = finishedDate.getTime() - startdate.getTime();
        console.log('Task ' + name.title + ' finished - ' + String(mstaken).green + 'ms'.prompt);
    }
}

module.exports = new Task();