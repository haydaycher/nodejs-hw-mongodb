import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();

// app.use((req, res, next) => {
//   res.status(404).send({ status: 404, message: "Route not found" });
// });

// app.use((error, req, res, next) => {
//   console.error(error);
//   res.status(500).send({ status: 500, message: "Internal Server Error" });
// });
// app.listen(8080, () => {
//   console.log("Server started on port 8080");
// });
