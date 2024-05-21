const express = require("express");
const multer  = require('multer');
const { StatusCodes } = require("http-status-codes");


const upload = multer({ storage: multer.memoryStorage() });

// Importing the functions from the DynamoDB SDK
const {
  postDynamoDBItem,
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
} = require("../aws/dynamodb");

// Importing the functions from the S3 SDK
const {
  uploadS3File,
  ListS3Files,
  getS3File,
  deleteS3File,
} = require("../aws/s3");

const api = express.Router();

//consulta
api.post("/buscarDatos", async (request, response) => {
  try {
    console.info("BODY", request.body);
    
    // Get the item from DynamoDB
    const dynamoDBItem = await getDynamoDBItem(request.body.id_reserva);
    
    response
      .status(StatusCodes.OK)
      .json({ data:dynamoDBItem});

  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

//crear nueva reserva
api.post("/crearDatos", async (request, response) => {
  try {
    console.info("BODY", request.body);

    // Verificar si el registro con el mismo 'id_reserva' ya existe
    const existingItem = await getDynamoDBItem(request.body.id_reserva);

    if (existingItem) {
      // Si el registro ya existe, devolver un mensaje indicando que ya se ha creado
      return response
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "La reserva ya existe" });
    }
    
    // Si el registro no existe, crearlo
    await postDynamoDBItem(request.body.id_reserva,
      request.body.Nombres,
      request.body.Apellidos,
      request.body.Fecha_y_hora);
    
    response
      .status(StatusCodes.OK)
      .json({ msg: "registro exitoso"});

  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.delete("/eliminarReserva", async (request, response) => {
  try {
    console.info("BODY", request.body);

    // Delete the item from DynamoDB
    await deleteDynamoDBItem(request.body.id_reserva);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Reserva eliminada" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.put("/modificarReserva", async (request, response) => {
  try {
    console.info("BODY", request.body);

    // Delete the item from DynamoDB
    await putDynamoDBItem(request.body.id_reserva,
      request.body.Nombres,
      request.body.Apellidos,
      request.body.Fecha_y_hora);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Reserva modificada" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

/*
//creacion de usuarios
api.post("/path2", upload.single("file"), async (request, response) => {
  try {
    console.info("BODY", request.file);

    const fileInfo = request.file;
    console.info("FILE INFO", fileInfo);

    const { originalname, buffer, mimetype } = fileInfo;

    // Upload a file to S3
    await uploadS3File({ key: originalname, buffer, mimetype });

    // List all files from S3
    const s3Files = await ListS3Files();
    console.info("S3 Files", s3Files);

    // Get the file from S3
    const s3File = await getS3File(originalname);
    console.info(`S3 File With Name ${originalname}`, s3File);

    // Delete the file from S3
    await deleteS3File(originalname);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path2" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});
*/
module.exports = api;
