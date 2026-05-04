function getFormattedDateTime() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const date = new Date();
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${year} ${month} ${day}, ${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
}

export default getFormattedDateTime;
