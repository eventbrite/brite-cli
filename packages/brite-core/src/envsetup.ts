import dotenv from "dotenv";

dotenv.config({
	silent: true,
	path: process.env.ENV_PATH || ".env",
});
