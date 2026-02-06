export interface ExecResult {
  success: boolean;
  code: number;
  stdout: string;
  stderr: string;
}

export async function exec(
  cmd: string[],
  options: { cwd?: string; env?: Record<string, string>; sudo?: boolean } = {}
): Promise<ExecResult> {
  const command = options.sudo ? ["sudo", ...cmd] : cmd;

  try {
    const process = new Deno.Command(command[0], {
      args: command.slice(1),
      cwd: options.cwd,
      env: options.env,
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stdout, stderr } = await process.output();
    const decoder = new TextDecoder();
    
    return {
      success: code === 0,
      code,
      stdout: decoder.decode(stdout),
      stderr: decoder.decode(stderr),
    };
  } catch (error) {
    return {
      success: false,
      code: -1,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function execScript(
  script: string,
  shell: string = "/bin/sh"
): Promise<ExecResult> {
  const process = new Deno.Command(shell, {
    args: ["-c", script],
    stdout: "piped",
    stderr: "piped",
  });
  
  const { code, stdout, stderr } = await process.output();
  const decoder = new TextDecoder();
  
  return {
    success: code === 0,
    code,
    stdout: decoder.decode(stdout),
    stderr: decoder.decode(stderr),
  };
}

export async function which(command: string): Promise<boolean> {
  const result = await exec(["which", command]);
  return result.success;
}