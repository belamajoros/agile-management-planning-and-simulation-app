class ProjectError extends Error {
  constructor(message) {
    super(message);
    this.name = ProjectError;
    this.message = message;
  }
}

module.exports = ProjectError;
