import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: "us-east-1",
    //endpoint: "http://192.168.1.4:9000/",
    //phone
    //endpoint: "http://192.168.246.40:9000/",
    //endpoint: "http://192.168.43.179:9000/",
    //serverminio
    endpoint: "http://62.146.178.245:9000",
    forcePathStyle: true,
    credentials: {
      //deepa 
      // accessKeyId: "3IwS3yhDtXr7rDw3wsEi",
      // secretAccessKey: "puKrxzhT15F3V1n43qkGr8umubhSwsDT9xfCUom9",
     //serverminio
     // accessKeyId: "QEnVf8HvfU10IXlbPpOk",
     // secretAccessKey: "oXMtS9C3oxVobZ1JuGVU9q7PQnDSL3AzZnjJ7z5E",
     //vinod
     accessKeyId: "UMmgKYXAQFriWVwVcWLP",
     secretAccessKey: "9l02BzE9nR5d9FrTqfHLW13gR6IU4n4V9fPDiPek",
    },
  });