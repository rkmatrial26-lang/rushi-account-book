import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
    value: number;
    formatter: (value: number) => string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, formatter }) => {
    const [displayValue, setDisplayValue] = useState(value);
    // FIX: Initialize useRef with null to satisfy type requirements that might be causing the "Expected 1 arguments, but got 0" error.
    const frameRef = useRef<number | null>(null);
    
    useEffect(() => {
        const startValue = displayValue;
        const endValue = value;
        const duration = 500; // ms
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const easedPercentage = 1 - Math.pow(1 - percentage, 3); // Ease out cubic
            
            const currentValue = startValue + (endValue - startValue) * easedPercentage;
            setDisplayValue(currentValue);

            if (progress < duration) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue); // Ensure it ends exactly on the target value
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <span>{formatter(displayValue)}</span>;
};

export default AnimatedNumber;
