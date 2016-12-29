var db = require('./index');

db.fetchAll(10, 1)
  .then(res=> {
    console.log(res);
  })
  .catch(err=> {
    console.log(err);
  })