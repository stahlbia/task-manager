import notificationTemplates from '../plugins/templates/notification.templates.json'

type NotificationTemplate = {
  type: string
  message: string
  placeholders: string[]
}

export function sendNotification(to: string, type: string, data?: object) {
  const template = notificationTemplates.find(
    (t) => t.type === type,
  ) as NotificationTemplate
  if (!template) {
    console.error(
      `{ [NOTIFICATION SERVICE] Notification type ${type} not found. }`,
    )
  }

  let message = template.message
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`
      message = message.replace(placeholder, value)
    })
  }

  console.log(`\x1b[34m{ [NOTIFICATION SERVICE] To: ${to}, ${message} }\x1b[0m`)
}
