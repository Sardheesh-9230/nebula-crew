const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api/v1';
const TEST_USER = {
  mobileNumber: '9999888877',
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
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
      fullError: error.response?.data
    };
  }
};

const runTest = async () => {
  console.log('🧪 Testing Medical Records Fix\n');
  console.log('=' .repeat(60));
  
  // Step 1: Login
  console.log('\n🔑 Step 1: Logging in...');
  const loginResult = await apiCall('POST', '/auth/login', TEST_USER);
  
  if (!loginResult.success) {
    console.log('❌ Login failed:', loginResult.error);
    return;
  }
  
  console.log('✅ Login successful');
  authToken = loginResult.data.data.token;
  console.log(`   Token: ${authToken.substring(0, 20)}...`);
  
  // Step 2: Try to create medical record
  console.log('\n📋 Step 2: Creating medical record...');
  
  const recordData = {
    recordType: 'prescription',
    diagnosis: 'Common Cold',
    symptoms: 'Fever, Cough, Runny nose',
    medications: [
      { name: 'Paracetamol', dosage: '500mg', frequency: '3 times daily', duration: '5 days' }
    ],
    doctorName: 'Dr. Smith',
    hospitalName: 'City Hospital',
    visitDate: new Date().toISOString()
  };
  
  const createResult = await apiCall('POST', '/records', recordData, authToken);
  
  if (createResult.success) {
    console.log('✅ Medical record created successfully!');
    console.log(`   Record ID: ${createResult.data.data?.id || createResult.data.data?._id}`);
    console.log(`   Record Type: ${createResult.data.data?.recordType}`);
    console.log('\n🎉 FIX VERIFIED: Citizens can now create medical records!');
  } else {
    console.log('❌ Medical record creation failed');
    console.log(`   Status: ${createResult.status}`);
    console.log(`   Error: ${createResult.error}`);
    if (createResult.fullError) {
      console.log(`   Details: ${JSON.stringify(createResult.fullError, null, 2)}`);
    }
    console.log('\n⚠️  FIX NOT APPLIED: Backend server needs to be restarted');
    console.log('   💡 Restart the backend server to apply route permission changes');
  }
  
  console.log('\n' + '=' .repeat(60));
};

if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = { runTest };
