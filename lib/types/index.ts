//Type used in storing file structure
export interface FileItem {
  name: string;
  type: string;
  files?: FileItem[];
}

//Type used in storing file content
export interface File {
  name: string;
  content: string;
}

export type CodeEditorWindowProps = {
  onChange: (action: string, data: string) => void;
  language?: string;
  code?: string;
  theme?: string;
};
