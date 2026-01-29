require("dotenv").config();
const logger = require("./utils/logger");
const emailMonitor = require("./services/emailMonitor");

/**
 * Digital Employee Application
 * Main entry point for the email monitoring service
 */

// Validate required environment variables
const requiredEnvVars = [
  "EMAIL_USER",
  "EMAIL_PASSWORD",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "SMTP_HOST",
  "SMTP_PORT",
];

const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error(
    `Missing required environment variables: ${missingVars.join(", ")}`,
  );
  logger.error("Please create a .env file based on .env.example");
  process.exit(1);
}

// Handle graceful shutdown
const shutdown = () => {
  logger.info("Shutting down Digital Employee...");
  emailMonitor.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the application
const startApplication = async () => {
  try {
    logger.info("=".repeat(60));
    logger.info("Starting Digital Employee...");
    logger.info("=".repeat(60));
    logger.info(`Email: ${process.env.EMAIL_USER}`);
    logger.info(
      `IMAP Host: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT}`,
    );
    logger.info(`SMTP Host: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
    logger.info(
      `Similarity Threshold: ${process.env.SIMILARITY_THRESHOLD || 0.6}`,
    );
    logger.info("=".repeat(60));

    // Initialize email monitor
    emailMonitor.initialize();

    logger.info("Digital Employee is now running and monitoring emails...");
    logger.info("Press Ctrl+C to stop");
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
};

// Start the application
startApplication();
