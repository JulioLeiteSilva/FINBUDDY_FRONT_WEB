/// <reference types="vite/client" />

declare module '*.svg' {
    import React = require('react');
    const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string; fillSecondary?: string }>;
    export { ReactComponent };
    const src: string;
    export default src;
}