// react-file-icon.d.ts
declare module 'react-file-icon' {
    import { FC } from 'react';
    export const FileIcon: FC<{ extension: string, [key: string]: any }>;
    export const defaultStyles: { [key: string]: any };
  }
  