# AWS Integration for Health Monitoring System

This document outlines the AWS services required for the backend of the Health Monitoring System, including setup instructions and integration steps.

## Required AWS Services

| Service            | Purpose                                 | Key Components             |
| ------------------ | --------------------------------------- | -------------------------- |
| Amazon Cognito     | User authentication and authorization   | User pools, Identity pools |
| Amazon DynamoDB    | NoSQL database for user health data     | Tables, Indexes            |
| Amazon S3          | Store static assets and user files      | Buckets, Permissions       |
| AWS Lambda         | Serverless functions for business logic | Functions, API endpoints   |
| Amazon API Gateway | RESTful API endpoints                   | API routes, Authorization  |
| Amazon CloudFront  | Content delivery network                | Distribution               |
| AWS Amplify        | Frontend integration and deployment     | CLI, Libraries             |

## Setup Instructions

### 1. Amazon Cognito (Authentication)

#### User Pool Setup:

1. Go to AWS Cognito Console
2. Create a new User Pool
   - Name: `hms-user-pool`
   - Configure sign-in options (email required, username optional)
   - Enable Multi-Factor Authentication (optional but recommended)
   - Add custom attributes for user type (patient, doctor, admin)
3. Configure app clients:
   - Create an app client named `hms-web-client`
   - Enable necessary auth flows (ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH)

#### Required Information for Integration:

```
User Pool ID: __________________
App Client ID: __________________
Region: __________________
```

### 2. DynamoDB (Database)

#### Tables to Create:

##### Users Table:

```
Table Name: HMS_Users
Partition Key: userId (string)
GSI: userType-createdAt-index
    Partition Key: userType (string)
    Sort Key: createdAt (string)
```

##### Health Metrics Table:

```
Table Name: HMS_HealthMetrics
Partition Key: userId (string)
Sort Key: metricTimestamp (string)
GSI: metricType-timestamp-index
    Partition Key: metricType (string)
    Sort Key: metricTimestamp (string)
```

##### Appointments Table:

```
Table Name: HMS_Appointments
Partition Key: appointmentId (string)
GSI1: userId-timestamp-index
    Partition Key: userId (string)
    Sort Key: appointmentDate (string)
GSI2: doctorId-timestamp-index
    Partition Key: doctorId (string)
    Sort Key: appointmentDate (string)
```

##### Doctors Table:

```
Table Name: HMS_Doctors
Partition Key: doctorId (string)
GSI: specialty-experience-index
    Partition Key: specialty (string)
    Sort Key: experience (number)
```

##### Hospitals Table:

```
Table Name: HMS_Hospitals
Partition Key: hospitalId (string)
GSI: location-index
    Partition Key: location (string)
```

### 3. S3 (Storage)

#### Buckets to Create:

1. `hms-user-documents` - For storing medical reports and user documents
2. `hms-app-assets` - For storing application assets

#### CORS Configuration for user-documents bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["https://your-domain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### 4. Lambda Functions

#### Create the following Lambda functions:

| Function Name              | Purpose                               | Trigger         |
| -------------------------- | ------------------------------------- | --------------- |
| hms-get-user-data          | Retrieve user profile and health data | API Gateway     |
| hms-update-health-metrics  | Record new health metrics             | API Gateway     |
| hms-list-appointments      | Get user's appointments               | API Gateway     |
| hms-create-appointment     | Schedule new appointment              | API Gateway     |
| hms-find-doctors           | Search for doctors by specialty       | API Gateway     |
| hms-find-hospitals         | Find nearby hospitals                 | API Gateway     |
| hms-auth-post-confirmation | Post-registration actions             | Cognito Trigger |

#### Example Lambda function (hms-get-user-data):

```javascript
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const userId = event.requestContext.authorizer.claims.sub;

  try {
    // Get user profile
    const userParams = {
      TableName: "HMS_Users",
      Key: { userId },
    };
    const userResult = await dynamoDB.get(userParams).promise();

    // Get health metrics (last 7 entries)
    const metricParams = {
      TableName: "HMS_HealthMetrics",
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      Limit: 50,
      ScanIndexForward: false,
    };
    const metricsResult = await dynamoDB.query(metricParams).promise();

    // Process and return the data
    return {
      statusCode: 200,
      body: JSON.stringify({
        user: userResult.Item,
        metrics: processMetrics(metricsResult.Items),
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve user data" }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

function processMetrics(items) {
  // Group metrics by type
  const groupedMetrics = {};
  items.forEach((item) => {
    if (!groupedMetrics[item.metricType]) {
      groupedMetrics[item.metricType] = [];
    }
    groupedMetrics[item.metricType].push(item);
  });

  // For each metric type, get latest value and calculate average
  const result = {};
  Object.keys(groupedMetrics).forEach((type) => {
    const metrics = groupedMetrics[type].sort(
      (a, b) => new Date(b.metricTimestamp) - new Date(a.metricTimestamp)
    );

    // Get only the last 7 entries for charts
    const last7 = metrics.slice(0, 7).reverse();

    result[type] = {
      current: metrics[0].value,
      data: last7.map((m) => m.value),
      unit: metrics[0].unit,
      average: calculateAverage(metrics.slice(0, 30)),
    };
  });

  return result;
}

function calculateAverage(metrics) {
  if (metrics.length === 0) return 0;

  const sum = metrics.reduce((acc, curr) => acc + parseFloat(curr.value), 0);
  return (sum / metrics.length).toFixed(1);
}
```

