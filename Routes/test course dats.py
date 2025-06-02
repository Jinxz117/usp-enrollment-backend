import requests

# Define the API endpoint for fetching student courses
API_URL = "http://localhost:4149/api/student-courses/3"  # Replace 3 with the correct student ID

# Send GET request to the endpoint
try:
    response = requests.get(API_URL)
    
    # Handle the response
    if response.status_code == 200:
        print("✅ Fetched student courses successfully:")
        courses = response.json()
        if courses:
            for course in courses:
                print(f"Course ID: {course['course_id']} | Course Name: {course['course_name']}")
        else:
            print("⚠️ No courses found for this student.")
    else:
        print(f"⚠️ Unexpected response ({response.status_code}): {response.text}")

except requests.exceptions.RequestException as e:
    print("❌ Request Error:", str(e))