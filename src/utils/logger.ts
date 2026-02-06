// Simple logger without external dependencies for Deno
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

let verbose = false;

export function setVerbose(v: boolean) {
  verbose = v;
}

export const logger = {
  debug: (msg: string) => {
    if (verbose) {
      console.log(`${colors.gray}[DEBUG]${colors.reset} ${msg}`);
    }
  },
  
  info: (msg: string) => {
    console.log(`${colors.green}[INFO]${colors.reset} ${msg}`);
  },
  
  warn: (msg: string) => {
    console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`);
  },
  
  error: (msg: string) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`);
  },
  
  success: (msg: string) => {
    console.log(`${colors.green}✓ ${msg}${colors.reset}`);
  },
  
  step: (msg: string) => {
    console.log(`${colors.cyan}→ ${msg}${colors.reset}`);
  },
};