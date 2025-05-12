export function timestampToDate(timestamp, withTime=false) {
    const date = new Date(timestamp+8*60*60*1000);
    const split = date.toISOString().split('T')
    if (withTime) {
        return (split[0] + ' ' + split[1].substring(0,8) );
    }
    return split[0].substring(0,10)
}