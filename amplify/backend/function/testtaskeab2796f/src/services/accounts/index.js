const TableName = require('../../constants/tables').accounts

const AccountsService = (docClient) => ({
  createAccount: async (accountData) => {
    const recordId = (await docClient.scan({
      TableName,
      Select: "COUNT",
    }).promise()).Count

    return await docClient.put({
      TableName,
      ConditionExpression: "attribute_not_exists(email)",
      Item: {
        ...accountData,
        recordId,
      }
      }).promise()
  },
  listAccounts: () => {
    return docClient.scan({TableName}).promise()
  },
  getAccountById: async (id) => {
    const { Items } = await docClient.query({
      TableName,
      ExpressionAttributeNames: {
        "#recordId": "recordId",
      },
      ExpressionAttributeValues: {
        ":id": +id,
      },
      KeyConditionExpression: "#recordId = :id",
    }).promise()

    return Items[0]
  }
})

module.exports = AccountsService;
