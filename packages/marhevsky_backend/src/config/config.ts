import dotenv from "dotenv";

dotenv.config();

const MONGO_OPTIONS = {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	socketTimeoutMS: 30000,
	keepAlive: true,
	maxPoolSize: 50,
	autoIndex: false,
	retryWrites: true,
};
const MONGO_HOST = "process.env.mongo";

const MONGO = {
	host: MONGO_HOST,
	options: MONGO_OPTIONS,
	url: "process.env.mongodb",
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.PORT || 1337;
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "coolIssuer";
const SERVER_TOKEN_SECRET =
	process.env.SERVER_TOKEN_SECRET || "superencryptedsecret";

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
	token: {
		expireTime: SERVER_TOKEN_EXPIRETIME,
		issuer: SERVER_TOKEN_ISSUER,
		secret: SERVER_TOKEN_SECRET,
	},
};

const config = {
	mongo: MONGO,
	server: SERVER,
};

export default config;
