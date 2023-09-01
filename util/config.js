import { config } from "dotenv";
config();



const SECRETS = {
  jwt: process.env.JWT_SECRET,
  jwtExp: "100d",
  node_env: process.env.NODE_ENV,
  spacesEndpoint: process.env.DO_SPACES_ENDPOINT,
  spacesAcessKey: process.env.DO_SPACES_ACCESS_KEY,
  spacesSecretKey: process.env.DO_SPACES_SECRET_KEY,
  region: process.env.COGNITO_REGION,
  aws_accessKey_Id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_key_Id: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  send_GRID: process.env.SEND_GRID
};

export { SECRETS };


// previous send grid 
// SEND_Grid=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
// SEND_Grid=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