const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocument, 
  GetCommand,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { AWS_REGION, SitioTuristicoTable } = require("../utils/constants");

const dynamodbClient = new DynamoDB({ region: AWS_REGION });
const dynamodb = DynamoDBDocument.from(dynamodbClient);

const getDynamoDBItem = async (id_reserva) => {
  const params = {
    TableName: SitioTuristicoTable,
    Key: {
      id_reserva,
    },
  };
  console.info("GET PARAMS", params);

  try {
    const command = new GetCommand(params);
    const response = await dynamodb.send(command);

    if (response.Item) {
      return response.Item;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const createReserva = async (id_reserva) => {
  try{
    const params = {
      TableName: SitioTuristicoTable,
      Item: {
        id_reserva,
        Nombres: "",
        Apellidos: "",
        Fecha_y_hora: "",
      },

    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.put(params);
  }catch (error) {
    console.error(error);
    throw error;
  }
};


const putDynamoDBItem = async (id_reserva) => {
  const params = {
    TableName: SitioTuristicoTable,
    Item: id_reserva,
  };
  console.info("PUT PARAMS", params);

  try {
    const command = new PutCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const deleteDynamoDBItem = async (id_reserva) => {
  const params = {
    TableName: SitioTuristicoTable,
    Key: id_reserva,
  };
  console.info("DELETE PARAMS", params);

  try {
    const command = new DeleteCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createReserva,
  getDynamoDBItem,
  putDynamoDBItem,
  deleteDynamoDBItem,
};
