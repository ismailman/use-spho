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
export declare type SphoConfigMap = {
    [key: string]: SphoConfig;
};
export declare type SetToValue = (value: number) => void;
export declare function useSpho(config: SphoConfig): SetToValue;
export declare type SetToValueForProp = (property: string, toValue: number) => void;
export declare function useMultipleSpho(configMap: SphoConfigMap): SetToValueForProp;
