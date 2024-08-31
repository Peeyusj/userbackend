export function formatDate(dateString: string): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
  
    const date = new Date(dateString)
    const day = date.getDate()
    const monthIndex = date.getMonth()
    const year = date.getFullYear()
  
    const formattedDate = `${months[monthIndex]} ${day} ${year}`
  
    return formattedDate
  }