import React, { createContext, useState } from 'react';

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
    const [timeline, setTimeline] = useState([]);

    const addToTimeline = (item) => {
        if (!timeline.some(timelineItem => timelineItem.id === item.id)) {
            setTimeline(prevTimeline => [...prevTimeline, item]);
        }
    };

    return (
        <TimelineContext.Provider value={{ timeline, addToTimeline }}>
            {children}
        </TimelineContext.Provider>
    );
};
