# import smtplib
# from email.mime.multipart import MIMEMultipart
# from email.mime.text import MIMEText

# # SendGrid SMTP settings
# SMTP_SERVER = "smtp.sendgrid.net"
# SMTP_PORT = 587  # Use 465 for SSL, 587 for TLS
# SENDGRID_USERNAME = "apikey"  # Use "apikey" as the username
# SENDGRID_API_KEY = ""  # Replace with your actual API key

# # Email details
# SENDER_EMAIL = "v-bimishra@outlook.com"
# RECIPIENT_EMAIL = "v-bimishra@microsoft.com"
# SUBJECT = "Test Email via SendGrid SMTP"
# BODY = "Hello, this is a test email sent using SendGrid SMTP in Python!"

# def send_email():
#     try:
#         # Create email message
#         msg = MIMEMultipart()
#         msg["From"] = SENDER_EMAIL
#         msg["To"] = RECIPIENT_EMAIL
#         msg["Subject"] = SUBJECT
#         msg.attach(MIMEText(BODY, "plain"))

#         # Connect to SendGrid's SMTP server
#         server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
#         server.starttls()  # Secure the connection
#         server.login(SENDGRID_USERNAME, SENDGRID_API_KEY)  # Authenticate
#         server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())  # Send email
#         server.quit()  # Close connection

#         print("Email sent successfully!")
    
#     except Exception as e:
#         print(f"Error sending email: {e}")

# # Send the email
# send_email()


import sendgrid
import os
from sendgrid.helpers.mail import Mail, Email, To, Content

# sg = sendgrid.SendGridAPIClient(api_key=os.environ.get('SENDGRID_API_KEY'))
sg = sendgrid.SendGridAPIClient(api_key="SENDGRID_API_KEY")
from_email = Email("v-bimishra@outlook.com")  # Change to your verified sender
to_email = To("v-bimishra@microsoft.com")  # Change to your recipient
subject = "Sending with SendGrid is Fun"
content = Content("text/plain", "and easy to do anywhere, even with Python")
mail = Mail(from_email, to_email, subject, content)

# Get a JSON-ready representation of the Mail object
mail_json = mail.get()

# Send an HTTP POST request to /mail/send
response = sg.client.mail.send.post(request_body=mail_json)
print(response.status_code)
# print(response.headers)