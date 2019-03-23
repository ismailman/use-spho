import React from 'react';
import Spring, {SpringConfig, SpringValueListener} from 'simple-performant-harmonic-oscillator';

const TRANSFORM_PROPERTIES = [
    'scaleX',
    'scaleY',
    'scaleZ',
    'translateX',
    'translateY',
    'translateZ',
    'rotateX',
    'rotateY',
    'rotateZ',
    'skewX',
    'skewY'
];

const AUTO_PROPERTIES = [
    'width',
    'height',
    'margin',
    'top',
    'right',
    'bottom',
    'left'
];

export type SpringValue = number | 'auto';

export type SpringConfigMap = {
    [key:string]: SpringConfig;
}

export default function getSpringyComponent(WrappedComponent: string, springConfigMap: SpringConfigMap) {

    class SpringyVersion extends React.Component {
        _ref: React.ReactNode;
        _styleSpringMap: Map<string, Spring> = new Map();
        _transformStyleSpringMap: Map<string, Spring> = new Map();
        _springyPropertyKeys: Array<string> = [];
        _stylePropertyValueCollector: {[key: string]: string} = {};
        _transformPropertyValueCollector: {[key: string]: string} = {};

        constructor(props: Object) {
            super(props);

            for(let prop in springConfigMap) {
                const springConfig = springConfigMap[prop];
                const initialFromValue = springConfig.onMountFromValue === 'auto'
                const spring = 
                    new Spring(
                        {
                            stiffness: springConfig.stiffness,
                            damping: springConfig.damping,
                            mass: springConfig.mass,
                            allowOvershooting: springConfig.allowOvershooting,
                            restVelocityThreshold: springConfig.restVelocityThreshold,
                            restDisplacementThreshold: springConfig.restDisplacementThreshold
                        },
                        {
                            fromValue: springConfig.onMountFromValue,
                            toValue: springConfig.onMountToValue
                        }
                    );

                if(springConfig.onUpdate) spring.onUpdate(springConfig.onUpdate);
                if(springConfig.onAtRest) spring.onAtRest(springConfig.onAtRest);

                if(TRANSFORM_PROPERTIES.includes(prop)){
                    this._transformStyleSpringMap.set(prop, spring);
                    this._springyPropertyKeys.push(prop);

                    spring.onUpdate(value => {
                        this._transformPropertyValueCollector[prop] = value;
                        this._scheduleUpdateStyle();
                    });
                }
                else {
                    this._styleSpringMap.set(prop, spring);
                    this._springyPropertyKeys.push(prop);

                    spring.onUpdate((value: number) => {
                        this._stylePropertyValueCollector[prop] = value;
                        this._scheduleUpdateStyle();
                    });
                }
            }
        }

        componentDidUpdate(prevProps: Object){
            for (let prop in this.props) {
                if(this._transformStyleSpringMap.has(prop)) {
                    this._transformStyleSpringMap.get(prop).setToValue(this.props[prop]);
                }
                else if(this._styleSpringMap.has(prop)){
                    if(this.props[prop] === 'auto' && prevProps[prop] !== 'auto'){
                        if(AUTO_PROPERTIES.includes(prop)){
                            //do some FLIP stuff
                        }
                    }
                    else {
                        this._styleSpringMap.get(prop).setToValue(this.props[prop]);
                    }
                }
            }
        }

        componentWillUnmount(){
            for(let spring of this._styleSpringMap.values()) {
                spring.end();
            }

            for(let spring of this._transformStyleSpringMap.values()) {
                spring.end();
            }
        }

        render () {
            let propsWithoutSpringyProperties: {[key: string]: any} = {};
            for(let prop in this.props){
                if(!this._springyPropertyKeys.includes(prop)){
                    propsWithoutSpringyProperties[prop] = this.props[prop];
                }
            }

            return (
                <WrappedComponent
                    ref={r => this._ref = r}
                    {...propsWithoutSpringyProperties}
                />
            );
        }
    }

    return SpringyVersion;

}

/*

const SDiv = getSpringyComponent('div', {
    'transformX': {...},
    'transformY': {...}
});

<SDiv tranformX={10} transformY={20} />



*/