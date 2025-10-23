const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_USER = {
  firstName: 'Demo',
  lastName: 'Patient',
  mobileNumber: '9999888877',
  email: 'demo@vitacare.com',
  aadhaarNumber: '999988887777',
  password: 'Demo@123'
};

let authToken = null;

// Helper function for API calls
const apiCall = async (method, endpoint, data = null, token = null) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {}
  };
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (data) {
    config.data = data;
    config.headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🏥 Testing Health Check...');
  const result = await apiCall('GET', '/../../health');
  
  if (result.success) {
    console.log('✅ Health check passed');
    console.log(`   Status: ${result.data.message}`);
    return true;
  } else {
    console.log('❌ Health check failed');
    console.log(`   Error: ${result.error}`);
    return false;
  }
};

const testRegistration = async () => {
  console.log('\n📝 Testing User Registration...');
  const result = await apiCall('POST', '/auth/register', TEST_USER);
  
  if (result.success) {
    console.log('✅ Registration successful');
    console.log(`   User ID: ${result.data.data.user.id}`);
    console.log(`   Health ID: ${result.data.data.user.healthId}`);
    authToken = result.data.data.token;
    return true;
  } else {
    console.log('❌ Registration failed');
    console.log(`   Error: ${result.error}`);
    if (result.error.includes('already exists')) {
      console.log('   Note: User might already exist, trying login...');
      return await testLogin();
    }
    return false;
  }
};

const testLogin = async () => {
  console.log('\n🔑 Testing User Login...');
  const loginData = {
    mobileNumber: TEST_USER.mobileNumber,
    password: TEST_USER.password
  };
  
  const result = await apiCall('POST', '/auth/login', loginData);
  
  if (result.success) {
    console.log('✅ Login successful');
    console.log(`   User: ${result.data.data.user.firstName} ${result.data.data.user.lastName}`);
    console.log(`   Role: ${result.data.data.user.role}`);
    authToken = result.data.data.token;
    return true;
  } else {
    console.log('❌ Login failed');
    console.log(`   Error: ${result.error}`);
    return false;
  }
};

const testGetProfile = async () => {
  console.log('\n👤 Testing Get Profile...');
  
  if (!authToken) {
    console.log('❌ No auth token available');
    return false;
  }
  
  const result = await apiCall('GET', '/auth/me', null, authToken);
  
  if (result.success) {
    console.log('✅ Profile retrieved successfully');
    console.log(`   Name: ${result.data.data.firstName} ${result.data.data.lastName}`);
    console.log(`   Mobile: ${result.data.data.mobileNumber}`);
    console.log(`   Health ID: ${result.data.data.healthId}`);
    console.log(`   Role: ${result.data.data.role}`);
    return true;
  } else {
    console.log('❌ Profile retrieval failed');
    console.log(`   Error: ${result.error}`);
    return false;
  }
};

const testProtectedRoute = async () => {
  console.log('\n🔐 Testing Protected Route Access...');
  
  if (!authToken) {
    console.log('❌ No auth token available');
    return false;
  }
  
  // Test accessing user data
  const result = await apiCall('GET', '/users/profile', null, authToken);
  
  if (result.success) {
    console.log('✅ Protected route access successful');
    return true;
  } else {
    console.log('❌ Protected route access failed');
    console.log(`   Error: ${result.error}`);
    return false;
  }
};

const testUnauthorizedAccess = async () => {
  console.log('\n🚫 Testing Unauthorized Access...');
  
  const result = await apiCall('GET', '/auth/me', null, null);
  
  if (!result.success && result.status === 401) {
    console.log('✅ Unauthorized access properly blocked');
    return true;
  } else {
    console.log('❌ Unauthorized access not properly blocked');
    console.log(`   Unexpected result: ${JSON.stringify(result)}`);
    return false;
  }
};

const testLogout = async () => {
  console.log('\n🚪 Testing Logout...');
  
  if (!authToken) {
    console.log('❌ No auth token available');
    return false;
  }
  
  const result = await apiCall('POST', '/auth/logout', null, authToken);
  
  if (result.success) {
    console.log('✅ Logout successful');
    authToken = null;
    return true;
  } else {
    console.log('❌ Logout failed');
    console.log(`   Error: ${result.error}`);
    return false;
  }
};

// Main test runner
const runAllTests = async () => {
  console.log('🧪 Starting VitaCare Authentication Tests');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Registration', fn: testRegistration },
    { name: 'Get Profile', fn: testGetProfile },
    { name: 'Protected Route', fn: testProtectedRoute },
    { name: 'Unauthorized Access', fn: testUnauthorizedAccess },
    { name: 'Logout', fn: testLogout }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test "${test.name}" threw an error: ${error.message}`);
      failed++;
    }
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 Test Results Summary');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the backend server and try again.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testHealthCheck, testRegistration, testLogin };