import { format, differenceInMinutes, differenceInHours, differenceInDays, differenceInWeeks, differenceInYears } from 'date-fns';

export const formatTimestamp = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    const minutes = differenceInMinutes(now, date);
    const hours = differenceInHours(now, date);
    const days = differenceInDays(now, date);
    const weeks = differenceInWeeks(now, date);
    const years = differenceInYears(now, date);

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days < 7) {
        return `${days} ${days > 1 ? 'days' : 'day'} ago`;
    } else if (years < 1) {
        return format(date, 'dd MMM');
    } else {
        return format(date, 'MMMM yyyy');
    }
}
