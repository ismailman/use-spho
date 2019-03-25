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

export type SphoConfigMap = {
    [key:string]: SphoConfig;
}

export function useSpho(config: SphoConfig) {
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

export function useMultipleSpho(configMap: SphoConfigMap){
    const springsRef: MutableRefObject<{[key: string]: Spring} | null> = useRef(null);
    useEffect(() => {
        springsRef.current = {};
        for (let property in configMap){
            const config = configMap[property];
            const spring = new Spring(config.springConfig, config.initialPositions);
            if(config.listeners.onUpdate) spring.onUpdate(config.listeners.onUpdate);
            if(config.listeners.onAtRest) spring.onAtRest(config.listeners.onAtRest);

            springsRef.current[property] = spring;
        }

        return () => {
            if(springsRef.current) {
                for(let property in springsRef.current){
                    springsRef.current[property].end();
                }
            }
        };
    }, []);

    const setFromValue = (property: string, fromValue: number) => {
        const spring = springsRef.current && springsRef.current[property];
        if(!spring) return;
        if(spring) spring.setFromValue(fromValue);
    };

    const setToValue = (property: string, toValue: number) => {
        const spring = springsRef.current && springsRef.current[property];
        if(!spring) return;
        if(spring) spring.setToValue(toValue);
    };

    return [setFromValue, setToValue];
}