module.exports = (promises)=> {
    const ret = Promise.resolve(null);
    const results = [];

    return promises.reduce(function(result, promise, index) {
         return result.then(function() {
            return promise.then(function(val) {
               results[index] = val;
            });
         });
    }, ret).then(function() {
        return results;
    });
}
