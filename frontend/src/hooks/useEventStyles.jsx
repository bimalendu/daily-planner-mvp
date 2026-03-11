import { differenceInMinutes, startOfDay, parseISO } from 'date-fns';

export function useEventStyles() {
    const PIXELS_PER_MINUTE = 1;

    const getStyles = (startTimeStr, endTimeStr) => {
        const start = parseISO(startTimeStr);
        const end = parseISO(endTimeStr);
        const dayStart = startOfDay(start);

        const startOffsetMinutes = differenceInMinutes(start, dayStart);
        const durationMinutes = differenceInMinutes(end, start);

        return {
            top: `${startOffsetMinutes * PIXELS_PER_MINUTE}px`,
            height: `${durationMinutes * PIXELS_PER_MINUTE}px`,
            position: 'absolute',
            width: '90%',
            left: '5%',
        };
    };

    return { getStyles, PIXELS_PER_MINUTE };
}