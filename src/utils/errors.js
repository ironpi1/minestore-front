const SERVER_MESSAGE_FIELDS = ['message', 'mensaje', 'error', 'detail', 'title'];

export function getApiErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;
  const serverMessage = typeof responseData === 'string'
    ? responseData.trim()
    : SERVER_MESSAGE_FIELDS
      .map((field) => responseData?.[field])
      .find((message) => typeof message === 'string' && message.trim());

  if (serverMessage) return serverMessage;
  if (error?.request) {
    return 'No se pudo conectar. Revisa tu conexión e inténtalo nuevamente.';
  }
  if (error?.response) return fallbackMessage;
  return error?.message || fallbackMessage;
}