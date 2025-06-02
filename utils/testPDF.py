import requests

# Change this URL if your server runs on a different port or host
url = "http://localhost:4149/api/generate-transcript/3"

response = requests.get(url)

if response.status_code == 200:
    with open("transcript_3.pdf", "wb") as f:
        f.write(response.content)
    print("PDF downloaded as transcript_3.pdf")
else:
    print(f"Failed to get PDF. Status code: {response.status_code}")
    print("Response:", response.text)