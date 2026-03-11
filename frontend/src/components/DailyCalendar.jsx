import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addMinutes, parseISO, startOfDay } from 'date-fns';
import { useEventStyles } from '../hooks/useEventStyles';

// Make sure this points to where you are running your PHP server!
const API_URL = 'http://localhost:8000/api.php';

const fetchBlocks = async (date) => {
    const res = await fetch(`${API_URL}?date=${date}`);
    return res.json();
};

const createBlock = async (newBlock) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlock),
    });
    return res.json();
};

export default function DailyCalendar() {
    const queryClient = useQueryClient();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { getStyles, PIXELS_PER_MINUTE } = useEventStyles();

    const { data: blocks = [], isLoading } = useQuery({
        queryKey: ['timeBlocks', selectedDate],
        queryFn: () => fetchBlocks(selectedDate),
    });

    const mutation = useMutation({
        mutationFn: createBlock,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timeBlocks', selectedDate] });
        },
    });

    const slots = Array.from({ length: 48 }).map((_, i) => {
        return addMinutes(startOfDay(parseISO(selectedDate)), i * 30);
    });

    const handleGridClick = (slotTime) => {
        const durationInput = prompt('Enter duration in minutes (e.g., 30, 60, 90):', '60');
        if (!durationInput || isNaN(durationInput)) return;

        const title = prompt('Enter a title for this block:');
        if (!title) return;

        const duration = parseInt(durationInput, 10);
        const endTime = addMinutes(slotTime, duration);

        mutation.mutate({
            title,
            start_time: format(slotTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
            end_time: format(endTime, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        });
    };

    if (isLoading) return <p>Loading calendar...</p>;

    const totalHeight = 1440 * PIXELS_PER_MINUTE;

    return (
        <div className="calendar">
            <div className="header">
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            <div className="calendar-body">
                <div className="time-labels">
                    {slots.map((slot, i) => (
                        <div
                            key={`label-${i}`}
                            className="label"
                            style={{ height: `${30 * PIXELS_PER_MINUTE}px` }}
                        >
                            {format(slot, 'HH:mm')}
                        </div>
                    ))}
                </div>

                <div className="grid-wrapper" style={{ height: `${totalHeight}px` }}>
                    {slots.map((slot, i) => (
                        <div
                            key={`grid-${i}`}
                            className="grid-cell"
                            style={{
                                top: `${i * 30 * PIXELS_PER_MINUTE}px`,
                                height: `${30 * PIXELS_PER_MINUTE}px`
                            }}
                            onClick={() => handleGridClick(slot)}
                        ></div>
                    ))}

                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            className="event-block"
                            style={getStyles(block.start_time, block.end_time)}
                        >
                            <span className="event-title">{block.title}</span>
                            <span className="event-time">
                                {format(parseISO(block.start_time), 'HH:mm')} - {format(parseISO(block.end_time), 'HH:mm')}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}