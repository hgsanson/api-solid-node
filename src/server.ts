import { app } from "./app";
import { env } from "./env";

app
	.listen({
		host: "0.0.0.0", // Facilitar a conexão frontend com a API e evitar problemas integração
		port: env.PORT,
	})
	.then(() => {
		console.log("🚀 HTTP Server Running!");
	});
