import React, { createContext, useState } from 'react';

export const TimelineContext = createContext();

export const TimelineProvider = ({ children }) => {
    const [timeline, setTimeline] = useState([]);

    const addToTimeline = (activity) => {
        setTimeline((prevTimeline) => [...prevTimeline, activity]);
    };

    return (
        <TimelineContext.Provider value={{ timeline, addToTimeline }}>
            {children}
        </TimelineContext.Provider>
    );
};
