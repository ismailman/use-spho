import {useEffect, useRef, MutableRefObject} from 'react';

import Spring, {SpringConfig, SpringValueListener, InitialPositionConfig} from 'simple-performant-harmonic-oscillator';
export {default as Spring, SpringConfig, SpringValueListener, InitialPositionConfig} from 'simple-performant-harmonic-oscillator';

export type Listeners = {
    onUpdate?: SpringValueListener;
    onAtRest?: SpringValueListener;
};

export type SphoConfig = {
    springConfig?: SpringConfig;
    listeners: Listeners;
    initialPositions?: InitialPositionConfig;
};

export default function useSpho(config: SphoConfig) {
    const springRef: MutableRefObject<Spring | null> = useRef(null);
    useEffect(() => {
        springRef.current = new Spring(config.springConfig, config.initialPositions);
        if(config.listeners.onUpdate) springRef.current.onUpdate(config.listeners.onUpdate);
        if(config.listeners.onAtRest) springRef.current.onAtRest(config.listeners.onAtRest);

        return () => {
            if(springRef.current) springRef.current.end();
        };

    }, []);

    const setFromValue = (fromValue: number) => {
        if(springRef.current) springRef.current.setFromValue(fromValue);
    };

    const setToValue = (toValue: number) => {
        if(springRef.current) springRef.current.setToValue(toValue);
    };

    return [setFromValue, setToValue];
}