### 5. API Gateway

#### Create a new REST API:

1. Name: `hms-api`
2. Create resources and methods:

| Resource      | Method | Lambda Integration        | Auth    |
| ------------- | ------ | ------------------------- | ------- |
| /user         | GET    | hms-get-user-data         | Cognito |
| /metrics      | POST   | hms-update-health-metrics | Cognito |
| /appointments | GET    | hms-list-appointments     | Cognito |
| /appointments | POST   | hms-create-appointment    | Cognito |
| /doctors      | GET    | hms-find-doctors          | Cognito |
| /hospitals    | GET    | hms-find-hospitals        | Cognito |

3. Enable CORS for all endpoints
4. Deploy the API to a stage (e.g., `prod`)

#### Required Information for Integration:

```
API Gateway Endpoint: __________________
```

### 6. AWS Amplify Setup

1. Install AWS Amplify CLI:

```bash
npm install -g @aws-amplify/cli
```

2. Configure Amplify in your project:

```bash
amplify init
```

3. Add authentication:

```bash
amplify add auth
```

- Select "Manual configuration"
- Enter your Cognito User Pool ID and App Client ID

4. Add API configuration:

```bash
amplify add api
```

- Select "REST API"
- Connect to your existing API Gateway

5. Add storage:

```bash
amplify add storage
```

- Configure S3 bucket access

6. Push configuration:

```bash
amplify push
```

## Required Changes to Your Application

### 1. Install AWS Amplify libraries:

```bash
npm install aws-amplify
```

### 2. Initialize Amplify in your app:

Add to `src/app/_app.tsx` or a global config file:

```jsx
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
```

### 3. Update Login Flow

Replace the simulated login flow with Cognito authentication:

```jsx
import { Auth } from "aws-amplify";

// SignIn function
const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    throw error;
  }
};

// SignUp function
const signUp = async (email, password, attributes) => {
  try {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        ...attributes,
      },
    });
    return user;
  } catch (error) {
    throw error;
  }
};

// Verify OTP function
const confirmSignUp = async (email, code) => {
  try {
    await Auth.confirmSignUp(email, code);
  } catch (error) {
    throw error;
  }
};
```

### 4. Update Data Fetching in Health Dashboard

Replace the local JSON data with API calls:

```jsx
// src/app/user/health/page.tsx
import { API, Auth } from "aws-amplify";

// Inside UserHealthDashboard component
useEffect(() => {
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Get current authenticated user
      const user = await Auth.currentAuthenticatedUser();

      // Fetch user health data from API
      const userData = await API.get("hmsApi", "/user", {});

      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUserData();
}, []);
```

## API Data Formats

### User Data Response Format:

```json
{
  "user": {
    "userId": "abc123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "age": 32,
    "gender": "Male",
    "weight": 75,
    "height": 178,
    "bloodType": "O+",
    "emergencyContact": "+1 234-567-8901",
    "healthStatus": "Excellent",
    "userType": "patient"
  },
  "metrics": {
    "heartRate": {
      "current": 72,
      "average": 75,
      "data": [78, 76, 74, 72, 73, 75, 77],
      "unit": "bpm"
    },
    "bloodPressure": {
      "current": {
        "systolic": 120,
        "diastolic": 80
      },
      "average": {
        "systolic": 122,
        "diastolic": 82
      },
      "data": [
        { "systolic": 125, "diastolic": 85 },
        { "systolic": 123, "diastolic": 83 },
        { "systolic": 122, "diastolic": 82 },
        { "systolic": 120, "diastolic": 80 },
        { "systolic": 121, "diastolic": 81 },
        { "systolic": 124, "diastolic": 84 },
        { "systolic": 123, "diastolic": 83 }
      ],
      "unit": "mmHg"
    }
    // Other metrics...
  },
  "appointments": [
    {
      "appointmentId": "appt1",
      "date": "2023-03-15T10:00:00",
      "doctor": {
        "doctorId": "doc1",
        "name": "Dr. Sarah Johnson",
        "specialty": "General Physician"
      },
      "type": "General Checkup",
      "status": "Completed"
    }
    // More appointments...
  ],
  "assignedDoctor": {
    "doctorId": "doc1",
    "name": "Dr. Sarah Johnson",
    "specialty": "General Physician",
    "experience": "15 years",
    "hospital": "Metro Medical Center",
    "contactNumber": "+1 234-567-8902",
    "email": "dr.johnson@example.com",
    "availability": "Mon-Fri, 9AM-5PM",
    "image": "https://example.com/doctor-image.jpg"
  },
  "nearestHospital": {
    "hospitalId": "hosp1",
    "name": "Metro Medical Center",
    "address": "456 Medical Avenue, Boston, MA 02215",
    "contactNumber": "+1 234-567-8903",
    "emergencyNumber": "+1 234-567-8904",
    "distance": "1.8 km",
    "coordinates": { "lat": 42.3505, "lng": -71.1054 }
  }
}
```

## Information You Need to Provide

After setting up the AWS resources, you'll need to provide:

1. The AWS region you're using
2. Cognito User Pool ID and App Client ID
3. API Gateway endpoint URL
4. The name of your S3 buckets
5. Any customizations to the data structure you want

## Information I'll Need to Update

Once you provide the AWS setup details, I'll need to update:

1. The authentication flow in login pages
2. The data fetching logic in the Health Dashboard
3. Any specific error handling for AWS services
4. Configuration for S3 uploads (if needed)
5. Integration of real-time updates (if applicable)
