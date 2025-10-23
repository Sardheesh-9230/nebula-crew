import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  Zoom,
  Slide,
  Avatar,
  Divider,
} from '@mui/material';
import {
  MedicalServices,
  Visibility,
  Description,
  Search,
  FilterList,
  Close,
  Download,
  CalendarToday,
  LocalHospital,
  Science,
  Medication,
  Vaccines,
  MonitorHeart,
} from '@mui/icons-material';
import { getMedicalRecords, getMedicalRecord } from '../redux/slices/recordsSlice';

const MedicalRecords = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { records, currentRecord, loading } = useSelector((state) => state.records);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    dispatch(getMedicalRecords());
  }, [dispatch]);

  const handleViewRecord = (recordId) => {
    dispatch(getMedicalRecord(recordId));
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      prescription: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      lab_report: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      imaging: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      vaccination: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      surgery: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      consultation: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    };
    return colors[type] || 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
  };

  const getRecordIcon = (type) => {
    const icons = {
      prescription: <Medication sx={{ fontSize: 32 }} />,
      lab_report: <Science sx={{ fontSize: 32 }} />,
      imaging: <MonitorHeart sx={{ fontSize: 32 }} />,
      vaccination: <Vaccines sx={{ fontSize: 32 }} />,
      surgery: <LocalHospital sx={{ fontSize: 32 }} />,
      consultation: <MedicalServices sx={{ fontSize: 32 }} />,
    };
    return icons[type] || <Description sx={{ fontSize: 32 }} />;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.metadata.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || record.recordType === selectedType;
    return matchesSearch && matchesType;
  });

  const recordTypes = ['all', ...new Set(records.map(r => r.recordType))];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in timeout={600}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              📋 Medical Records
            </Typography>
            <Typography variant="h6" color="textSecondary">
              View and manage your complete medical history
            </Typography>
          </Box>
        </Fade>

        {/* Search and Filter Section */}
        <Slide direction="down" in timeout={800}>
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <Close />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {recordTypes.map((type) => (
                      <Chip
                        key={type}
                        label={type.replace('_', ' ').toUpperCase()}
                        onClick={() => setSelectedType(type)}
                        variant={selectedType === type ? 'filled' : 'outlined'}
                        sx={{
                          background: selectedType === type ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          color: selectedType === type ? '#fff' : '#667eea',
                          borderColor: '#667eea',
                          fontWeight: 600,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: selectedType === type ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : 'rgba(102, 126, 234, 0.1)',
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Slide>

        {loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="textSecondary">Loading records...</Typography>
          </Box>
        )}

        {!loading && filteredRecords.length === 0 && (
          <Zoom in timeout={1000}>
            <Card sx={{ 
              p: 6, 
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              border: '2px dashed rgba(102, 126, 234, 0.2)',
            }}>
              <MedicalServices sx={{ fontSize: 100, color: '#667eea', opacity: 0.3, mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {searchTerm ? 'No matching records found' : 'No Medical Records Yet'}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {searchTerm 
                  ? 'Try adjusting your search or filters'
                  : 'Your medical records will appear here once they are added by healthcare providers.'
                }
              </Typography>
            </Card>
          </Zoom>
        )}

        {/* Records Grid */}
        <Grid container spacing={3}>
          {filteredRecords.map((record, index) => (
            <Grid item xs={12} md={6} lg={4} key={record._id}>
              <Zoom in timeout={600 + index * 100}>
                <Card sx={{
                  height: '100%',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: getRecordTypeColor(record.recordType),
                  },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Icon and Type */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: getRecordTypeColor(record.recordType),
                          mr: 2,
                        }}
                      >
                        {getRecordIcon(record.recordType)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Chip
                          label={record.recordType.replace('_', ' ').toUpperCase()}
                          size="small"
                          sx={{
                            background: getRecordTypeColor(record.recordType),
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {record.metadata.title}
                    </Typography>

                    {/* Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: '#667eea' }} />
                      <Typography variant="body2" color="textSecondary">
                        {new Date(record.metadata.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Typography>
                    </Box>

                    {/* Description */}
                    {record.metadata.description && (
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {record.metadata.description}
                      </Typography>
                    )}

                    {/* Diagnosis Badge */}
                    {record.metadata.diagnosis && (
                      <Chip
                        label={`Diagnosis: ${record.metadata.diagnosis.substring(0, 20)}...`}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          mb: 1,
                          borderColor: '#667eea',
                          color: '#667eea',
                        }}
                      />
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Additional Info */}
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <Chip
                          icon={<Medication />}
                          label={`${record.prescriptions.length} Rx`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#43e97b', color: '#43e97b' }}
                        />
                      )}
                      {record.labResults && record.labResults.length > 0 && (
                        <Chip
                          icon={<Science />}
                          label={`${record.labResults.length} Labs`}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#f5576c', color: '#f5576c' }}
                        />
                      )}
                    </Box>

                    {/* View Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => handleViewRecord(record._id)}
                      sx={{
                        background: getRecordTypeColor(record.recordType),
                        borderRadius: 2,
                        fontWeight: 600,
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* View Record Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentRecord?.metadata.title}
        </DialogTitle>
        <DialogContent>
          {currentRecord && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Record Type: <Chip label={currentRecord.recordType} size="small" />
              </Typography>
              <Typography variant="body2" gutterBottom>
                Date: {new Date(currentRecord.metadata.date).toLocaleDateString()}
              </Typography>
              
              {currentRecord.metadata.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Description:</Typography>
                  <Typography variant="body2">{currentRecord.metadata.description}</Typography>
                </Box>
              )}

              {currentRecord.metadata.diagnosis && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Diagnosis:</Typography>
                  <Typography variant="body2">{currentRecord.metadata.diagnosis}</Typography>
                </Box>
              )}

              {currentRecord.prescriptions && currentRecord.prescriptions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Prescriptions:</Typography>
                  {currentRecord.prescriptions.map((prescription, index) => (
                    <Paper key={index} sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                      <Typography variant="body2">
                        <strong>{prescription.medicineName}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Dosage: {prescription.dosage} | Frequency: {prescription.frequency}
                      </Typography>
                      <Typography variant="body2">
                        Duration: {prescription.duration}
                      </Typography>
                      {prescription.instructions && (
                        <Typography variant="body2" color="text.secondary">
                          Instructions: {prescription.instructions}
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}

              {currentRecord.labResults && currentRecord.labResults.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Lab Results:</Typography>
                  {currentRecord.labResults.map((result, index) => (
                    <Paper key={index} sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                      <Typography variant="body2">
                        <strong>{result.testName}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Value: {result.value} {result.unit}
                      </Typography>
                      <Typography variant="body2">
                        Normal Range: {result.normalRange}
                      </Typography>
                      <Chip
                        label={result.status}
                        size="small"
                        color={result.status === 'normal' ? 'success' : 'warning'}
                        sx={{ mt: 1 }}
                      />
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalRecords;
