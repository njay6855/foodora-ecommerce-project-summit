
const handleMicroserviceError = (err, res, fallbackMessage = 'Internal server error') => {
const statusCode = err.response?.status || 500;
  const microserviceMessage = err.response?.data?.message || err.response?.data;

  // Only use the microservice message if it's a safe string
  const isSafeMessage = typeof microserviceMessage === 'string' && microserviceMessage.length < 200;

  const message = isSafeMessage ? microserviceMessage : fallbackMessage;

  // Optionally log the full error details (not shown to client)
  console.error('Microservice error:', {
    statusCode,
    safeMessage: message,
    originalMessage: microserviceMessage,
    details: err.response?.data || err.stack,
  });

  res.status(statusCode).json({ message });
};

module.exports={handleMicroserviceError}
