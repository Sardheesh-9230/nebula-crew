const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const patientHospitalInfoSchema = new mongoose.Schema({
  info_id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true
  },
  hospital_id: {
    type: String,
    required: true,
    index: true
  },
  rho_id: {
    type: String,
    ref: 'RegionalHealthOfficer',
    required: true,
    index: true
  },
  hospital_name: {
    type: String,
    required: true,
    maxlength: 200
  },
  hospital_type: {
    type: String,
    enum: ['PHC', 'CHC', 'SDH', 'DH', 'Specialty', 'Private'],
    required: true
  },
  services_offered: [{
    service_name: {
      type: String,
      required: true
    },
    department: String,
    availability_hours: String,
    cost_range: {
      min: Number,
      max: Number
    },
    insurance_covered: Boolean
  }],
  specialties: [{
    specialty_name: {
      type: String,
      required: true
    },
    doctors_available: Number,
    consultation_fee: Number,
    waiting_time_avg: Number, // in minutes
    appointment_required: {
      type: Boolean,
      default: true
    }
  }],
  operating_hours: {
    opd: {
      start_time: String,
      end_time: String,
      days: [String] // ['Monday', 'Tuesday', ...]
    },
    emergency: {
      available_24x7: {
        type: Boolean,
        default: true
      },
      contact_number: String
    },
    specialty_clinics: {
      start_time: String,
      end_time: String,
      days: [String]
    },
    pharmacy: {
      start_time: String,
      end_time: String,
      days: [String]
    }
  },
  contact_info: {
    phone: {
      type: String,
      required: true
    },
    emergency_phone: String,
    email: String,
    address: {
      street: String,
      district: String,
      taluk: String,
      pincode: String,
      state: {
        type: String,
        default: 'Tamil Nadu'
      }
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  bed_capacity: {
    total_beds: {
      type: Number,
      required: true,
      min: 0
    },
    general_beds: Number,
    icu_beds: Number,
    emergency_beds: Number,
    maternity_beds: Number,
    pediatric_beds: Number,
    isolation_beds: Number
  },
  current_bed_availability: {
    general_available: Number,
    icu_available: Number,
    emergency_available: Number,
    maternity_available: Number,
    pediatric_available: Number,
    isolation_available: Number,
    last_updated: {
      type: Date,
      default: Date.now
    }
  },
  emergency_services: {
    type: Boolean,
    default: true
  },
  appointment_booking_active: {
    type: Boolean,
    default: true
  },
  appointment_slots: {
    slots_per_day: {
      type: Number,
      default: 50
    },
    current_availability: Number,
    next_available_slot: Date,
    booking_advance_days: {
      type: Number,
      default: 7
    }
  },
  patient_rating: {
    average_rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    total_reviews: {
      type: Number,
      default: 0
    },
    rating_breakdown: {
      five_star: { type: Number, default: 0 },
      four_star: { type: Number, default: 0 },
      three_star: { type: Number, default: 0 },
      two_star: { type: Number, default: 0 },
      one_star: { type: Number, default: 0 }
    }
  },
  insurance_accepted: [{
    insurance_name: String,
    coverage_percentage: Number,
    cashless_facility: Boolean,
    pre_authorization_required: Boolean
  }],
  facilities_amenities: [{
    facility_name: String,
    availability: Boolean,
    description: String
  }],
  transport_connectivity: {
    bus_routes: [String],
    nearest_bus_stop: {
      name: String,
      distance_km: Number
    },
    nearest_railway_station: {
      name: String,
      distance_km: Number
    },
    parking_available: Boolean,
    ambulance_service: Boolean
  },
  rho_info: {
    rho_name: String,
    rho_contact: String,
    rho_office_hours: String
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true // RHO or hospital staff who last updated
  }
}, {
  timestamps: true,
  collection: 'patient_hospital_info'
});

// Indexes for patient searches
patientHospitalInfoSchema.index({ 'contact_info.coordinates': '2dsphere' });
patientHospitalInfoSchema.index({ hospital_type: 1, 'services_offered.service_name': 1 });
patientHospitalInfoSchema.index({ 'specialties.specialty_name': 1 });
patientHospitalInfoSchema.index({ 'patient_rating.average_rating': -1 });
patientHospitalInfoSchema.index({ 'contact_info.address.district': 1 });
patientHospitalInfoSchema.index({ appointment_booking_active: 1, emergency_services: 1 });

// Pre-save middleware
patientHospitalInfoSchema.pre('save', function(next) {
  this.last_updated = Date.now();
  next();
});

// Method to update bed availability
patientHospitalInfoSchema.methods.updateBedAvailability = function(bedType, availableCount) {
  if (!this.current_bed_availability) {
    this.current_bed_availability = {};
  }
  
  const fieldName = `${bedType}_available`;
  this.current_bed_availability[fieldName] = availableCount;
  this.current_bed_availability.last_updated = new Date();
  
  return this.save();
};

// Method to add patient review
patientHospitalInfoSchema.methods.addPatientReview = function(rating, reviewText = '') {
  // Update rating breakdown
  const starField = `${rating}_star`;
  this.patient_rating.rating_breakdown[starField]++;
  this.patient_rating.total_reviews++;
  
  // Recalculate average rating
  const breakdown = this.patient_rating.rating_breakdown;
  const totalRating = (breakdown.five_star * 5) + (breakdown.four_star * 4) + 
                     (breakdown.three_star * 3) + (breakdown.two_star * 2) + 
                     (breakdown.one_star * 1);
  
  this.patient_rating.average_rating = (totalRating / this.patient_rating.total_reviews).toFixed(2);
  
  return this.save();
};

// Static method to search hospitals for patients
patientHospitalInfoSchema.statics.searchForPatients = function(searchCriteria) {
  const {
    latitude,
    longitude,
    maxDistance = 50000, // 50km default
    specialty,
    serviceType,
    hospitalType,
    emergencyOnly = false,
    insuranceType,
    minRating = 0
  } = searchCriteria;

  let query = {
    appointment_booking_active: true
  };

  // Location-based search
  if (latitude && longitude) {
    query['contact_info.coordinates'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    };
  }

  // Specialty filter
  if (specialty) {
    query['specialties.specialty_name'] = { $regex: specialty, $options: 'i' };
  }

  // Service type filter
  if (serviceType) {
    query['services_offered.service_name'] = { $regex: serviceType, $options: 'i' };
  }

  // Hospital type filter
  if (hospitalType) {
    query.hospital_type = hospitalType;
  }

  // Emergency services filter
  if (emergencyOnly) {
    query.emergency_services = true;
  }

  // Insurance filter
  if (insuranceType) {
    query['insurance_accepted.insurance_name'] = { $regex: insuranceType, $options: 'i' };
  }

  // Rating filter
  if (minRating > 0) {
    query['patient_rating.average_rating'] = { $gte: minRating };
  }

  return this.find(query)
    .sort({ 'patient_rating.average_rating': -1, 'patient_rating.total_reviews': -1 })
    .limit(50);
};

// Static method to get hospital statistics for RHO dashboard
patientHospitalInfoSchema.statics.getHospitalStatsByRHO = function(rhoId) {
  return this.aggregate([
    {
      $match: { rho_id: rhoId }
    },
    {
      $group: {
        _id: '$hospital_type',
        count: { $sum: 1 },
        avg_rating: { $avg: '$patient_rating.average_rating' },
        total_beds: { $sum: '$bed_capacity.total_beds' },
        avg_occupancy: { 
          $avg: {
            $multiply: [
              {
                $divide: [
                  { $subtract: ['$bed_capacity.total_beds', '$current_bed_availability.general_available'] },
                  '$bed_capacity.total_beds'
                ]
              },
              100
            ]
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('PatientHospitalInfo', patientHospitalInfoSchema);