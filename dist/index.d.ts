import { SpringConfig, SpringValueListener, InitialPositionConfig } from 'simple-performant-harmonic-oscillator';
export { default as Spring, SpringConfig, SpringValueListener, InitialPositionConfig } from 'simple-performant-harmonic-oscillator';
export declare type Listeners = {
    onUpdate?: SpringValueListener;
    onAtRest?: SpringValueListener;
};
export declare type SphoConfig = {
    springConfig?: SpringConfig;
    listeners: Listeners;
    initialPositions?: InitialPositionConfig;
};
export default function useSpho(config: SphoConfig): ((fromValue: number) => void)[];
