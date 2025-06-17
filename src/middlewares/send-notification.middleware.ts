export function sendNotification(to: string, subject: string, message: string) {
  console.log(
    `[NOTIFICATION SERVICE] To: ${to}, Subject: ${subject}, Message: ${message}`,
  )
}
