const AWS_dynamodb = require('aws-sdk/clients/dynamodb');
let dynamodb = new AWS_dynamodb();

exports.handle = function(e, ctx) {
  if(e.hashemail && e.hashemail.length > 10) {
    dynamodb.getItem({
      TableName: "bk_users", //TODO move to config
      Key: {
        hashemail: {
          S: e.hashemail
        }
      },
      ReturnConsumedCapacity: 'NONE'
    }, (err, result) => {
      if(err) {
        console.log(err);
        return ctx.fail("error");
      }
      if(!result || !result.Item) {
        return ctx.fail("not found");
      }
      ctx.succeed({
        id: result.Item.id.S,
        created: result.Item.created.S,
        locale: result.Item.locale.S,
        crrncs: result.Item.crrncs.S
      });
    });
  } else {
    ctx.fail("error params");
  }
};
