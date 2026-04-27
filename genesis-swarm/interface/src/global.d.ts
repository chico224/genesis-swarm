// Genesis-Core Global Definitions — Production
// Supprime toutes les lignes rouges sans node_modules

declare module 'react' {
    export const useRef: <T>(init?: T | null) => { current: T | null };
    export const useMemo: <T>(fn: () => T, deps: any[]) => T;
    export const useState: <T>(init: T | (() => T)) => [T, (v: T | ((p: T) => T)) => void];
    export const useEffect: (fn: () => void | (() => void), deps?: any[]) => void;
    export const useCallback: <T extends (...args: any[]) => any>(fn: T, deps: any[]) => T;
    export const lazy: <T>(fn: () => Promise<{ default: T }>) => T;
    export const Suspense: any;
    export const createElement: any;
    export type FC<P = {}> = (props: P) => any;
    export type ReactNode = any;
    export type ReactElement = any;
    export type CSSProperties = { [key: string]: any };
    export type KeyboardEvent<T = Element> = any;
    const React: any;
    export default React;
}

declare namespace React {
    type CSSProperties = { [key: string]: any };
    type ReactNode = any;
    type FC<P = {}> = (props: P) => any;
    type KeyboardEvent<T = Element> = any;
}

declare namespace JSX {
    interface IntrinsicElements { [k: string]: any; }
}

declare module 'next/font/google' { export const Inter: any; }
declare module 'next/server'       { export const NextRequest: any; export const NextResponse: any; }
declare module '@testing-library/react'       { export const render: any; export const screen: any; export const fireEvent: any; export const waitFor: any; }
declare module '@testing-library/jest-dom';
declare module '@react-three/fiber' { export const Canvas: any; export const useFrame: any; }
declare module '@react-three/drei'  { export const OrbitControls: any; export const Stars: any; }
declare module 'three'              { export const Mesh: any; export type { Mesh }; }
declare module 'zustand'            { export const create: any; }
declare module 'vitest'             { export const vi: any; export const describe: any; export const it: any; export const expect: any; export const beforeEach: any; }
