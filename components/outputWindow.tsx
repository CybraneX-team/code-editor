import React, { useEffect, useRef, useState } from "react";
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface OutputDetails {
  status?: { id: number };
  compile_output?: string;
  stdout?: string;
  stderr?: string;
}

const OutputWindow: React.FC<{ outputDetails: OutputDetails }> = ({ outputDetails }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);

  useEffect(() => {
    if (terminalRef.current && !terminal) {
      const newTerminal = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Consolas, "Courier New", monospace',
        theme: {
          background: '#1e1e1e',
        },
      });

      const fitAddon = new FitAddon();
      newTerminal.loadAddon(fitAddon);

      newTerminal.open(terminalRef.current);
      fitAddon.fit();

      setTerminal(newTerminal);
    }

    return () => {
      if (terminal) {
        terminal.dispose();
      }
    };
  }, [terminalRef, terminal]);

  useEffect(() => {
    if (terminal && outputDetails) {
      terminal.clear();
      const output = getOutput();
      if (output) {
        terminal.writeln(output);
      }
    }
  }, [terminal, outputDetails]);

  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      return (
        <pre className="px-2 py-1 text-xs text-red-500">
          {atob(outputDetails?.compile_output!)}
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 text-xs text-green-500">
          {outputDetails.stdout !== null ? `${atob(outputDetails.stdout!)}` : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 text-xs text-red-500">
          {outputDetails?.stderr ? `${atob(outputDetails?.stderr!)}` : ''}
        </pre>
      );
    }
  };


  return (
    <div>
      <h1 className="font-bold text-xl mb-2">Terminal</h1>
      <div 
        ref={terminalRef} 
        className="w-full h-[600px] rounded-md overflow-hidden"
      >        {outputDetails ? <>{getOutput()}</> : null}
</div>
    </div>
  );
};

export default OutputWindow;