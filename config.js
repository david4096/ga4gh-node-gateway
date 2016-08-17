var development = {
  grpc: {
    port: 50051,
    host: "0.0.0.0"         // Accept requests from any
  },
  http: {
    port: 3000
  },
  schema_path: 'schemas/src/main/proto'
};

var production = {
  grpc: {
    port: 50051,
    host: "0.0.0.0"         // Accept requests from any
  },
  http: {
    port: 8080
  },
  schema_path: 'schemas/src/main/proto'
};

if (process.env.NODE_ENV == 'production') {
  module.exports = production;
} else {
  module.exports = development;
}