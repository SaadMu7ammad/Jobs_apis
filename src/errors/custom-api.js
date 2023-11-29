class CustomAPIError extends Error {
  constructor(message) {
    console.log('CustomAPIError');

    super(message)
  }
}

module.exports = CustomAPIError
